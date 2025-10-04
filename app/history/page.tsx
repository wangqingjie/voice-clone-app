import { HistoryList } from '@/components/features/history/history-list'

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">历史记录</h1>
        <p className="text-muted-foreground mt-2">
          查看、播放和管理你的语音生成历史
        </p>
      </div>

      <HistoryList />
    </div>
  )
}




