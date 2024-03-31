import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import { authConfig } from './auth.config';
import axios from 'axios';

async function getUser(email: string): Promise<User | undefined> {
  try {
    // const response = await axios.get('http://196.189.124.134:38443/api/users');
    // const user = response.data;
    // console.log({ user });
    // return user;
    return {
      id: '410544b2-4001-4271-9855-fec4b6a6442b',
      name: 'Marden.Admin',
      email: 'marden2024@admin.com',
      password: '123456',
    };
    // return {
    //   id: 26,
    //   first_name: 'User',
    //   last_name: 'User',
    //   user_name: 'Seid',
    //   verified: 1,
    //   email: 'abenikeb79@gmail.com',
    //   phone: '251911508778',
    //   gender: '',
    //   address: '',
    //   role: 'user',
    //   email_verified_at: 'null',
    //   password: '1uj@21f6fwB',
    //   remember_token: 'null',
    //   created_at: '2024-03-18T11:52:00.000000Z',
    //   updated_at: '2024-03-18T11:52:00.000000Z',
    //   rand_pass: 'N6QjS6CxM8',
    // };
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

// async function getUser(email: string): Promise<User | undefined> {
//   try {
//     const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
//     console.log({ user });
//     return user.rows[0];
//   } catch (error) {
//     console.error('Failed to fetch user:', error);
//     throw new Error('Failed to fetch user.');
//   }
// }

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        console.log({ parsedCredentials });

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await getUser(email);
          console.log({ user });
          if (!user) return null;

          // // Ensure that the user object has a password field and it's properly hashed
          // if (!user.password) return null;

          // const passwordsMatch = await bcrypt.compare(password, user.password);
          // if (passwordsMatch) return user;

          return {
            id: '410544b2-4001-4271-9855-fec4b6a6442b',
            name: 'Marden.Admin',
            email: 'marden2024@admin.com',
            password: '123456',
          };
        }
        // return true;

        // if (parsedCredentials.success) {
        //   const { email, password } = parsedCredentials.data;

        //   const user = await getUser(email);
        //   if (!user) return null;

        //   const passwordsMatch = await bcrypt.compare(password, user.password);
        //   // console.log({
        //   //   user,
        //   //   email,
        //   //   password,
        //   //   userPass: user.password,
        //   //   passwordsMatch,
        //   // });

        //   // if (passwordsMatch) return user;
        //   return user;
        // }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
