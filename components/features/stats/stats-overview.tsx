"use client"

import useSWR from 'swr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { apiClient } from '@/lib/api/client'
import { Loader2, FileAudio, Type, Clock, HardDrive } from 'lucide-react'

export function StatsOverview() {
  const { data, error, isLoading } = useSWR('/api/stats', () =>
    apiClient.get<any>('/api/stats')
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-destructive">加载失败，请刷新页面重试</p>
        </CardContent>
      </Card>
    )
  }

  const { overview, voiceUsage, recentActivity } = data

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  return (
    <div className="space-y-6">
      {/* 总体统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总生成次数</CardTitle>
            <FileAudio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalGenerations || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              累计生成的音频数量
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总字符数</CardTitle>
            <Type className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(overview.totalCharacters || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              累计转换的文本字符
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总时长</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((overview.totalDuration || 0) / 60).toFixed(1)} 分钟
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              累计音频时长
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">存储空间</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatFileSize(overview.totalFileSize || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              累计文件大小
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 声音使用分布 */}
      {voiceUsage && voiceUsage.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>声音使用分布</CardTitle>
            <CardDescription>各个声音模型的使用次数</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {voiceUsage.map((voice: any) => (
                <div key={voice.voiceId} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{voice.voiceName}</span>
                    <span className="text-muted-foreground">
                      {voice.count} 次 ({voice.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${voice.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 最近活动 */}
      <Card>
        <CardHeader>
          <CardTitle>最近活动</CardTitle>
          <CardDescription>最近生成的语音记录</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity && recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity: any) => (
                <div
                  key={activity.id}
                  className="flex justify-between items-start py-3 border-b last:border-0"
                >
                  <p className="text-sm line-clamp-2 flex-1 pr-4">
                    {activity.text}
                  </p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(activity.created_at).toLocaleString('zh-CN', {
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">暂无活动记录</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}




