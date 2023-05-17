import type { PreloadedState } from '@reduxjs/toolkit';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import type { AppStore, RootState } from '@/redux-app/store/redux-store';
import { setupStore } from '@/redux-app/store/redux-store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<object>): JSX.Element {
    return <ReduxProvider store={store}>{children}</ReduxProvider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
