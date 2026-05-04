import { ProtectedRoute } from './ProtectedRoute';
import { ProgressPage } from './ProgressPage';

export function ProtectedProgress() {
  return (
    <ProtectedRoute>
      <ProgressPage />
    </ProtectedRoute>
  );
}
