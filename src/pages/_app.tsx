import LayoutPage from '@/components/LayoutPage';
import { reduxStore } from '@/redux-app/store/redux-store';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider as ReduxProvider } from 'react-redux';

export default function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider store={reduxStore}>
      <LayoutPage>
        <Component {...pageProps} />
      </LayoutPage>
    </ReduxProvider>
  );
}
