import { apiClient } from './client'
import type { TTSRequest, TTSResponse, AudioHistory } from '../types/audio'

export const ttsApi = {
  /**
   * 文本转语音
   */
  async generate(params: TTSRequest): Promise<TTSResponse> {
    return apiClient.post<TTSResponse>('/api/tts', params)
  },

  /**
   * 获取历史记录
   */
  async getHistory(params?: {
    page?: number
    limit?: number
    search?: string
  }) {
    const query = new URLSearchParams(params as any).toString()
    return apiClient.get<{
      history: AudioHistory[]
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNext: boolean
        hasPrev: boolean
      }
    }>(`/api/history?${query}`)
  },

  /**
   * 获取单条历史记录
   */
  async getHistoryById(id: string) {
    return apiClient.get<AudioHistory>(`/api/history/${id}`)
  },

  /**
   * 删除历史记录
   */
  async deleteHistory(id: string): Promise<void> {
    return apiClient.delete(`/api/history/${id}`)
  },

  /**
   * 批量删除历史记录
   */
  async batchDeleteHistory(ids: string[]): Promise<{ deleted: number; failed: number }> {
    return apiClient.post('/api/history/batch-delete', { ids })
  },
}

