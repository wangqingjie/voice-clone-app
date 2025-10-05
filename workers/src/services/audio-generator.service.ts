/**
 * 音频生成服务 - 用于生成测试音频
 */
export class AudioGeneratorService {
  /**
   * 生成一个简单的正弦波音频（WAV格式）
   * @param text 文本内容（用于估算时长）
   * @param frequency 频率（Hz），默认440Hz（A4音符）
   * @returns ArrayBuffer 包含WAV音频数据
   */
  generateTestAudio(text: string, frequency: number = 440): ArrayBuffer {
    const sampleRate = 44100
    const duration = Math.max(1, Math.ceil(text.length / 10)) // 至少1秒，每10个字符约1秒
    const numSamples = sampleRate * duration
    
    // 创建WAV文件
    const buffer = new ArrayBuffer(44 + numSamples * 2) // WAV头(44字节) + 音频数据(16位PCM)
    const view = new DataView(buffer)
    
    // WAV文件头
    this.writeWAVHeader(view, numSamples, sampleRate)
    
    // 生成正弦波数据
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate
      const sample = Math.sin(2 * Math.PI * frequency * t) * 0.3 // 30%音量
      const int16Sample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)))
      view.setInt16(44 + i * 2, int16Sample, true)
    }
    
    return buffer
  }
  
  /**
   * 写入WAV文件头
   */
  private writeWAVHeader(view: DataView, numSamples: number, sampleRate: number) {
    const numChannels = 1
    const bitsPerSample = 16
    const byteRate = sampleRate * numChannels * bitsPerSample / 8
    const blockAlign = numChannels * bitsPerSample / 8
    const dataSize = numSamples * blockAlign
    
    // RIFF chunk descriptor
    this.writeString(view, 0, 'RIFF')
    view.setUint32(4, 36 + dataSize, true)
    this.writeString(view, 8, 'WAVE')
    
    // fmt sub-chunk
    this.writeString(view, 12, 'fmt ')
    view.setUint32(16, 16, true) // fmt chunk size
    view.setUint16(20, 1, true) // audio format (1 = PCM)
    view.setUint16(22, numChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, byteRate, true)
    view.setUint16(32, blockAlign, true)
    view.setUint16(34, bitsPerSample, true)
    
    // data sub-chunk
    this.writeString(view, 36, 'data')
    view.setUint32(40, dataSize, true)
  }
  
  /**
   * 写入字符串到DataView
   */
  private writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }
  
  /**
   * 生成语音合成提示消息音频（快速的"嘟嘟"声）
   */
  generateBeepAudio(): ArrayBuffer {
    const sampleRate = 44100
    const duration = 0.5 // 0.5秒
    const numSamples = Math.floor(sampleRate * duration)
    
    const buffer = new ArrayBuffer(44 + numSamples * 2)
    const view = new DataView(buffer)
    
    this.writeWAVHeader(view, numSamples, sampleRate)
    
    // 生成两个短促的蜂鸣音
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate
      let sample = 0
      
      // 第一个蜂鸣（0-0.15秒）
      if (t < 0.15) {
        sample = Math.sin(2 * Math.PI * 800 * t) * (1 - t / 0.15) * 0.3
      }
      // 第二个蜂鸣（0.25-0.4秒）
      else if (t >= 0.25 && t < 0.4) {
        const t2 = t - 0.25
        sample = Math.sin(2 * Math.PI * 800 * t2) * (1 - t2 / 0.15) * 0.3
      }
      
      const int16Sample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)))
      view.setInt16(44 + i * 2, int16Sample, true)
    }
    
    return buffer
  }
}





