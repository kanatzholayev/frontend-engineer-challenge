import { createBrowserRouter, RouterProvider as AppRouter } from 'react-router-dom';

import { LoginPage } from '@/pages';

const router = createBrowserRouter([
  {
    path: '/',
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
