import type { TTSRequest } from '../types/api'

/**
 * Edge TTS Service - 免费的微软 TTS
 * 基于 Azure Cognitive Services Speech API
 */
export class EdgeTTSService {
  // 使用公开的 Azure Speech Service 端点
  private baseURL = 'https://eastus.tts.speech.microsoft.com/cognitiveservices/v1'
  
  // Edge TTS 不需要 API Key，使用免费端点
  constructor() {}

  /**
   * 文本转语音
   */
  async textToSpeech(params: TTSRequest): Promise<ArrayBuffer> {
    const { text, format = 'mp3' } = params
    
    // 选择声音（中文女声）
    const voice = 'zh-CN-XiaoxiaoNeural'
    
    // 构建 SSML（Speech Synthesis Markup Language）
    const ssml = this.buildSSML(text, voice)
    
    // 音频格式映射
    const audioFormat = format === 'mp3' 
      ? 'audio-24khz-48kbitrate-mono-mp3'
      : 'riff-24khz-16bit-mono-pcm'

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': audioFormat,
          'User-Agent': 'Mozilla/5.0',
        },
        body: ssml,
      })

      if (!response.ok) {
        throw new Error(`Edge TTS API Error: ${response.status}`)
      }

      return await response.arrayBuffer()
    } catch (error) {
      console.error('[EdgeTTS] Error:', error)
      throw error
    }
  }

  /**
   * 构建 SSML 格式
   */
  private buildSSML(text: string, voice: string): string {
    return `
<speak version='1.0' xml:lang='zh-CN'>
  <voice xml:lang='zh-CN' name='${voice}'>
    ${this.escapeXml(text)}
  </voice>
</speak>`.trim()
  }

  /**
   * 转义 XML 特殊字符
   */
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  /**
   * 获取可用的声音列表
   */
  static getVoices() {
    return [
      { id: 'zh-CN-XiaoxiaoNeural', name: '晓晓（女声）', language: 'zh-CN' },
      { id: 'zh-CN-YunxiNeural', name: '云希（男声）', language: 'zh-CN' },
      { id: 'zh-CN-YunyangNeural', name: '云扬（男声）', language: 'zh-CN' },
      { id: 'zh-CN-XiaoyiNeural', name: '晓伊（女声）', language: 'zh-CN' },
      { id: 'en-US-JennyNeural', name: 'Jenny (Female)', language: 'en-US' },
      { id: 'en-US-GuyNeural', name: 'Guy (Male)', language: 'en-US' },
    ]
  }
}





