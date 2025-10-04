"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, MessageCircle, Code, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface AdItem {
  id: string
  title: string
  items: string[]
  contact?: {
    label: string
    value: string
  }
  gradient: string
  icon: React.ReactNode
}

const adItems: AdItem[] = [
  {
    id: '1',
    title: '本站承接以下服务',
    items: [
      '承接C/C++、小程序等项目开发',
      '本站长期广告位招租',
    ],
    contact: {
      label: '联系站长(V)',
      value: 'A13567894515',
    },
    gradient: 'from-blue-500/10 via-purple-500/10 to-pink-500/10',
    icon: <Code className="h-6 w-6" />,
  },
  // 未来可以添加更多广告
]

export function AdCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // 自动轮播
  useEffect(() => {
    if (!isAutoPlaying || adItems.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % adItems.length)
    }, 5000) // 每5秒切换

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + adItems.length) % adItems.length)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % adItems.length)
    setIsAutoPlaying(false)
  }

  const currentAd = adItems[currentIndex]

  const handleContactClick = () => {
    if (currentAd.contact) {
      // 复制到剪贴板
      navigator.clipboard.writeText(currentAd.contact.value)
      toast.success('已复制到剪贴板！', {
        description: `微信号: ${currentAd.contact.value}`,
        duration: 3000,
      })
    }
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <Card className={cn(
        "relative overflow-hidden border-2 transition-all duration-500",
        "bg-gradient-to-br",
        currentAd.gradient,
        "hover:shadow-lg"
      )}>
        {/* 装饰性背景图案 */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-500 to-yellow-500 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative px-6 py-8 md:px-10 md:py-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* 左侧图标 */}
            <div className="flex-shrink-0">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg transform hover:scale-105 transition-transform">
                {currentAd.icon}
              </div>
            </div>

            {/* 中间内容 */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {currentAd.title}
                </h3>
                <div className="space-y-2">
                  {currentAd.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 justify-center md:justify-start">
                      <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mt-2 flex-shrink-0" />
                      <p className="text-sm md:text-base text-foreground/80 font-medium">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 联系方式 */}
              {currentAd.contact && (
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-foreground/70">
                      {currentAd.contact.label}:
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleContactClick}
                    className="font-mono font-bold text-blue-600 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-500 transition-all"
                  >
                    {currentAd.contact.value}
                  </Button>
                </div>
              )}
            </div>

            {/* 右侧装饰图标 */}
            <div className="hidden lg:flex flex-shrink-0">
              <div className="relative">
                <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center backdrop-blur-sm border border-purple-300/30">
                  <TrendingUp className="h-10 w-10 text-purple-600 animate-pulse" />
                </div>
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  🔥
                </div>
              </div>
            </div>
          </div>

          {/* 轮播指示器（当有多个广告时显示） */}
          {adItems.length > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              {adItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index)
                    setIsAutoPlaying(false)
                  }}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === currentIndex
                      ? "w-8 bg-gradient-to-r from-blue-500 to-purple-500"
                      : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 左右切换按钮（当有多个广告时显示） */}
        {adItems.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-all hover:scale-110"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-all hover:scale-110"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </Card>

      {/* 底部提示文字 */}
      <div className="text-center mt-3">
        <p className="text-xs text-muted-foreground">
          💡 支持专业的技术开发服务和广告合作
        </p>
      </div>
    </div>
  )
}

