import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ConvexClientProvider } from './convex';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <ConvexClientProvider>
      <RouterProvider router={router} />
      <Analytics />
    </ConvexClientProvider>
  );
}
