export type Address = {
  name: string;
  mobile: string;
  house: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  type: string;
  isDefault: boolean;
};

export type Customer = {
  name: string;
  mobile: string;
  email: string;
};

export type OrderItem = {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
};

export type Order = {
  id: number;

  items: OrderItem[];

  total: number;

  status: string;

  date: string;

  customer: Customer;

  deliveryAddress: Address;

  cancelReason?: string;

  refundStatus?: string;
};