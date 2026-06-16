import {
    Routes,
    Route,
} from "react-router-dom";

import Login from "../pages/auth/Login";

import Dashboard from "../pages/dashboard/Dashboard";
import AuthSuccess from "../pages/auth/AuthSuccess";
import ProtectedRoute from "../components/common/ProtectedRoute";
import FolderList from "../pages/folders/FolderList";
import FolderDetails from "../pages/folders/FolderDetail";
import Subscription from "../pages/subscription/Subscription";
import PaymentHistory from "../pages/payments/PaymentHistory";
import Settings from "../settings/Settings";
import PaymentSuccess from "../pages/payments/PaymentSuccess";
import PaymentFailed from "../pages/payments/PaymentFailed";
import PublicUpload from "../pages/public/PublicUpload";
import QrPage from "../pages/qr/QrPage";
 

export default function AppRoutes() {


    return (
        <Routes>
            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/auth/success"
                element={<AuthSuccess />}
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/folders"
                element={
                    <ProtectedRoute>
                        <FolderList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/folders/:id"
                element={
                    <ProtectedRoute>
                        <FolderDetails />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/subscription"
                element={
                    <ProtectedRoute>
                        <Subscription />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/payments"
                element={
                    <ProtectedRoute>
                        <PaymentHistory />
                    </ProtectedRoute>
                }
            />


            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <Settings />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/payment-success"
                element={
                    <PaymentSuccess />
                }
            />

            <Route
                path="/payment-failed"
                element={
                    <PaymentFailed />
                }
            />


            <Route
                path="/user/:slug"
                element={<PublicUpload />}
            />
            <Route
                path="/qr"
                element={
                    <ProtectedRoute>
                        <QrPage />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
}