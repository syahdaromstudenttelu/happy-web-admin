import { serverMsw } from '@/mocks/msw/server';
import LoginPage from '@/pages/index';
import { renderWithProviders } from '@/utils/test-render-redux';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import nextMockRouter from 'next-router-mock';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('next/router', () => require('next-router-mock'));

jest.mock('@/config/config', () => ({
  HAPPY_BASE_URL_API: '',
}));

const setupLoginPage = () => {
  const utils = renderWithProviders(<LoginPage />);
  const usernameInput: HTMLInputElement =
    screen.getByPlaceholderText(/^username$/i);
  const passwordInput: HTMLInputElement =
    screen.getByPlaceholderText(/^password$/i);
  const loginBtn: HTMLButtonElement = screen.getByText(/^masuk$/i);

  return { usernameInput, passwordInput, loginBtn, ...utils };
};

beforeAll(() => {
  serverMsw.listen();
});

beforeEach(() => {
  serverMsw.resetHandlers();
});

afterAll(() => {
  serverMsw.close();
});

describe('Login page', () => {
  describe('Login is failed', () => {
    const invalidAccount = [
      {
        username: 'foobar',
        password: 'foobarpasswrong',
      },
      {
        username: 'foobarwrong',
        password: 'foobarpass',
      },
      {
        username: 'foobarwrong',
        password: 'foobarpasswrong',
      },
    ];

    it.each(invalidAccount)(
      'Should stay in login page',
      async ({ username, password }) => {
        await nextMockRouter.push('/');

        const { usernameInput, passwordInput, loginBtn } = setupLoginPage();

        fireEvent.change(usernameInput, {
          target: {
            value: username,
          },
        });

        fireEvent.change(passwordInput, {
          target: {
            value: password,
          },
        });

        fireEvent.click(loginBtn);

        await waitFor(
          () => {
            expect(nextMockRouter).toMatchObject({
              pathname: '/',
            });
          },
          {
            timeout: 1500,
          }
        );
      }
    );

    it.each(invalidAccount)(
      'Should show "Akses ditolak" error alert',
      async ({ username, password }) => {
        await nextMockRouter.push('/');

        const { usernameInput, passwordInput, loginBtn } = setupLoginPage();

        fireEvent.change(usernameInput, {
          target: {
            value: username,
          },
        });

        fireEvent.change(passwordInput, {
          target: {
            value: password,
          },
        });

        fireEvent.click(loginBtn);

        await waitFor(
          () => {
            const errorAlert = screen.getByText(/^akses ditolak$/i);
            expect(errorAlert).toBeInTheDocument();
          },
          {
            timeout: 1500,
          }
        );
      }
    );
  });

  describe('Login is success', () => {
    it('Should redirect to URL path "/dashboard"', async () => {
      await nextMockRouter.push('/');

      const { usernameInput, passwordInput, loginBtn } = setupLoginPage();

      fireEvent.change(usernameInput, {
        target: {
          value: 'foobar',
        },
      });

      fireEvent.change(passwordInput, {
        target: {
          value: 'foobarpass',
        },
      });

      fireEvent.click(loginBtn);

      await waitFor(
        () => {
          expect(nextMockRouter).toMatchObject({
            pathname: '/dashboard',
          });
        },
        {
          timeout: 1500,
        }
      );
    });
  });
});
