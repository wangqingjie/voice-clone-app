"use client"

import useSWR from 'swr'
import { Card, CardContent } from '@/components/ui/card'
import { voicesApi } from '@/lib/api/voices'
import { Loader2 } from 'lucide-react'

export function VoicesList() {
  const { data: voices, error, isLoading } = useSWR(
    '/api/voices',
    () => voicesApi.getVoices()
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-destructive">加载失败，请刷新页面重试</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* 说明卡片 */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                💡 <strong>关于声音库：</strong><br/>
                当前提供15个Azure预设的专业中文声音。<br/>
                自定义声音克隆功能正在开发中，敬请期待！
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              您可以在TTS页面选择使用这些预设声音生成高质量语音。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 声音列表占位 */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">暂无自定义声音模型</p>
            <p className="text-sm text-muted-foreground mt-2">
              自定义声音克隆功能即将推出
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

