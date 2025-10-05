import { SettingsForm } from '@/components/features/settings/settings-form'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">设置</h1>
        <p className="text-muted-foreground mt-2">
          管理你的应用偏好和配置
        </p>
      </div>

      <SettingsForm />
    </div>
  )
}





