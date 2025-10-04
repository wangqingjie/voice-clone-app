import type { TTSRequest } from '../types/api'

/**
 * Azure Text-to-Speech 服务
 * 官方文档：https://learn.microsoft.com/zh-cn/azure/ai-services/speech-service/rest-text-to-speech
 */
export class AzureTTSService {
  private apiKey: string
  private region: string
  
  constructor(apiKey: string, region: string = 'eastus') {
    this.apiKey = apiKey
    this.region = region
  }

  /**
   * 文本转语音
   */
  async textToSpeech(params: TTSRequest): Promise<ArrayBuffer> {
    const { text, voiceId, format = 'mp3' } = params
    
    // 选择中文声音（默认晓晓）
    const voice = voiceId || 'zh-CN-XiaoxiaoNeural'
    
    // 构建 SSML
    const ssml = this.buildSSML(text, voice)
    
    // 音频格式映射
    const audioFormat = format === 'mp3' 
      ? 'audio-24khz-48kbitrate-mono-mp3'
      : 'riff-24khz-16bit-mono-pcm'

    // 获取访问令牌
    const token = await this.getAccessToken()
    
    // 调用TTS API
    const response = await fetch(
      `https://${this.region}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': audioFormat,
          'User-Agent': 'VoiceCloneApp',
        },
        body: ssml,
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Azure TTS Error: ${response.status} - ${error}`)
    }

    return await response.arrayBuffer()
  }

  /**
   * 获取访问令牌
   */
  private async getAccessToken(): Promise<string> {
    const response = await fetch(
      `https://${this.region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.apiKey,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to get Azure access token')
    }

    return await response.text()
  }

  /**
   * 构建 SSML 格式
   */
  private buildSSML(text: string, voice: string): string {
    // 从voice名称中提取语言代码
    const lang = voice.startsWith('zh-') ? 'zh-CN' : 'en-US'
    
    return `
<speak version='1.0' xml:lang='${lang}'>
  <voice xml:lang='${lang}' name='${voice}'>
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
   * 获取可用的中文声音列表
   */
  static getChineseVoices() {
    return [
      // 普通话（中国大陆）
      { id: 'zh-CN-XiaoxiaoNeural', name: '晓晓（女声）', language: 'zh-CN', style: '通用' },
      { id: 'zh-CN-YunxiNeural', name: '云希（男声）', language: 'zh-CN', style: '通用' },
      { id: 'zh-CN-YunyangNeural', name: '云扬（男声）', language: 'zh-CN', style: '通用' },
      { id: 'zh-CN-XiaoyiNeural', name: '晓伊（女声）', language: 'zh-CN', style: '通用' },
      { id: 'zh-CN-YunjianNeural', name: '云健（男声）', language: 'zh-CN', style: '通用' },
      { id: 'zh-CN-XiaochenNeural', name: '晓辰（女声）', language: 'zh-CN', style: '通用' },
      { id: 'zh-CN-XiaohanNeural', name: '晓涵（女声）', language: 'zh-CN', style: '通用' },
      { id: 'zh-CN-XiaomengNeural', name: '晓梦（女声）', language: 'zh-CN', style: '儿童' },
      { id: 'zh-CN-XiaomoNeural', name: '晓墨（女声）', language: 'zh-CN', style: '通用' },
      { id: 'zh-CN-XiaoqiuNeural', name: '晓秋（女声）', language: 'zh-CN', style: '通用' },
      { id: 'zh-CN-XiaoruiNeural', name: '晓睿（女声）', language: 'zh-CN', style: '通用' },
      { id: 'zh-CN-XiaoshuangNeural', name: '晓双（女声）', language: 'zh-CN', style: '儿童' },
      { id: 'zh-CN-XiaoxuanNeural', name: '晓萱（女声）', language: 'zh-CN', style: '通用' },
      { id: 'zh-CN-XiaoyanNeural', name: '晓颜（女声）', language: 'zh-CN', style: '通用' },
      { id: 'zh-CN-XiaoyouNeural', name: '晓悠（女声）', language: 'zh-CN', style: '儿童' },
      { id: 'zh-CN-YunfengNeural', name: '云枫（男声）', language: 'zh-CN', style: '通用' },
      { id: 'zh-CN-YunhaoNeural', name: '云皓（男声）', language: 'zh-CN', style: '通用' },
      { id: 'zh-CN-YunxiaNeural', name: '云夏（男声）', language: 'zh-CN', style: '通用' },
      { id: 'zh-CN-YunyeNeural', name: '云野（男声）', language: 'zh-CN', style: '通用' },
      { id: 'zh-CN-YunzeNeural', name: '云泽（男声）', language: 'zh-CN', style: '通用' },
      
      // 粤语
      { id: 'zh-HK-HiuMaanNeural', name: '曉曼（女声）', language: 'zh-HK', style: '粤语' },
      { id: 'zh-HK-WanLungNeural', name: '雲龍（男声）', language: 'zh-HK', style: '粤语' },
      
      // 台湾国语
      { id: 'zh-TW-HsiaoChenNeural', name: '曉臻（女声）', language: 'zh-TW', style: '台湾国语' },
      { id: 'zh-TW-YunJheNeural', name: '雲哲（男声）', language: 'zh-TW', style: '台湾国语' },
    ]
  }
}




