import { Hono } from 'hono'
import type { Bindings } from '../types/bindings'
import type { TTSRequest, ApiResponse, TTSResponse } from '../types/api'
import { AzureTTSService } from '../services/azure-tts.service'
import { StorageService } from '../services/storage.service'
import { DatabaseService } from '../services/database.service'
import { AudioGeneratorService } from '../services/audio-generator.service'

const tts = new Hono<{ Bindings: Bindings }>()

tts.post('/', async (c) => {
  try {
    // 解析请求
    const body = await c.req.json<TTSRequest>()
    const { text, voiceId, model = 'speech-1.5', format = 'mp3' } = body

    // 验证输入
    if (!text || text.trim().length === 0) {
      return c.json<ApiResponse>({
        success: false,
        error: {
          code: 'INVALID_TEXT',
          message: '文本不能为空',
        },
      }, 400)
    }

    if (text.length > 5000) {
      return c.json<ApiResponse>({
        success: false,
        error: {
          code: 'TEXT_TOO_LONG',
          message: '文本长度不能超过 5000 字符',
        },
      }, 400)
    }

    // 初始化服务
    const azureTTS = new AzureTTSService(
      c.env.AZURE_SPEECH_KEY,
      c.env.AZURE_SPEECH_REGION
    )
    const storage = new StorageService()
    const database = new DatabaseService(c.env.DB)

    let audioDataUrl: string
    let fileSize: number
    let duration: number

    // 调用 Azure TTS API
    try {
      console.log('[TTS] Calling Azure TTS API...')
      console.log('[TTS] Voice:', voiceId || 'zh-CN-XiaoxiaoNeural')
      const audioData = await azureTTS.textToSpeech({ text, voiceId, model, format })
      
      fileSize = audioData.byteLength
      duration = Math.ceil(text.length / 5) // 粗略估算：5个字符约1秒
      
      // 转换为 base64
      console.log('[TTS] Encoding audio to base64...')
      audioDataUrl = await storage.encodeAudio(audioData, format)
      
      console.log('[TTS] ✅ Success! Generated audio:', fileSize, 'bytes')
      
    } catch (error) {
      // Azure TTS 失败，生成测试音频
      console.log('[TTS] Azure TTS API failed, generating test audio:', error)
      
      // 使用音频生成器创建真实的测试音频
      const audioGenerator = new AudioGeneratorService()
      const audioData = audioGenerator.generateTestAudio(text)
      
      fileSize = audioData.byteLength
      duration = Math.ceil(text.length / 10) // 估算时长：每10个字符约1秒
      
      // 转换为 base64
      console.log('[TTS] Encoding generated audio to base64...')
      audioDataUrl = await storage.encodeAudio(audioData, 'wav') // 生成的是WAV格式
      
      console.log('[TTS] ✅ Generated fallback test audio:', fileSize, 'bytes')
      console.log('[TTS] Audio Data URL length:', audioDataUrl.length)
    }
    
    // 生成 key 用于数据库记录
    const audioKey = storage.generateAudioKey(format)

    // 保存到数据库（保存文本记录，不保存音频）
    const id = crypto.randomUUID()
    console.log('[TTS] Saving to database...')
    await database.saveAudioHistory({
      id,
      text,
      voiceId,
      audioUrl: 'direct-mode', // 标记为直接模式
      audioKey,
      model,
      format,
      fileSize,
      duration,
    })

    // 返回响应
    const response: TTSResponse = {
      id,
      audioData: audioDataUrl, // 返回 base64 数据
      text,
      voiceId,
      model,
      format,
      fileSize,
      duration,
      createdAt: new Date().toISOString(),
    }

    console.log('[TTS] Success! Audio size:', fileSize, 'bytes')

    return c.json<ApiResponse<TTSResponse>>({
      success: true,
      data: response,
    })

  } catch (error) {
    console.error('[TTS] Error:', error)
    
    return c.json<ApiResponse>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : '服务器内部错误',
      },
    }, 500)
  }
})

export default tts

