import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';
import axios from 'axios';

export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    // const data = await sql<Revenue>`SELECT * FROM revenue`;

    // // console.log('Data fetch completed after 3 seconds.');

    // return data.rows;
    return [
      { month: 'Jan', revenue: 2000 },
      { month: 'Feb', revenue: 1800 },
      { month: 'Mar', revenue: 2200 },
      { month: 'Apr', revenue: 2500 },
      { month: 'May', revenue: 2300 },
      { month: 'Jun', revenue: 3200 },
      { month: 'Jul', revenue: 3500 },
      { month: 'Aug', revenue: 3700 },
      { month: 'Sep', revenue: 2500 },
      { month: 'Oct', revenue: 2800 },
      { month: 'Nov', revenue: 3000 },
      { month: 'Dec', revenue: 4800 },
    ];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  noStore();
  try {
    // const data = await sql<LatestInvoiceRaw>`
    //   SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
    //   FROM invoices
    //   JOIN customers ON invoices.customer_id = customers.id
    //   ORDER BY invoices.date DESC
    //   LIMIT 5`;

    // const latestInvoices = data.rows.map((invoice) => ({
    //   ...invoice,
    //   amount: formatCurrency(invoice.amount),
    // }));
    // return latestInvoices;
    return [
      {
        id: 'string',
        name: 'Abenezer',
        image_url: '/customers/delba-de-oliveira.png',
        email: 'abenikeb79@gmail.com',
        amount: '500',
      },
    ];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    // const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    // const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    // const invoiceStatusPromise = sql`SELECT
    //      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
    //      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
    //      FROM invoices`;

    // const data = await Promise.all([
    //   invoiceCountPromise,
    //   customerCountPromise,
    //   invoiceStatusPromise,
    // ]);

    // const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    // const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    // const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    // const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');
    const accessToken = '1|HVfZui9NWDKhCgXnAep2TmMQkIxzshgGOtGoryVc72617374';
    // const [usersResponse, ordersResponse] = await Promise.all([
    //   axios.get('http://196.189.124.134:38443/api/users'),
    //   axios.get('http://196.189.124.134:38443/api/get-all-orders', {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   }),
    // ]);

    // const numberOfUsers = usersResponse.data.users.length;
    // const numberOfOrders = ordersResponse.data.data.length;

    // return {
    //   numberOfCustomers: numberOfUsers,
    //   numberOfInvoices: numberOfOrders,
    //   totalPaidInvoices: 1,
    //   totalPendingInvoices: 1,
    // };

    const [usersResponse, ordersResponse] = await Promise.all([
      axios.get('http://196.189.124.134:38443/api/users'),
      axios.get('http://196.189.124.134:38443/api/get-all-orders', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    ]);

    const numberOfUsers = usersResponse.data.users.length;
    const allOrders = ordersResponse.data.data;
    const numberOfOrders = allOrders.length;

    // Filter orders based on status
    const pendingOrders = allOrders.filter(
      (order: any) => order.status === 'pending',
    );
    const completedOrders = allOrders.filter(
      (order: any) => order.status === 'completed',
    );
    const numberOfPendingOrders = pendingOrders.length;
    const numberOfCompletedOrders = completedOrders.length;

    return {
      numberOfCustomers: numberOfUsers,
      numberOfInvoices: numberOfOrders,
      totalPaidInvoices: numberOfCompletedOrders, // Assuming completed orders represent paid invoices
      totalPendingInvoices: numberOfPendingOrders,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    // const data = await sql<CustomerField>`
    //   SELECT
    //     id,
    //     name
    //   FROM customers
    //   ORDER BY name ASC
    // `;

    // const customers = data.rows;
    // return customers;
    return [
      {
        id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
        name: 'Delba de Oliveira',
        email: 'delba@oliveira.com',
        image_url: '/customers/delba-de-oliveira.png',
      },
      {
        id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
        name: 'Lee Robinson',
        email: 'lee@robinson.com',
        image_url: '/customers/lee-robinson.png',
      },
      {
        id: '3958dc9e-737f-4377-85e9-fec4b6a6442a',
        name: 'Hector Simpson',
        email: 'hector@simpson.com',
        image_url: '/customers/hector-simpson.png',
      },
    ];
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

// export async function fetchFilteredCustomers(query: string) {
//   noStore();
//   try {
//     // const data = await sql<CustomersTableType>`
//     // SELECT
//     //   customers.id,
//     //   customers.name,
//     //   customers.email,
//     //   customers.image_url,
//     //   COUNT(invoices.id) AS total_invoices,
//     //   SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
//     //   SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
//     // FROM customers
//     // LEFT JOIN invoices ON customers.id = invoices.customer_id
//     // WHERE
//     //   customers.name ILIKE ${`%${query}%`} OR
//     //     customers.email ILIKE ${`%${query}%`}
//     // GROUP BY customers.id, customers.name, customers.email, customers.image_url
//     // ORDER BY customers.name ASC
//     // `;

//     // const customers = data.rows.map((customer) => ({
//     //   ...customer,
//     //   total_pending: formatCurrency(customer.total_pending),
//     //   total_paid: formatCurrency(customer.total_paid),
//     // }));

//     // return customers;

//     return [
//       {
//         id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
//         name: 'Abenezer Kebede',
//         email: 'abenikeb79@gmail.com',
//         image_url: '/customers/delba-de-oliveira.png',
//         total_invoices: 2,
//         total_pending: 3,
//         total_paid: 4,
//       },
//     ];
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch customer table.');
//   }
// }

export async function fetchFilteredCustomers(query: string) {
  try {
    const response = await axios.get('http://196.189.124.134:38443/api/users');
    const users = response.data.users;
    console.log({ users });

    // Map the fetched data to return only the required fields
    const filteredCustomers = users.map((user: CustomersTableType) => ({
      id: user.id,
      name: `${user.user_name}`,
      phone: user.phone,
      image_url: user.image_url,
      total_invoices: user.total_invoices ?? 0,
      total_pending: user.total_pending ?? 0,
      total_paid: user.total_paid ?? 0,
    }));

    return filteredCustomers;
  } catch (err) {
    console.error('Fetch Error:', err);
    throw new Error('Failed to fetch customers.');
  }
}

export async function fetchFilteredOrders(query: string) {
  try {
    const accessToken = '1|HVfZui9NWDKhCgXnAep2TmMQkIxzshgGOtGoryVc72617374';
    const response = await axios.get(
      'http://196.189.124.134:38443/api/get-all-orders',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const orders = response.data.data;
    console.log({ orders });

    // Map the fetched data to return only the required fields
    const filteredOrders = orders.map((orders: any) => ({
      id: orders.orderId,
      transaction_id: `${orders.transaction_id}`,
      user_name: orders.user_name,
      phone: orders.phone,
      status: orders.status,
      total: orders.total ?? 0,
      product_info: orders.order_items ?? [],
      region: orders.address ?? '',
      city: orders.address ?? '',
      address: orders.address ?? '',
      remark: orders.remark,
    }));

    return filteredOrders;
  } catch (err) {
    console.error('Fetch Error:', err);
    throw new Error('Failed to fetch orders.');
  }
}

export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
