package com.pawanputra.bos.identity.internal;

import com.pawanputra.bos.identity.api.PasswordResetNotifier;
import com.pawanputra.bos.identity.api.SessionRevocationReason;
import com.pawanputra.bos.identity.api.UserStatus;
import com.pawanputra.bos.platform.error.ApiException;
import com.pawanputra.bos.platform.error.BusinessRuleException;
import com.pawanputra.bos.platform.error.ErrorCode;
import com.pawanputra.bos.platform.security.AccessTokenIssuer;
import com.pawanputra.bos.platform.security.AccessTokenIssuer.AccessToken;
import com.pawanputra.bos.platform.security.CurrentUser;
import java.time.Clock;
import java.time.Instant;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Sign-in, token refresh, sign-out and password management.
 *
 * <p>Security properties this class is responsible for:
 * <ul>
 *   <li>A wrong email, a wrong password and a locked account are indistinguishable to the caller.</li>
 *   <li>Refresh tokens are single-use; presenting a used one revokes the whole session.</li>
 *   <li>Changing or resetting a password signs the user out of every other device.</li>
 *   <li>Asking for a password reset never reveals whether the email exists.</li>
 * </ul>
 */
@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private static final String INVALID_CREDENTIALS_MESSAGE = "Invalid email or password";
    private static final String SESSION_ENDED_MESSAGE = "Your session has ended. Please sign in again.";
    private static final String INVALID_RESET_TOKEN_MESSAGE = "This password reset link is invalid or has expired";

    private final UserRepository users;
    private final UserSessionRepository sessions;
    private final RefreshTokenRepository refreshTokens;
    private final PasswordResetTokenRepository resetTokens;
    private final SessionService sessionService;
    private final PasswordEncoder passwordEncoder;
    private final AccessTokenIssuer accessTokenIssuer;
    private final PasswordResetNotifier resetNotifier;
    private final AuthProperties properties;
    private final Clock clock;

    /** Verified when the email is unknown, so that case takes as long as a wrong password. */
    private final String timingEqualisationHash;

    public AuthService(
            UserRepository users,
            UserSessionRepository sessions,
            RefreshTokenRepository refreshTokens,
            PasswordResetTokenRepository resetTokens,
            SessionService sessionService,
            PasswordEncoder passwordEncoder,
            AccessTokenIssuer accessTokenIssuer,
            PasswordResetNotifier resetNotifier,
            AuthProperties properties,
            Clock clock) {
        this.users = users;
        this.sessions = sessions;
        this.refreshTokens = refreshTokens;
        this.resetTokens = resetTokens;
        this.sessionService = sessionService;
        this.passwordEncoder = passwordEncoder;
        this.accessTokenIssuer = accessTokenIssuer;
        this.resetNotifier = resetNotifier;
        this.properties = properties;
        this.clock = clock;
        this.timingEqualisationHash = passwordEncoder.encode(SecureTokens.generate());
    }

    /**
     * @param refreshToken          the secret to hand to the client; it is not stored and cannot be recovered
     * @param refreshTokenExpiresAt when the client's refresh token stops working if unused
     */
    public record IssuedTokens(AccessToken accessToken, String refreshToken, Instant refreshTokenExpiresAt, User user) {
    }

    // The failed-attempt counter and the lock must be saved even though the method ends in an exception.
    @Transactional(noRollbackFor = ApiException.class)
    public IssuedTokens login(String email, String password, ClientInfo client) {
        Instant now = clock.instant();
        Optional<User> found = users.findWithRolesByEmail(User.normalizeEmail(email));
        if (found.isEmpty()) {
            passwordEncoder.matches(password, timingEqualisationHash);
            throw invalidCredentials();
        }
        User user = found.get();

        if (user.isLocked(now)) {
            // Same work as a wrong password, so a lock cannot be detected by timing.
            passwordEncoder.matches(password, timingEqualisationHash);
            log.warn("Sign-in refused, account locked: userId={}", user.getId());
            throw invalidCredentials();
        }
        if (user.getPasswordHash() == null || !passwordEncoder.matches(password, user.getPasswordHash())) {
            user.recordFailedLogin(now, properties.maxFailedLogins(), properties.lockDuration());
            if (user.isLocked(now)) {
                log.warn("Account locked after repeated failed sign-ins: userId={}", user.getId());
            }
            throw invalidCredentials();
        }
        // Only someone who knows the password learns that the account is switched off.
        if (!user.isActive()) {
            throw new ApiException(ErrorCode.ACCOUNT_INACTIVE,
                    "This account is not active. Contact your administrator.");
        }

        user.recordSuccessfulLogin(now);
        UserSession session = sessions.save(
                new UserSession(user, client, now, now.plus(properties.sessionMaxLifetime())));
        log.info("Signed in: userId={} sessionId={}", user.getId(), session.getId());
        return issueTokens(user, session, now);
    }

    // The reuse-triggered revocation must be saved even though the method ends in an exception.
    @Transactional(noRollbackFor = ApiException.class)
    public IssuedTokens refresh(String rawRefreshToken, ClientInfo client) {
        Instant now = clock.instant();
        RefreshToken token = Optional.ofNullable(rawRefreshToken)
                .flatMap(raw -> refreshTokens.findByTokenHash(SecureTokens.hash(raw)))
                .orElseThrow(AuthService::sessionEnded);
        UserSession session = token.getSession();

        if (token.isUsed()) {
            // A token that was already exchanged is being presented again: either the legitimate
            // client or a thief holds a stale copy. We cannot tell which, so nobody keeps the session.
            session.revoke(SessionRevocationReason.TOKEN_REUSE, now);
            log.warn("Refresh token reuse detected, session revoked: userId={} sessionId={}",
                    session.getUser().getId(), session.getId());
            throw sessionEnded();
        }
        if (token.isExpired(now) || !session.isUsable(now)) {
            throw sessionEnded();
        }
        User user = users.findWithRolesById(session.getUser().getId()).orElse(null);
        if (user == null || !user.isActive()) {
            session.revoke(SessionRevocationReason.ACCOUNT_DEACTIVATED, now);
            throw sessionEnded();
        }

        token.markUsed(now);
        session.seenFrom(client, now);
        return issueTokens(user, session, now);
    }

    /** Ends the session the refresh token belongs to. Unknown or missing tokens are ignored. */
    @Transactional
    public void logout(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            return;
        }
        refreshTokens.findByTokenHash(SecureTokens.hash(rawRefreshToken)).ifPresent(token -> {
            UserSession session = token.getSession();
            session.revoke(SessionRevocationReason.LOGOUT, clock.instant());
            log.info("Signed out: userId={} sessionId={}", session.getUser().getId(), session.getId());
        });
    }

    /** Fresh from the database, unlike the snapshot inside the access token. */
    @Transactional(readOnly = true)
    public User loadCurrentUser(CurrentUser current) {
        return users.findWithRolesById(current.id())
                .filter(User::isActive)
                .orElseThrow(() -> new ApiException(ErrorCode.UNAUTHENTICATED, SESSION_ENDED_MESSAGE));
    }

    /** The device making the request stays signed in; every other device is signed out. */
    @Transactional
    public void changePassword(CurrentUser current, String currentPassword, String newPassword) {
        User user = users.findById(current.id())
                .orElseThrow(() -> new ApiException(ErrorCode.UNAUTHENTICATED, SESSION_ENDED_MESSAGE));
        if (user.getPasswordHash() == null || !passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new BusinessRuleException("The current password is incorrect");
        }
        if (passwordEncoder.matches(newPassword, user.getPasswordHash())) {
            throw new BusinessRuleException("The new password must be different from the current one");
        }
        user.changePassword(passwordEncoder.encode(newPassword), clock.instant());
        sessionService.revokeAll(user.getId(), SessionRevocationReason.PASSWORD_CHANGED, current.sessionId());
        log.info("Password changed: userId={}", user.getId());
    }

    /**
     * Starts a reset if the email belongs to a user who is allowed to sign in (or was invited and has
     * not set a password yet). Returns normally in every case so callers cannot probe for accounts.
     */
    @Transactional
    public void requestPasswordReset(String email) {
        Optional<User> found = users.findByEmail(User.normalizeEmail(email));
        if (found.isEmpty()) {
            return;
        }
        User user = found.get();
        if (user.getStatus() != UserStatus.ACTIVE && user.getStatus() != UserStatus.INVITED) {
            return;
        }
        Instant now = clock.instant();
        // Only the newest link works.
        resetTokens.findAllByUserIdAndUsedAtIsNull(user.getId()).forEach(old -> old.markUsed(now));

        String rawToken = SecureTokens.generate();
        Instant expiresAt = now.plus(properties.passwordResetTokenTtl());
        resetTokens.save(new PasswordResetToken(user, SecureTokens.hash(rawToken), expiresAt));
        resetNotifier.sendPasswordReset(user.getId(), user.getEmail(), user.getFullName(), rawToken, expiresAt);
        log.info("Password reset requested: userId={}", user.getId());
    }

    /** Sets a new password, signs the user out everywhere, and activates an invited user. */
    @Transactional
    public void resetPassword(String rawToken, String newPassword) {
        Instant now = clock.instant();
        PasswordResetToken token = resetTokens.findByTokenHash(SecureTokens.hash(rawToken))
                .filter(candidate -> candidate.isUsable(now))
                .orElseThrow(() -> new BusinessRuleException(INVALID_RESET_TOKEN_MESSAGE));
        User user = token.getUser();
        if (user.isDeleted()
                || (user.getStatus() != UserStatus.ACTIVE && user.getStatus() != UserStatus.INVITED)) {
            throw new BusinessRuleException(INVALID_RESET_TOKEN_MESSAGE);
        }
        token.markUsed(now);
        user.changePassword(passwordEncoder.encode(newPassword), now);
        sessionService.revokeAll(user.getId(), SessionRevocationReason.PASSWORD_RESET, null);
        log.info("Password reset completed: userId={}", user.getId());
    }

    private IssuedTokens issueTokens(User user, UserSession session, Instant now) {
        String rawToken = SecureTokens.generate();
        Instant idleLimit = now.plus(properties.refreshTokenTtl());
        Instant expiresAt = idleLimit.isBefore(session.getExpiresAt()) ? idleLimit : session.getExpiresAt();
        refreshTokens.save(new RefreshToken(session, SecureTokens.hash(rawToken), expiresAt));

        AccessToken accessToken = accessTokenIssuer.issue(new CurrentUser(
                user.getId(),
                session.getId(),
                user.getOrganization().getId(),
                user.getEmail(),
                user.activeRoleCodes(),
                user.activePermissionCodes()));
        return new IssuedTokens(accessToken, rawToken, expiresAt, user);
    }

    private static ApiException invalidCredentials() {
        return new ApiException(ErrorCode.INVALID_CREDENTIALS, INVALID_CREDENTIALS_MESSAGE);
    }

    private static ApiException sessionEnded() {
        return new ApiException(ErrorCode.UNAUTHENTICATED, SESSION_ENDED_MESSAGE);
    }
}
