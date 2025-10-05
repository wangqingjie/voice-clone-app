export interface TTSRequest {
  text: string
  voiceId?: string
  model?: 'speech-1.5' | 'speech-1.6' | 's1'
  format?: 'mp3' | 'wav'
}

export interface TTSResponse {
  id: string
  audioData?: string  // Base64 audio data
  audioUrl?: string
  audioKey?: string
  text: string
  voiceId?: string
  model: string
  format: string
  fileSize: number
  duration: number
  createdAt: string
}

export interface AudioHistory {
  id: string
  text: string
  voiceId?: string
  voiceName?: string
  audioUrl: string
  audioKey: string
  model: string
  format: string
  fileSize: number
  duration: number
  createdAt: string
  updatedAt: string
}





