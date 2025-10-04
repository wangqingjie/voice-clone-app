/**
 * 存储服务 - Direct 模式
 * 不使用 R2，直接返回音频的 base64 数据
 */
export class StorageService {
  /**
   * 将音频转换为 base64 字符串
   */
  async encodeAudio(audioData: ArrayBuffer, format: string = 'mp3'): Promise<string> {
    try {
      // 将 ArrayBuffer 转换为 Uint8Array
      const uint8Array = new Uint8Array(audioData)
      
      // 分块处理大文件，避免内存问题
      const chunkSize = 8192
      let binaryString = ''
      
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.slice(i, Math.min(i + chunkSize, uint8Array.length))
        binaryString += String.fromCharCode.apply(null, Array.from(chunk))
      }
      
      // 转换为 base64
      const base64 = btoa(binaryString)
      
      // 返回 Data URL 格式
      const mimeType = format === 'mp3' ? 'audio/mpeg' : 'audio/wav'
      return `data:${mimeType};base64,${base64}`
    } catch (error) {
      console.error('[Storage] Error encoding audio:', error)
      throw new Error('Failed to encode audio data')
    }
  }

  /**
   * 生成唯一的音频 key（用于数据库记录）
   */
  generateAudioKey(format: string = 'mp3'): string {
    const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const uuid = crypto.randomUUID()
    return `audio/${timestamp}/${uuid}.${format}`
  }
}

