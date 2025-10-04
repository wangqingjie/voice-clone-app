import type { AudioHistory, VoiceModel } from '../types/models'

export class DatabaseService {
  private db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  /**
   * 保存音频历史记录
   */
  async saveAudioHistory(data: Omit<AudioHistory, 'createdAt' | 'updatedAt'>): Promise<void> {
    const { id, text, voiceId, audioUrl, audioKey, model, format, fileSize, duration } = data

    await this.db
      .prepare(
        `INSERT INTO audio_history 
        (id, text, voice_id, audio_url, audio_key, model, format, file_size, duration)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(id, text, voiceId || null, audioUrl, audioKey, model, format, fileSize, duration)
      .run()
  }

  /**
   * 获取历史记录列表
   */
  async getAudioHistory(
    page: number = 1,
    limit: number = 20
  ): Promise<{ items: AudioHistory[]; total: number }> {
    const offset = (page - 1) * limit

    // 获取总数
    const countResult = await this.db
      .prepare('SELECT COUNT(*) as count FROM audio_history')
      .first<{ count: number }>()

    const total = countResult?.count || 0

    // 获取数据
    const { results } = await this.db
      .prepare(
        `SELECT * FROM audio_history 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`
      )
      .bind(limit, offset)
      .all<AudioHistory>()

    return {
      items: results || [],
      total,
    }
  }

  /**
   * 根据 ID 获取历史记录
   */
  async getAudioHistoryById(id: string): Promise<AudioHistory | null> {
    const result = await this.db
      .prepare('SELECT * FROM audio_history WHERE id = ?')
      .bind(id)
      .first<AudioHistory>()

    return result || null
  }

  /**
   * 删除历史记录
   */
  async deleteAudioHistory(id: string): Promise<void> {
    await this.db
      .prepare('DELETE FROM audio_history WHERE id = ?')
      .bind(id)
      .run()
  }

  /**
   * 获取统计数据
   */
  async getStats() {
    const result = await this.db
      .prepare(
        `SELECT 
          COUNT(*) as totalGenerations,
          SUM(LENGTH(text)) as totalCharacters,
          SUM(duration) as totalDuration,
          SUM(file_size) as totalFileSize
        FROM audio_history`
      )
      .first()

    return result || {
      totalGenerations: 0,
      totalCharacters: 0,
      totalDuration: 0,
      totalFileSize: 0,
    }
  }

  // ==================== 声音模型相关方法 ====================

  /**
   * 保存声音模型
   */
  async saveVoiceModel(data: Omit<VoiceModel, 'createdAt' | 'updatedAt'>): Promise<void> {
    const {
      id,
      name,
      description,
      referenceId,
      referenceAudioUrl,
      referenceAudioKey,
      isDefault,
      usageCount,
    } = data

    await this.db
      .prepare(
        `INSERT INTO voice_models 
        (id, name, description, reference_id, reference_audio_url, reference_audio_key, is_default, usage_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        name,
        description || null,
        referenceId,
        referenceAudioUrl || null,
        referenceAudioKey || null,
        isDefault ? 1 : 0,
        usageCount || 0
      )
      .run()
  }

  /**
   * 获取声音模型列表
   */
  async getVoiceModels(): Promise<VoiceModel[]> {
    const { results } = await this.db
      .prepare('SELECT * FROM voice_models ORDER BY is_default DESC, created_at DESC')
      .all<VoiceModel>()

    return results || []
  }

  /**
   * 根据 ID 获取声音模型
   */
  async getVoiceModelById(id: string): Promise<VoiceModel | null> {
    const result = await this.db
      .prepare('SELECT * FROM voice_models WHERE id = ?')
      .bind(id)
      .first<VoiceModel>()

    return result || null
  }

  /**
   * 更新声音模型
   */
  async updateVoiceModel(id: string, data: Partial<VoiceModel>): Promise<void> {
    const updates: string[] = []
    const values: any[] = []

    if (data.name !== undefined) {
      updates.push('name = ?')
      values.push(data.name)
    }
    if (data.description !== undefined) {
      updates.push('description = ?')
      values.push(data.description)
    }
    if (data.isDefault !== undefined) {
      updates.push('is_default = ?')
      values.push(data.isDefault ? 1 : 0)
    }

    if (updates.length === 0) return

    updates.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)

    await this.db
      .prepare(`UPDATE voice_models SET ${updates.join(', ')} WHERE id = ?`)
      .bind(...values)
      .run()
  }

  /**
   * 删除声音模型
   */
  async deleteVoiceModel(id: string): Promise<void> {
    await this.db
      .prepare('DELETE FROM voice_models WHERE id = ?')
      .bind(id)
      .run()
  }

  /**
   * 增加声音使用次数
   */
  async incrementVoiceUsage(id: string): Promise<void> {
    await this.db
      .prepare('UPDATE voice_models SET usage_count = usage_count + 1 WHERE id = ?')
      .bind(id)
      .run()
  }
}

