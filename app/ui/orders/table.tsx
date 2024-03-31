'use client';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import { useState } from 'react';
import Search from '@/app/ui/search';
import { AiOutlineEye } from 'react-icons/ai';
import {
  CustomersTableType,
  FormattedCustomersTable,
} from '@/app/lib/definitions';

export default function OrdersTable({
  orders,
}: {
  // customers: FormattedCustomersTable[];
  orders: any;
}) {
  const [selectedProduct, setSelectedProduct] = useState([]);

  const openModal = (productName: any) => {
    setSelectedProduct(JSON.parse(productName));
  };

  const closeModal = () => {
    setSelectedProduct([]);
  };
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Orders
      </h1>
      <Search placeholder="Search orders..." />
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {orders?.map((order: any) => (
                  <div
                    key={order.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <p>Order #{order.id}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {order.user_name}{' '}
                          <span className="text-blue-500">{order.phone}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Transaction No</p>
                        <p className="font-medium">{order.transaction_id}</p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Total Paid</p>
                        <p className="font-medium">{order.total}</p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Status</p>
                        <p className="font-medium">{order.status}</p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Product Info</p>
                        <button
                          onClick={() =>
                            openModal(JSON.stringify(order.product_info))
                          }
                          className="text-lg text-orange-400 hover:text-orange-600 focus:outline-none"
                        >
                          <AiOutlineEye />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Order Id
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Phone
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Transaction No
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Total Paid
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Product Info
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {orders.map((order: any) => (
                    <tr key={order.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>#{order.id}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {order.user_name}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {order.phone}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {order.transaction_id}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {order.total} Birr
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {order.status}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                        <button
                          onClick={() =>
                            openModal(JSON.stringify(order.product_info))
                          }
                          className="text-lg text-orange-400 hover:text-orange-600 focus:outline-none"
                        >
                          <AiOutlineEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {selectedProduct && selectedProduct.length > 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-lg rounded-md bg-white p-8">
            <h2 className="mb-4 text-xl font-semibold">Product Details</h2>
            <div className="grid gap-4">
              {selectedProduct.map((product: any) => (
                <div key={product.id} className="rounded-md border p-4">
                  <p className="text-sm font-medium">
                    Product Name: {product.product_name}
                  </p>
                  <p className="text-sm">
                    Product Option: {product.product_option_name}
                  </p>
                  <p className="text-sm">Quantity: {product.quantity}</p>
                  <p className="text-sm">
                    Single Product Price: ETB {product.price}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={closeModal}
              className="mt-6 w-full rounded-md bg-orange-400 py-2 text-white transition duration-300 ease-in-out hover:bg-orange-600 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
