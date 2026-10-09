import { useQuery } from '@tanstack/react-query'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ActivityItems } from '@/features/audit/components/ActivityTimeline'
import { customerActivityQuery } from '@/features/customers/api'
import type { CustomerTabProps } from '@/features/customers/profile/tabs'

/** Everything that has happened to the customer record, including its contacts, addresses and notes. */
export function ActivitiesTab({ customer }: CustomerTabProps) {
  const activity = useQuery(customerActivityQuery(customer.id))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Who changed what on this customer, newest first.</CardDescription>
      </CardHeader>
      <CardContent>
        {activity.isPending ? (
          <Skeleton className="h-24 w-full" aria-busy="true" aria-label="Loading activity" />
        ) : activity.isError ? (
          <ErrorState title="Could not load activity" error={activity.error} onRetry={() => void activity.refetch()} />
        ) : activity.data.items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
        ) : (
          <ActivityItems items={activity.data.items} />
        )}
      </CardContent>
    </Card>
  )
}
