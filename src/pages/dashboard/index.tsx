import NavPage from '@/components/NavPage';
import TransactionCard from '@/components/TransactionCard';
import config from '@/config/config';
import { poppinsFont } from '@/lib/next-fonts';
import { authSelector } from '@/redux-app/slices/auth-redux-slice';
import { useAppSelector } from '@/redux-app/typed-hooks/redux-typed-hooks';
import type { OrderData, WebResponse } from '@/types/types';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const swrFetcher = (
  url: string,
  auth: {
    username: string;
    password: string;
  }
) =>
  axios
    .get<WebResponse<OrderData[]>>(url, {
      auth,
    })
    .then((res) => res.data);

export default function Dashboard() {
  const [searchOrderId, setSearchOrderId] = useState<string>(() => '');

  const { authStatus, authUsername, authPassword } =
    useAppSelector(authSelector);
  const nextRouter = useRouter();
  const { data: ordersGetResponse, isLoading } = useSWR(
    authStatus && authUsername && authPassword
      ? `${config.HAPPY_BASE_URL_API}/orders`
      : null,
    (url) => {
      if (authUsername && authPassword) {
        return swrFetcher(url, {
          username: authUsername,
          password: authPassword,
        });
      }
    },
    {
      refreshInterval: 1000,
    }
  );

  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchOrderId(() => inputValue);
  };

  const orders = () => {
    if (ordersGetResponse) {
      return ordersGetResponse.data
        .filter((order) => {
          if (searchOrderId) {
            return order.idOrder.startsWith(searchOrderId);
          } else {
            return true;
          }
        })
        .map((order) => {
          return (
            <TransactionCard
              key={order.idOrder}
              idOrder={order.idOrder}
              username={order.username}
              userEmail={order.userEmail}
              brand={order.brand}
              name={order.name}
              expiredDate={order.expiredDate}
              orderedDate={order.orderedDate}
              priceName={order.priceName}
              statusPayment={order.statusPayment}
              totalPrice={order.totalPrice}
            />
          );
        });
    } else {
      return [];
    }
  };

  useEffect(() => {
    if (authStatus) return;

    const redirect = async () => await nextRouter.replace('/');
    void redirect();
  }, [authStatus, nextRouter]);

  return (
    <div className={`${poppinsFont.variable}`}>
      <Head>
        <title>Transaksi Pemesanan Pengguna | Happy</title>
        <link
          rel="icon"
          href="/assets/icons/happy-icon-light-24.svg"
          type="image/svg+xml"
        />
      </Head>

      {authStatus && !isLoading && (
        <>
          <header>
            <NavPage />
          </header>

          <div className="container relative mx-auto max-w-6xl px-6 lg:px-0">
            <div className="pb-6 pt-4">
              <main>
                <div className="mb-8">
                  <label
                    htmlFor="search-product"
                    className="inline-block w-full"
                  >
                    <input
                      className="inline-block w-full rounded-md bg-zinc-800 p-4 placeholder:text-zinc-600 md:placeholder:text-lg"
                      type="text"
                      placeholder="Cari ID Order"
                      id="search-product"
                      value={searchOrderId}
                      onChange={searchHandler}
                    />
                  </label>
                </div>

                <div className="container mx-auto max-w-6xl px-6 lg:px-0">
                  <div className="pb-10 pt-8 lg:pt-16">
                    <h1 className="mb-4 text-center font-poppins text-2xl font-bold md:mb-8 lg:mb-16 lg:text-4xl">
                      Transaksi Pemesanan Pengguna
                    </h1>

                    <div>
                      {ordersGetResponse && (
                        <>
                          {orders().length === 0 ? (
                            <div className="">
                              <p className="mx-auto max-w-max rounded-md bg-zinc-800 p-2 text-center">
                                {searchOrderId
                                  ? 'ID order pengguna tidak ditemukan.'
                                  : 'Belum ada transaksi pemesanan dari pengguna.'}
                                {}
                              </p>
                            </div>
                          ) : (
                            <div>
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {orders()}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
