import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { formatDateTime } from '@/features/audit/api'
import { useHasPermission } from '@/features/auth/auth-context'
import {
  addNote,
  CUSTOMER_SOURCES,
  CUSTOMER_TYPES,
  customerKeys,
  labelOf,
  notesQuery,
  removeNote,
} from '@/features/customers/api'
import { CustomerStatusBadge } from '@/features/customers/components/CustomerStatusBadge'
import type { CustomerTabProps } from '@/features/customers/profile/tabs'

export function OverviewTab({ customer }: CustomerTabProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Customer no.</dt>
            <dd className="font-mono">{customer.customerNumber}</dd>
            <dt className="text-muted-foreground">Type</dt>
            <dd>{labelOf(CUSTOMER_TYPES, customer.type)}</dd>
            {customer.type === 'BUSINESS' ? (
              <>
                <dt className="text-muted-foreground">GSTIN</dt>
                <dd className="font-mono">{customer.taxId ?? '—'}</dd>
              </>
            ) : null}
            <dt className="text-muted-foreground">Phone</dt>
            <dd>{customer.phone ?? '—'}</dd>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="break-all">{customer.email ?? '—'}</dd>
            <dt className="text-muted-foreground">Status</dt>
            <dd>
              <CustomerStatusBadge status={customer.status} />
            </dd>
            <dt className="text-muted-foreground">Source</dt>
            <dd>{customer.source ? labelOf(CUSTOMER_SOURCES, customer.source) : '—'}</dd>
            <dt className="text-muted-foreground">Assigned to</dt>
            <dd>{customer.assignedTo?.name ?? 'Unassigned'}</dd>
            <dt className="text-muted-foreground">Tags</dt>
            <dd className="flex flex-wrap gap-1">
              {customer.tags.length > 0
                ? customer.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))
                : '—'}
            </dd>
            <dt className="text-muted-foreground">Customer since</dt>
            <dd>{formatDateTime(customer.createdAt)}</dd>
          </dl>
        </CardContent>
      </Card>

      <NotesCard customerId={customer.id} />
    </div>
  )
}

function NotesCard({ customerId }: { customerId: string }) {
  const queryClient = useQueryClient()
  const canEdit = useHasPermission('CUSTOMER_UPDATE')
  const notes = useQuery(notesQuery(customerId))
  const [draft, setDraft] = useState('')

  const refresh = () => queryClient.invalidateQueries({ queryKey: customerKeys.detail(customerId) })
  const add = useMutation({
    mutationFn: () => addNote(customerId, draft.trim()),
    onSuccess: () => {
      setDraft('')
      return refresh()
    },
  })
  const remove = useMutation({ mutationFn: (noteId: string) => removeNote(customerId, noteId), onSuccess: refresh })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {canEdit ? (
          <form
            className="grid gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              if (draft.trim() !== '') {
                add.mutate()
              }
            }}
          >
            <Textarea
              aria-label="New note"
              placeholder="Write a note about this customer…"
              maxLength={4000}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            <Button type="submit" size="sm" className="w-fit" disabled={add.isPending || draft.trim() === ''}>
              {add.isPending ? 'Saving…' : 'Add note'}
            </Button>
          </form>
        ) : null}
        {add.error || remove.error ? (
          <ErrorState title="The note could not be saved" error={add.error ?? remove.error} />
        ) : null}

        {notes.isPending ? (
          <Skeleton className="h-16 w-full" aria-busy="true" aria-label="Loading notes" />
        ) : notes.isError ? (
          <ErrorState title="Could not load notes" error={notes.error} onRetry={() => void notes.refetch()} />
        ) : notes.data.items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notes yet.</p>
        ) : (
          <ul className="grid gap-3" aria-label="Notes">
            {notes.data.items.map((note) => (
              <li key={note.id} className="grid gap-1 rounded-md border p-3 text-sm">
                <p className="whitespace-pre-wrap">{note.body}</p>
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>
                    {note.authorName} · {formatDateTime(note.createdAt)}
                  </span>
                  {canEdit ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={remove.isPending}
                      aria-label={`Remove note: ${note.body.slice(0, 40)}`}
                      onClick={() => remove.mutate(note.id)}
                    >
                      Remove
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
