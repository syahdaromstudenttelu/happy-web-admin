import { Inter, Poppins } from 'next/font/google';

export const poppinsFont = Poppins({
  subsets: ['latin'],
  style: ['normal'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-poppins',
});

export const interFont = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});
