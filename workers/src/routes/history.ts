import { Hono } from 'hono'
import type { Bindings } from '../types/bindings'
import { DatabaseService } from '../services/database.service'
import { StorageService } from '../services/storage.service'

const history = new Hono<{ Bindings: Bindings }>()

// 获取历史记录列表
history.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    const search = c.req.query('search') || ''
    
    const database = new DatabaseService(c.env.DB)
    const { items, total } = await database.getAudioHistory(page, limit)
    
    const totalPages = Math.ceil(total / limit)
    
    return c.json({
      success: true,
      data: {
        history: items,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    })
  } catch (error) {
    console.error('[History] Error:', error)
    return c.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '获取历史记录失败',
      },
    }, 500)
  }
})

// 获取单条历史记录
history.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const database = new DatabaseService(c.env.DB)
    const item = await database.getAudioHistoryById(id)
    
    if (!item) {
      return c.json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '历史记录不存在',
        },
      }, 404)
    }
    
    return c.json({
      success: true,
      data: item,
    })
  } catch (error) {
    console.error('[History] Error:', error)
    return c.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '获取历史记录失败',
      },
    }, 500)
  }
})

// 删除历史记录
history.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const database = new DatabaseService(c.env.DB)
    
    // 获取记录信息
    const item = await database.getAudioHistoryById(id)
    if (!item) {
      return c.json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '历史记录不存在',
        },
      }, 404)
    }
    
    // 删除数据库记录
    await database.deleteAudioHistory(id)
    
    return c.json({
      success: true,
      message: '删除成功',
    })
  } catch (error) {
    console.error('[History] Delete error:', error)
    return c.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '删除失败',
      },
    }, 500)
  }
})

// 批量删除
history.post('/batch-delete', async (c) => {
  try {
    const { ids } = await c.req.json<{ ids: string[] }>()
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'ids 参数无效',
        },
      }, 400)
    }
    
    const database = new DatabaseService(c.env.DB)
    
    let deleted = 0
    let failed = 0
    
    for (const id of ids) {
      try {
        const item = await database.getAudioHistoryById(id)
        if (item) {
          await database.deleteAudioHistory(id)
          deleted++
        }
      } catch (error) {
        console.error(`[History] Failed to delete ${id}:`, error)
        failed++
      }
    }
    
    return c.json({
      success: true,
      data: { deleted, failed },
    })
  } catch (error) {
    console.error('[History] Batch delete error:', error)
    return c.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '批量删除失败',
      },
    }, 500)
  }
})

export default history





