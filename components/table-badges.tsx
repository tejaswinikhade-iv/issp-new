import { Badge } from '@/components/ui/badge'

export function TableBadge({
  status,
}: {
  status: string
}) {

  const running =
    status.toLowerCase() === 'running'

  return (
    <Badge
      className={
        running
          ? 'bg-green-900 text-green-300'
          : 'bg-yellow-900 text-yellow-300'
      }
    >
      {status}
    </Badge>
  )
}