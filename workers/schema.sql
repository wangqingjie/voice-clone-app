-- 音频历史记录表
CREATE TABLE IF NOT EXISTS audio_history (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  voice_id TEXT,
  audio_url TEXT NOT NULL,
  audio_key TEXT NOT NULL,
  model TEXT DEFAULT 'speech-1.5',
  format TEXT DEFAULT 'mp3',
  file_size INTEGER,
  duration REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 声音模型表
CREATE TABLE IF NOT EXISTS voice_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  reference_id TEXT NOT NULL,
  reference_audio_url TEXT,
  reference_audio_key TEXT,
  is_default INTEGER DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 用户设置表
CREATE TABLE IF NOT EXISTS user_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_history_created ON audio_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_history_voice ON audio_history(voice_id);
CREATE INDEX IF NOT EXISTS idx_voices_name ON voice_models(name);
CREATE INDEX IF NOT EXISTS idx_voices_default ON voice_models(is_default);




