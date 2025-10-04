import { Hono } from 'hono'
import type { Bindings } from '../types/bindings'
import { DatabaseService } from '../services/database.service'

const voices = new Hono<{ Bindings: Bindings }>()

// 获取声音列表（保留数据库查询以便未来扩展）
// 当前版本：声音库仅展示说明信息，实际声音由Azure预设提供
voices.get('/', async (c) => {
  try {
    const database = new DatabaseService(c.env.DB)
    const voiceModels = await database.getVoiceModels()

    return c.json({
      success: true,
      data: { voices: voiceModels },
    })
  } catch (error) {
    console.error('[Voices] Error:', error)
    return c.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '获取声音列表失败',
      },
    }, 500)
  }
})

export default voices

