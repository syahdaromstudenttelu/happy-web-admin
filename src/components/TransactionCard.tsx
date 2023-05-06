import { authSelector } from '@/redux-app/slices/auth-redux-slice';
import { useAppSelector } from '@/redux-app/typed-hooks/redux-typed-hooks';
import axios from 'axios';
import cn from 'classnames';
import { format } from 'date-fns';
import Image from 'next/image';
import { useState } from 'react';
import googlePlayLogo from '../assets/logos/google-play-logo.png';
import steamLogo from '../assets/logos/steam-logo.png';
import config from '../config/config';

interface TransactionCardProps {
  idOrder: string;
  username: string;
  userEmail: string;
  brand: 'google-play' | 'steam';
  name: string;
  priceName: string;
  totalPrice: number;
  orderedDate: string;
  expiredDate: string;
  statusPayment: boolean;
}

const productBrand = {
  'google-play': googlePlayLogo,
  steam: steamLogo,
};

export default function TransactionCard({
  idOrder,
  username,
  userEmail,
  brand,
  name,
  priceName,
  totalPrice,
  orderedDate,
  expiredDate,
  statusPayment,
}: TransactionCardProps) {
  const [accLoading, setAccLoading] = useState<boolean>(() => false);

  const { authUsername, authPassword } = useAppSelector(authSelector);

  const isExpired = Date.now() - Date.parse(expiredDate) > 0 && !statusPayment;
  const disableAccBtn = statusPayment || isExpired || accLoading;

  const acceptHandler = async () => {
    if (statusPayment || isExpired || !authUsername || !authPassword) return;
    setAccLoading(() => true);

    await axios.put(
      `${config.HAPPY_BASE_URL_API}/orders/statusPayment/${idOrder}`,
      {},
      {
        auth: {
          username: authUsername,
          password: authPassword,
        },
      }
    );

    setAccLoading(() => false);
  };

  return (
    <article className="overflow-hidden rounded-md bg-zinc-800">
      <div className="mb-2 bg-zinc-100 py-10">
        <div className="h-16">
          <Image
            className="mx-auto h-full w-max"
            src={productBrand[brand]}
            alt={`Logo ${name} beserta teks`}
          />
        </div>
      </div>

      <div className="mb-6 px-2">
        <div className="mb-2">
          <div className="max-w-max rounded-md bg-rose-600 p-1">
            <p className="text-sm">Kode Voucher</p>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="mb-1 font-poppins text-xl font-bold">{name}</h2>
          <p>({priceName})</p>
        </div>

        <div className="grid gap-y-2">
          <div>
            <h3 className="mb-1 font-poppins font-bold">ID Pemesanan</h3>
            <p className="w-full break-all rounded-md bg-zinc-600 px-2 py-1">
              {idOrder}
            </p>
          </div>

          <div>
            <h3 className="mb-1 font-poppins font-bold">Username</h3>
            <p className="w-full break-all rounded-md bg-zinc-600 px-2 py-1">
              {username}
            </p>
          </div>

          <div>
            <h3 className="mb-1 font-poppins font-bold">Email</h3>
            <p className="w-full break-all rounded-md bg-zinc-600 px-2 py-1">
              {userEmail}
            </p>
          </div>

          <div>
            <h3 className="mb-1 font-poppins font-bold">Tanggal Pemesanan</h3>
            <p className="w-full break-all rounded-md bg-zinc-600 px-2 py-1">
              {format(new Date(orderedDate), 'dd-MM-yyyy, HH:mm:ss')}
            </p>
          </div>

          <div>
            <h3 className="mb-1 font-poppins font-bold">Tanggal Kadaluarsa</h3>
            <p className="w-full break-all rounded-md bg-zinc-600 px-2 py-1">
              {format(new Date(expiredDate), 'dd-MM-yyyy, HH:mm:ss')}
            </p>
          </div>

          <div>
            <h3 className="mb-1 font-poppins font-bold">Status Pembayaran</h3>
            <p
              className={cn('max-w-max rounded-md px-2 py-1', {
                'bg-amber-600': !statusPayment && !isExpired,
                'bg-emerald-600': statusPayment,
                'bg-rose-600': !statusPayment && isExpired,
              })}
            >
              {!statusPayment && !isExpired && 'Belum Acc'}
              {statusPayment && 'Sudah Acc'}
              {!statusPayment && isExpired && 'Kadaluarsa'}
            </p>
          </div>

          <div>
            <h3 className="mb-1 font-poppins font-bold">Total Pembayaran</h3>
            <p>
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
              }).format(totalPrice)}
            </p>
          </div>
        </div>
      </div>

      <div>
        <button
          className={cn(
            'inline-block w-full py-4 text-center font-poppins font-semibold',
            {
              'bg-emerald-600': !statusPayment && !isExpired,
              'bg-zinc-600 text-zinc-400': statusPayment,
              'cursor-default bg-rose-800 text-zinc-400':
                !statusPayment && isExpired,
            }
          )}
          type="button"
          disabled={disableAccBtn}
          onClick={acceptHandler}
        >
          {statusPayment && !isExpired && !accLoading && 'Sudah Acc'}
          {!statusPayment && !isExpired && !accLoading && 'Acc Pembayaran'}
          {!statusPayment &&
            isExpired &&
            !accLoading &&
            'Pembayaran Kadaluarsa'}
          {!statusPayment && !isExpired && accLoading && 'Memproses...'}
        </button>
      </div>
    </article>
  );
}
