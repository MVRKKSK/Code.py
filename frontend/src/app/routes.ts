import { createBrowserRouter } from 'react-router';
import { RootLayout } from './components/RootLayout';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ProtectedPractice } from './components/ProtectedPractice';
import { ProtectedTest } from './components/ProtectedTest';
import { ProtectedProgress } from './components/ProtectedProgress';
import { ProtectedSettings } from './components/ProtectedSettings';
import { NotFoundPage } from './components/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: 'login', Component: LoginPage },
      { path: 'register', Component: RegisterPage },
      { path: 'practice', Component: ProtectedPractice },
      { path: 'test/:testId', Component: ProtectedTest },
      { path: 'progress', Component: ProtectedProgress },
      { path: 'settings', Component: ProtectedSettings },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);