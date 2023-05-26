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
    const yearInMs = (n: number) => {
      return n * 31556952000;
    };

    const hourInMs = (n: number) => {
      return n * 3600000;
    };

    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        status: 'success',
        data: [
          {
            username: 'garrydoe',
            userEmail: 'garrydoe@acme.com',
            idOrder: 'T8eEhAemWby7vJVzExCrkduFO1OW5kbJnGTwA7iOEA76kKtH',
            idProduct: 1,
            brand: 'google-play',
            type: 'Voucher Game',
            name: 'Kode Voucher Google Play',
            priceName: 'IDR10000',
            price: 11000,
            quantity: 8,
            totalPrice: 88000,
            orderedDate: '2023-05-07T14:36:54Z',
            expiredDate: '2023-05-07T19:36:54Z',
            statusPayment: false,
            feedbackDone: false,
          },
          {
            username: 'garrydoe',
            userEmail: 'garrydoe@acme.com',
            idOrder: 'BPoEhAemWby7vJVzExCrkduFO1OW5kbJnGTwA7iOEA76kKtH',
            idProduct: 1,
            brand: 'google-play',
            type: 'Voucher Game',
            name: 'Kode Voucher Google Play',
            priceName: 'IDR10000',
            price: 11000,
            quantity: 8,
            totalPrice: 88000,
            orderedDate: new Date(Date.now() + yearInMs(1)).toISOString(),
            expiredDate: new Date(
              Date.now() + yearInMs(1) + hourInMs(5)
            ).toISOString(),
            statusPayment: false,
            feedbackDone: false,
          },
          {
            username: 'garrydoe',
            userEmail: 'garrydoe@acme.com',
            idOrder: 'ZPz2-HpniwGuE6ZLgIkwbiVyjwzVO4RTRVT96awX4KGD4oIH',
            idProduct: 2,
            brand: 'google-play',
            type: 'Voucher Game',
            name: 'Kode Voucher Google Play',
            priceName: 'IDR20000',
            price: 22000,
            quantity: 5,
            totalPrice: 110000,
            orderedDate: '2023-05-17T11:00:16Z',
            expiredDate: '2023-05-17T16:00:16Z',
            statusPayment: true,
            feedbackDone: false,
          },
        ],
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
  describe('Transactions is available', () => {
    it('Should not show alert text of empty transactions', async () => {
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
            screen.queryByText(/^belum ada transaksi pemesanan dari pengguna/i)
          ).not.toBeInTheDocument();
        },
        {
          timeout: 1500,
        }
      );
    });

    it('Should show all transactions', async () => {
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
            screen.getAllByRole('button', {
              name: /(^sudah Acc$|^acc pembayaran$|^pembayaran kadaluarsa$)/i,
            }).length
          ).toBe(3);
        },
        {
          timeout: 1500,
        }
      );
    });
  });
});
