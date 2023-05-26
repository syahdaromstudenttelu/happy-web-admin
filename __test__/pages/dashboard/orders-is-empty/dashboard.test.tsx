import DashboardPage from '@/pages/dashboard';
import { renderWithProviders } from '@/utils/test-render-redux';
import { screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import nextRouterMock from 'next-router-mock';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('next/router', () => require('next-router-mock'));

jest.mock('@/config/config', () => ({
  HAPPY_BASE_URL_API: '',
}));

const serverMsw = setupServer(
  rest.get('/orders', async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        status: 'success',
        data: [],
      })
    );
  })
);

beforeAll(() => {
  serverMsw.listen();
});

beforeEach(() => {
  serverMsw.resetHandlers();
});

afterAll(() => {
  serverMsw.close();
});

describe('Dashboard page', () => {
  describe('Transactions is empty', () => {
    it('Should show alert text of empty transactions', async () => {
      await nextRouterMock.push('/dashboard');
      renderWithProviders(<DashboardPage />, {
        preloadedState: {
          auth: {
            authStatus: true,
            authUsername: 'foobar',
            authPassword: 'foobarpass',
          },
        },
      });

      await waitFor(
        () => {
          expect(
            screen.getByText(/^belum ada transaksi pemesanan dari pengguna/i)
          ).toBeInTheDocument();
        },
        {
          timeout: 1500,
        }
      );
    });
  });
});
