"use client"

import { useState } from 'react'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AudioPlayer } from '@/components/shared/audio-player'
import { toast } from 'sonner'
import { ttsApi } from '@/lib/api/tts'
import { Loader2, Search, Trash2, Download, Copy } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// 安全的日期格式化函数
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '未知日期'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '未知日期'
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '未知日期'
  }
}

export function HistoryList() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, error, isLoading, mutate } = useSWR(
    `/api/history?page=${page}&search=${search}`,
    () => ttsApi.getHistory({ page, limit: 20, search })
  )

  const handleDelete = async (id: string) => {
    try {
      await ttsApi.deleteHistory(id)
      toast.success('删除成功', {
        description: '历史记录已删除',
      })
      mutate()
      setDeleteId(null)
    } catch (error) {
      toast.error('删除失败', {
        description: '请稍后重试',
      })
    }
  }

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('已复制', {
      description: '文本已复制到剪贴板',
    })
  }

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

  const { history = [], pagination } = data || {}

  return (
    <div className="space-y-6">
      {/* 搜索栏 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索历史记录..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 历史记录列表 */}
      {history.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">暂无历史记录</p>
              <p className="text-sm text-muted-foreground mt-2">
                开始生成你的第一个语音吧！
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item: any) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-base line-clamp-2">
                      {item.text}
                    </CardTitle>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{item.model}</span>
                      <span>{item.format.toUpperCase()}</span>
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 注意：历史记录中audioUrl是'direct-mode'，不能直接播放 */}
                {/* 这里我们需要重新生成音频或者显示提示 */}
                <div className="text-sm text-muted-foreground">
                  <p>💡 提示：历史记录中的音频需要重新生成才能播放</p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleCopyText(item.text)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    复制文本
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 分页 */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={!pagination.hasPrev}
            onClick={() => setPage(page - 1)}
          >
            上一页
          </Button>
          <span className="flex items-center px-4">
            第 {pagination.page} / {pagination.totalPages} 页
          </span>
          <Button
            variant="outline"
            disabled={!pagination.hasNext}
            onClick={() => setPage(page + 1)}
          >
            下一页
          </Button>
        </div>
      )}

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              此操作无法撤销，确定要删除这条历史记录吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

