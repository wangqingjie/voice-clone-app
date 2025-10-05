import { Hono } from 'hono'
import type { Bindings } from '../types/bindings'
import { DatabaseService } from '../services/database.service'

const stats = new Hono<{ Bindings: Bindings }>()

// 获取统计数据
stats.get('/', async (c) => {
  try {
    const database = new DatabaseService(c.env.DB)
    
    // 获取基础统计
    const overview = await database.getStats()
    
    // 获取声音使用分布
    const voiceUsageResult = await c.env.DB
      .prepare(
        `SELECT 
          voice_id as voiceId,
          COUNT(*) as count
        FROM audio_history
        WHERE voice_id IS NOT NULL
        GROUP BY voice_id
        ORDER BY count DESC
        LIMIT 10`
      )
      .all()
    
    const totalWithVoice = voiceUsageResult.results?.reduce((sum: number, item: any) => sum + item.count, 0) || 1
    
    const voiceUsage = await Promise.all(
      (voiceUsageResult.results || []).map(async (item: any) => {
        // 获取声音名称
        const voiceModel = await database.getVoiceModelById(item.voiceId)
        return {
          voiceId: item.voiceId,
          voiceName: voiceModel?.name || '未知声音',
          count: item.count,
          percentage: Math.round((item.count / totalWithVoice) * 100),
        }
      })
    )
    
    // 获取最近活动
    const recentActivity = await c.env.DB
      .prepare(
        `SELECT id, text, created_at
        FROM audio_history
        ORDER BY created_at DESC
        LIMIT 10`
      )
      .all()
    
    return c.json({
      success: true,
      data: {
        overview: {
          totalGenerations: overview.totalGenerations || 0,
          totalCharacters: overview.totalCharacters || 0,
          totalDuration: overview.totalDuration || 0,
          totalFileSize: overview.totalFileSize || 0,
        },
        voiceUsage,
        recentActivity: recentActivity.results || [],
      },
    })
  } catch (error) {
    console.error('[Stats] Error:', error)
    return c.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '获取统计数据失败',
      },
    }, 500)
  }
})

export default stats





