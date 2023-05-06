export type ProductBrand = 'google-play' | 'steam';

export interface UserCredential {
  id: number;
  fullname: string;
  username: string;
  email: string;
}

export interface OrderData {
  idOrder: string;
  idProduct: number;
  username: string;
  userEmail: string;
  brand: ProductBrand;
  type: string;
  name: string;
  priceName: string;
  price: number;
  quantity: number;
  totalPrice: number;
  orderedDate: string;
  expiredDate: string;
  statusPayment: boolean;
  feedbackDone: boolean;
}

export interface WebResponse<T> {
  code: number;
  status: 'success' | 'failed';
  data: T;
}
