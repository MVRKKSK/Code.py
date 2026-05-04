import { ProtectedRoute } from './ProtectedRoute';
import { TestPage } from './TestPage';

export function ProtectedTest() {
  return (
    <ProtectedRoute>
      <TestPage />
    </ProtectedRoute>
  );
}
