import happyLogoLight from '@/assets/logos/happy-logo-light.png';
import config from '@/config/config';
import { poppinsFont } from '@/lib/next-fonts';
import {
  setAuthPassword,
  setAuthStatus,
  setAuthUsername,
} from '@/redux-app/slices/auth-redux-slice';
import { useAppDispatch } from '@/redux-app/typed-hooks/redux-typed-hooks';
import axios from 'axios';
import cn from 'classnames';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import isEmpty from 'validator/lib/isEmpty';
import isLength from 'validator/lib/isLength';
import isLowercase from 'validator/lib/isLowercase';

export default function Home() {
  const [username, setUsernameInput] = useState<string>(() => '');
  const [uPassword, setUPasswordInput] = useState<string>(() => '');
  const [loginAlert, setLoginAlert] = useState<string>(() => '');
  const [loginLoading, setLoginLoading] = useState<boolean>(() => false);

  const nextRouter = useRouter();
  const reduxDispatch = useAppDispatch();

  const loginInputInvalid =
    !isLength(uPassword, {
      min: 8,
    }) ||
    !isLowercase(username) ||
    isEmpty(username);

  const usernameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.split(' ').join('');
    setUsernameInput(() => inputValue);
  };

  const passwordHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setUPasswordInput(() => inputValue);
  };

  const loginHandler = async () => {
    setLoginLoading(() => true);

    try {
      await axios.get(`${config.HAPPY_BASE_URL_API}/login`, {
        auth: {
          username,
          password: uPassword,
        },
      });

      reduxDispatch(setAuthStatus(true));
      reduxDispatch(setAuthUsername(username));
      reduxDispatch(setAuthPassword(uPassword));

      await nextRouter.replace('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setLoginAlert(() => 'Akses ditolak');
      }
    } finally {
      setLoginLoading(() => false);
    }
  };

  return (
    <div className={`${poppinsFont.variable}`}>
      <div>
        <Head>
          <title>Happy Admin Web</title>
        </Head>

        <link
          rel="icon"
          href="/assets/icons/happy-icon-light-24.svg"
          type="image/svg+xml"
        />
      </div>

      <div className="flex h-screen w-full items-center justify-center px-4 md:px-0">
        <div className="max-w-xl flex-1">
          <header>
            <div className="mb-2 text-center">
              <div className="mb-2 md:mb-4">
                <Image
                  className="mx-auto h-8 w-max select-none md:h-12"
                  src={happyLogoLight}
                  alt="Logo e-Commerce Happy"
                />
              </div>

              <h1 className="font-poppins text-2xl font-bold md:mb-4 md:text-4xl">
                Masuk Happy Admin
              </h1>
            </div>
          </header>

          <main>
            <div
              className={cn({
                invisible: isEmpty(loginAlert),
              })}
            >
              <div className="mb-3">
                <p className="mx-auto max-w-max rounded-md bg-rose-600 px-3 py-1">
                  {loginAlert}
                </p>
              </div>
            </div>

            <form>
              <div className="mb-8 grid gap-y-4">
                <label htmlFor="login-username" className="inline-block w-full">
                  <input
                    className="inline-block w-full rounded-md bg-zinc-800 p-4 placeholder:text-zinc-600 md:placeholder:text-lg"
                    type="text"
                    placeholder="Username"
                    id="login-username"
                    onChange={usernameHandler}
                  />
                </label>

                <label htmlFor="login-password" className="inline-block w-full">
                  <input
                    className="inline-block w-full rounded-md bg-zinc-800 p-4 placeholder:text-zinc-600 md:placeholder:text-lg"
                    type="password"
                    placeholder="Password"
                    id="login-password"
                    onChange={passwordHandler}
                  />
                </label>
              </div>

              <button
                className="inline-block w-full rounded-md bg-rose-600 py-3 text-center font-poppins font-semibold disabled:bg-zinc-600 disabled:text-zinc-500 md:text-2xl"
                type="button"
                onClick={loginHandler}
                disabled={loginInputInvalid || loginLoading}
              >
                {loginLoading && 'Memproses...'}
                {!loginLoading && 'Masuk'}
              </button>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}
