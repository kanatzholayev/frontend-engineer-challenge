import { createBrowserRouter, RouterProvider as AppRouter } from 'react-router-dom';

import { LoginPage } from '@/pages';

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
    ],
  },
]);

export const RouterProvider = () => (
  <AppRouter router={router} />
);
