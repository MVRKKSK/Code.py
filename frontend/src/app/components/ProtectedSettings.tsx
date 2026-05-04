import { ProtectedRoute } from './ProtectedRoute';
import { SettingsPage } from './SettingsPage';

export function ProtectedSettings() {
  return (
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  );
}
