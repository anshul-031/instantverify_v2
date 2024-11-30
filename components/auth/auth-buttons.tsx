"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { LogOut } from 'lucide-react';

export function AuthButtons() {
  const { user, logout } = useAuth();

  if (user) {
    return (
      <Button variant="outline" size="sm" onClick={logout}>
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    );
  }

  return (
    <>
      <Link href="/login">
        <Button variant="outline" size="sm">Login</Button>
      </Link>
      <Link href="/signup">
        <Button size="sm">Sign Up</Button>
      </Link>
    </>
  );
}