import happyLightLogo from '@/assets/logos/happy-logo-light.png';
import {
  setAuthPassword,
  setAuthStatus,
  setAuthUsername,
} from '@/redux-app/slices/auth-redux-slice';
import { useAppDispatch } from '@/redux-app/typed-hooks/redux-typed-hooks';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function NavPage() {
  const nextRouter = useRouter();
  const reduxDispatch = useAppDispatch();

  const logoutHandler = async () => {
    reduxDispatch(setAuthStatus(false));
    reduxDispatch(setAuthUsername(null));
    reduxDispatch(setAuthPassword(null));

    await nextRouter.replace('/');
  };

  return (
    <nav>
      <div className="w-full bg-zinc-800">
        <div className="container relative mx-auto max-w-6xl px-6 lg:px-0">
          <div className="relative flex items-center justify-between py-2">
            <div className="flex items-center justify-center">
              <div className="py-2">
                <Image
                  className="w-8 md:w-10"
                  src={happyLightLogo}
                  alt="Logo e-Commerce Happy"
                />
              </div>
            </div>

            <button
              className="absolute -right-4 inline-block rounded-md bg-rose-600 px-4 py-2 font-semibold"
              onClick={logoutHandler}
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
