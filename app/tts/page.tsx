import { TTSForm } from '@/components/features/tts/tts-form'

export default function TTSPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">文本转语音</h1>
        <p className="text-muted-foreground mt-2">
          输入文本，选择声音，生成自然流畅的语音
        </p>
      </div>

      <TTSForm />
    </div>
  )
}





