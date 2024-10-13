import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
// Your own logic for dealing with plaintext password strings; be careful!
import { getUserFromDb } from "./lib/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "./lib/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
  
  adapter: MongoDBAdapter(client),

  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: "email", name: "email", placeholder: "email" },
        password: {
          label: "password",
          name: "password",
          placeholder: "password",
        },
      },

      authorize: async (credentials) => {
        const { email, password } = credentials;

        // logic to verify if the user exists
        const user = await getUserFromDb(email as string, password as string);

        // return user object with their profile data
        return user;
      },
    }),
    GitHub,
  ],

  callbacks: {
    jwt({ token, account }) {
      // console.log("jwt token : ", token);
      // console.log("jwt user : ", user);
      return token;
    },
    session({ session }) {
      // console.log(" kk session session : ", session);
      // console.log(" kk session token : ", token);
      // session.user.secretCode = user.secretCode

      return session;
    },

    async signIn({ user }) {
      // Here, you can add any custom logic before saving the user
      // Example: Adding a custom field
      user.isAcceptingMessage = true;
      user.secretCode = JSON.stringify(Math.floor(10000000 + Math.random() * 90000000)) ;
      // user.messages = [ { content : `Hello ${user.name} , Sart enjoying our product Mystery Message` , createdAt : Date.now }];
      // console.log("Ss signIn user : ", user); 
      return true;
    },
  },

  session: {
    strategy: "jwt",
  },
});
