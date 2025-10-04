"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useTheme } from 'next-themes'

export function SettingsForm() {
  const { theme, setTheme } = useTheme()

  const handleSave = () => {
    toast.success('设置已保存', {
      description: '你的偏好设置已成功保存',
    })
  }

  return (
    <div className="space-y-6">
      {/* 外观设置 */}
      <Card>
        <CardHeader>
          <CardTitle>外观</CardTitle>
          <CardDescription>自定义应用的外观和感觉</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>主题</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue placeholder="选择主题" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">浅色</SelectItem>
                <SelectItem value="dark">深色</SelectItem>
                <SelectItem value="system">跟随系统</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              选择你喜欢的界面主题
            </p>
          </div>
        </CardContent>
      </Card>

      {/* TTS 默认设置 */}
      <Card>
        <CardHeader>
          <CardTitle>TTS 默认设置</CardTitle>
          <CardDescription>设置文本转语音的默认参数</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>默认模型</Label>
            <Select defaultValue="speech-1.5">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="speech-1.5">speech-1.5（推荐）</SelectItem>
                <SelectItem value="speech-1.6">speech-1.6（最新）</SelectItem>
                <SelectItem value="s1">s1（快速）</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>默认格式</Label>
            <Select defaultValue="mp3">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mp3">MP3</SelectItem>
                <SelectItem value="wav">WAV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 数据管理 */}
      <Card>
        <CardHeader>
          <CardTitle>数据管理</CardTitle>
          <CardDescription>管理你的应用数据和存储</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">清除历史记录</p>
              <p className="text-sm text-muted-foreground">
                删除所有TTS历史记录
              </p>
            </div>
            <Button variant="outline" onClick={() => {
              toast.info('功能开发中', {
                description: '此功能即将推出',
              })
            }}>
              清除
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">导出数据</p>
              <p className="text-sm text-muted-foreground">
                导出你的所有数据
              </p>
            </div>
            <Button variant="outline" onClick={() => {
              toast.info('功能开发中', {
                description: '此功能即将推出',
              })
            }}>
              导出
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 关于 */}
      <Card>
        <CardHeader>
          <CardTitle>关于</CardTitle>
          <CardDescription>应用信息和版本</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">应用名称</span>
            <span className="font-medium">Voice Clone App</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">版本</span>
            <span className="font-medium">v1.0.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">技术栈</span>
            <span className="font-medium">Next.js + Cloudflare</span>
          </div>
        </CardContent>
      </Card>

      {/* 保存按钮 */}
      <Button onClick={handleSave} className="w-full">
        保存设置
      </Button>
    </div>
  )
}




