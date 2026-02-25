import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ConvexClientProvider } from './convex';

export default function App() {
  return (
    <ConvexClientProvider>
      <RouterProvider router={router} />
    </ConvexClientProvider>
  );
}
