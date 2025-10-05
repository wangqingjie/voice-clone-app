// 音频历史记录
export interface AudioHistory {
  id: string
  text: string
  voiceId?: string
  audioUrl: string
  audioKey: string
  model: string
  format: string
  fileSize: number
  duration: number
  createdAt: string
  updatedAt: string
}

// 声音模型
export interface VoiceModel {
  id: string
  name: string
  description?: string
  referenceId: string
  referenceAudioUrl?: string
  referenceAudioKey?: string
  isDefault: boolean
  usageCount: number
  createdAt: string
  updatedAt: string
}





