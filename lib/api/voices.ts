import { apiClient } from './client'

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

export const voicesApi = {
  /**
   * 获取声音列表
   * 当前版本：返回空数组，声音库仅用于展示信息
   * 未来版本：可能支持自定义声音模型
   */
  async getVoices(): Promise<VoiceModel[]> {
    const result = await apiClient.get<{ voices: VoiceModel[] }>('/api/voices')
    return result.voices
  },
}

