import { createBrowserRouter, RouterProvider as AppRouter } from 'react-router-dom';

import { LoginPage, ResetPasswordPage } from '@/pages';

import { BaseLayout } from '../layouts';

const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/reset-password',
        element: <ResetPasswordPage />,
      },
    ],
  },
]);

export const RouterProvider = () => (
  <AppRouter router={router} />
);
