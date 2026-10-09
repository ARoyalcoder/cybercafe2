import { Hourglass } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

/** Shown for a profile tab whose module has not been built. */
export function NotBuiltYetTab({ label, plural }: { label: string; plural: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-2 py-6">
        <Hourglass className="size-5 text-muted-foreground" aria-hidden="true" />
        <h2 className="text-base font-semibold">{label} are not available yet</h2>
        <p className="text-sm text-muted-foreground">
          This customer's {plural} will appear here once that part of the system is built.
        </p>
      </CardContent>
    </Card>
  )
}
