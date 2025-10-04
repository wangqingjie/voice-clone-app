import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Bindings } from './types/bindings'
import tts from './routes/tts'
import history from './routes/history'
import voices from './routes/voices'
import stats from './routes/stats'

const app = new Hono<{ Bindings: Bindings }>()

// CORS 配置
app.use('/*', cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

// 根路径 - 欢迎页面
app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'Welcome to Voice Clone API',
    version: '1.0.0',
    documentation: {
      health: 'GET /health - 健康检查',
      api: 'GET /api - API 端点列表',
      tts: 'POST /api/tts - 文本转语音',
      voices: 'GET /api/voices - 获取声音列表',
      history: 'GET /api/history - 获取历史记录',
    },
  })
})

// Health check
app.get('/health', (c) => {
  return c.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: c.env.ENVIRONMENT,
      storageMode: c.env.STORAGE_MODE,
    },
  })
})

// API 路由
app.get('/api', (c) => {
  return c.json({
    success: true,
    message: 'Voice Clone API v1',
    endpoints: {
      health: '/health',
      tts: '/api/tts',
      voices: '/api/voices',
      history: '/api/history',
    },
  })
})

// TTS 路由
app.route('/api/tts', tts)

// 历史记录路由
app.route('/api/history', history)

// 声音克隆路由
app.route('/api/voices', voices)

// 统计路由
app.route('/api/stats', stats)

// 404 处理
app.notFound((c) => {
  return c.json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: '接口不存在',
    },
  }, 404)
})

// 全局错误处理
app.onError((err, c) => {
  console.error('[Global Error]:', err)
  return c.json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: '服务器内部错误',
    },
  }, 500)
})

export default app

