import {
  fetchFilteredCustomers,
  fetchCustomers,
  fetchFilteredOrders,
} from '@/app/lib/data';
import OrdersTable from '@/app/ui/orders/table';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orders',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';

  const orders = await fetchFilteredOrders(query);

  return (
    <main>
      <OrdersTable orders={orders} />
    </main>
  );
}
