import { Head, Html, Main, NextScript } from 'next/document';

export default function CustomDocument() {
  return (
    <Html lang="en">
      <Head />
      <body className="bg-zinc-900 text-zinc-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
