import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mic } from 'lucide-react'
import { AdCarousel } from '@/components/features/home/ad-carousel'

export default function Home() {
  return (
    <div className="space-y-10">
      {/* 欢迎横幅 */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">🎵 Voice Clone App</h1>
        <p className="text-xl text-muted-foreground">
          基于 Azure AI 的专业文本转语音平台
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          提供15个高质量中文声音，支持多种语音风格
        </p>
      </div>

      {/* 快速开始卡片 */}
      <div className="grid gap-6 md:grid-cols-1 max-w-2xl mx-auto">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <Link href="/tts">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mic className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">文本转语音</CardTitle>
                  <CardDescription className="text-base">快速生成自然流畅的专业语音</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                输入文本，从15个Azure专业声音中选择，立即生成高质量语音。支持男声、女声多种风格。
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* 广告轮播 */}
      <div className="mt-16">
        <AdCarousel />
      </div>
    </div>
  )
}
