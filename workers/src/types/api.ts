// TTS 请求参数
export interface TTSRequest {
  text: string
  voiceId?: string
  model?: 'speech-1.5' | 'speech-1.6' | 's1'
  format?: 'mp3' | 'wav'
}

// TTS 响应
export interface TTSResponse {
  id: string
  audioData?: string // Base64 编码的音频数据（direct 模式）
  audioUrl?: string // 音频 URL（R2 模式）
  audioKey?: string
  text: string
  voiceId?: string
  model: string
  format: string
  fileSize: number
  duration: number
  createdAt: string
}

// 通用 API 响应
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
}

// Fish Audio API 响应
export interface FishAudioTTSResponse {
  audio: ArrayBuffer
}




