import { ProtectedRoute } from './ProtectedRoute';
import { PracticeSelection } from './PracticeSelection';

export function ProtectedPractice() {
  return (
    <ProtectedRoute>
      <PracticeSelection />
    </ProtectedRoute>
  );
}
