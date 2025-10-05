import type { TTSRequest } from '../types/api'

export class FishAudioService {
  private apiKey: string
  private baseURL = 'https://api.fish.audio/v1'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * 文本转语音
   */
  async textToSpeech(params: TTSRequest): Promise<ArrayBuffer> {
    const { text, voiceId, model = 'speech-1.5', format = 'mp3' } = params

    const response = await fetch(`${this.baseURL}/tts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        reference_id: voiceId,
        format,
        model,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Fish Audio API Error: ${response.status} - ${error}`)
    }

    return await response.arrayBuffer()
  }

  /**
   * 声音克隆（占位，后续实现）
   */
  async cloneVoice(audioData: ArrayBuffer, name: string): Promise<string> {
    // TODO: 实现声音克隆
    // 返回 reference_id
    throw new Error('Not implemented yet')
  }
}





