import { createBrowserRouter } from 'react-router';
import { RootLayout } from './components/RootLayout';
import { LandingPage } from './components/LandingPage';
import { PracticeSelection } from './components/PracticeSelection';
import { ExercisePage } from './components/ExercisePage';
import { ProgressPage } from './components/ProgressPage';
import { SettingsPage } from './components/SettingsPage';
import { NotFoundPage } from './components/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: 'practice', Component: PracticeSelection },
      { path: 'exercise/:exerciseId', Component: ExercisePage },
      { path: 'progress', Component: ProgressPage },
      { path: 'settings', Component: SettingsPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);