import { interFont } from '@/lib/next-fonts';
import type { ReactNode } from 'react';

interface LayoutPageProps {
  children: ReactNode;
}

export default function LayoutPage({ children }: LayoutPageProps) {
  return <div className={`${interFont.variable} font-inter`}>{children}</div>;
}
