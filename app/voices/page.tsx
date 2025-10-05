import { VoicesList } from '@/components/features/voices/voices-list'

export default function VoicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">声音库</h1>
        <p className="text-muted-foreground mt-2">
          管理你的声音模型，选择用于TTS生成
        </p>
      </div>

      <VoicesList />
    </div>
  )
}





