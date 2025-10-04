"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ttsApi } from '@/lib/api/tts'
import { AudioPlayer } from '@/components/shared/audio-player'
import { Loader2 } from 'lucide-react'

// Azure 中文声音列表
const AZURE_VOICES = [
  { id: 'zh-CN-XiaoxiaoNeural', name: '晓晓（女声-通用）', gender: 'female' },
  { id: 'zh-CN-YunxiNeural', name: '云希（男声-通用）', gender: 'male' },
  { id: 'zh-CN-YunyangNeural', name: '云扬（男声-通用）', gender: 'male' },
  { id: 'zh-CN-XiaoyiNeural', name: '晓伊（女声-通用）', gender: 'female' },
  { id: 'zh-CN-YunjianNeural', name: '云健（男声-通用）', gender: 'male' },
  { id: 'zh-CN-XiaochenNeural', name: '晓辰（女声-通用）', gender: 'female' },
  { id: 'zh-CN-XiaohanNeural', name: '晓涵（女声-通用）', gender: 'female' },
  { id: 'zh-CN-XiaomoNeural', name: '晓墨（女声-通用）', gender: 'female' },
  { id: 'zh-CN-XiaoruiNeural', name: '晓睿（女声-通用）', gender: 'female' },
  { id: 'zh-CN-XiaoxuanNeural', name: '晓萱（女声-通用）', gender: 'female' },
  { id: 'zh-CN-YunfengNeural', name: '云枫（男声-通用）', gender: 'male' },
  { id: 'zh-CN-YunhaoNeural', name: '云皓（男声-通用）', gender: 'male' },
  { id: 'zh-CN-YunxiaNeural', name: '云夏（男声-通用）', gender: 'male' },
  { id: 'zh-CN-YunyeNeural', name: '云野（男声-通用）', gender: 'male' },
  { id: 'zh-CN-YunzeNeural', name: '云泽（男声-通用）', gender: 'male' },
]

// 表单验证 Schema
const formSchema = z.object({
  text: z.string().min(1, '请输入文本').max(5000, '文本不能超过 5000 字符'),
  voiceId: z.string().optional(),
  model: z.enum(['speech-1.5', 'speech-1.6', 's1']),
  format: z.enum(['mp3', 'wav']),
})

type FormData = z.infer<typeof formSchema>

export function TTSForm() {
  const [loading, setLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      voiceId: 'zh-CN-XiaoxiaoNeural',
      model: 'speech-1.5',
      format: 'mp3',
    },
  })

  const textValue = form.watch('text')
  const characterCount = textValue?.length || 0

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      setAudioUrl(null)
      
      console.log('[TTS Form] Submitting:', data)
      const response = await ttsApi.generate(data)
      console.log('[TTS Form] Response:', response)
      console.log('[TTS Form] Audio Data received:', response.audioData ? 'YES' : 'NO')
      console.log('[TTS Form] Audio Data length:', response.audioData?.length || 0)
      console.log('[TTS Form] Audio Data preview:', response.audioData?.substring(0, 100))
      
      setResult(response)
      
      // 使用 audioData（base64）而不是 audioUrl
      if (response.audioData) {
        setAudioUrl(response.audioData)
        console.log('[TTS Form] Audio URL set successfully')
      } else {
        console.error('[TTS Form] No audio data in response!')
      }
      
      toast.success('生成成功！', {
        description: '语音已生成，可以播放或下载',
      })
    } catch (error) {
      console.error('TTS Error:', error)
      toast.error('生成失败', {
        description: error instanceof Error ? error.message : '请稍后重试',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* 输入区 */}
      <Card>
        <CardHeader>
          <CardTitle>输入设置</CardTitle>
          <CardDescription>输入要转换的文本并配置选项</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* 文本输入 */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="text">输入文本</Label>
                <span className="text-sm text-muted-foreground">
                  {characterCount} / 5000
                </span>
              </div>
              <Textarea
                id="text"
                placeholder="在这里输入要转换为语音的文本..."
                className="min-h-[200px] resize-none"
                {...form.register('text')}
              />
              {form.formState.errors.text && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.text.message}
                </p>
              )}
            </div>

            {/* 声音选择 */}
            <div className="space-y-2">
              <Label>声音选择</Label>
              <Select
                value={form.watch('voiceId')}
                onValueChange={(value: any) => form.setValue('voiceId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择声音" />
                </SelectTrigger>
                <SelectContent>
                  {AZURE_VOICES.map((voice) => (
                    <SelectItem 
                      key={voice.id} 
                      value={voice.id}
                    >
                      {voice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                💡 使用 Azure 提供的15个专业中文声音
              </p>
            </div>

            {/* 模型选择（保留，但不影响Azure TTS）*/}
            <div className="space-y-2">
              <Label>语音质量</Label>
              <Select
                value={form.watch('model')}
                onValueChange={(value: any) => form.setValue('model', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="speech-1.5">标准（推荐）</SelectItem>
                  <SelectItem value="speech-1.6">高质量</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 格式选择 */}
            <div className="space-y-2">
              <Label>音频格式</Label>
              <Select
                value={form.watch('format')}
                onValueChange={(value: any) => form.setValue('format', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mp3">MP3</SelectItem>
                  <SelectItem value="wav">WAV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 生成按钮 */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading || characterCount === 0}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? '生成中...' : '🎵 生成语音'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 结果区 */}
      <Card>
        <CardHeader>
          <CardTitle>生成结果</CardTitle>
          <CardDescription>
            {audioUrl ? '语音已生成，可以播放或下载' : '等待生成'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {audioUrl ? (
            <div className="space-y-4">
              <AudioPlayer src={audioUrl} />
              
              {result && (
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>文件大小: {(result.fileSize / 1024).toFixed(2)} KB</p>
                  <p>模型: {result.model}</p>
                  <p>格式: {result.format.toUpperCase()}</p>
                  <p>时长: 约 {result.duration} 秒</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <a href={audioUrl} download={`tts-${Date.now()}.${result?.format || 'mp3'}`}>
                    下载 {result?.format.toUpperCase()}
                  </a>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAudioUrl(null)
                    setResult(null)
                    form.reset()
                  }}
                >
                  重新生成
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p>输入文本并点击"生成语音"</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

