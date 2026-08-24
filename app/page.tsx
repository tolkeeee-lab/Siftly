'use client';

import App from '@/App';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function HomePage() {
  return (
    <AuthGuard>
      <App />
    </AuthGuard>
  );
}

