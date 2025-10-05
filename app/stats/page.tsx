import { StatsOverview } from '@/components/features/stats/stats-overview'

export default function StatsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">统计分析</h1>
        <p className="text-muted-foreground mt-2">
          查看你的使用统计和数据分析
        </p>
      </div>

      <StatsOverview />
    </div>
  )
}





