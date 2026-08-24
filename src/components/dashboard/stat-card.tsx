import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
  trend?: { value: number; positive: boolean }
  className?: string
}

export function StatCard({ title, value, icon, description, trend, className }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="text-muted-foreground h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-2xl font-bold">{value}</div>
          {(description || trend) && (
            <div className="flex items-center text-xs mt-1">
              {trend && (
                <span
                  className={cn(
                    "flex items-center font-medium mr-2",
                    trend.positive ? "text-emerald-500" : "text-rose-500"
                  )}
                >
                  {trend.positive ? (
                    <ArrowUpIcon className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDownIcon className="mr-1 h-3 w-3" />
                  )}
                  {trend.value}%
                </span>
              )}
              {description && <span className="text-muted-foreground">{description}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
