import NextAuth from "next-auth";

interface User {
  id: number;
  username?: string;
  first_name: string;
  last_name: string;
  email?: string;
  has_completed_onboarding: boolean;
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    access_token?: string;
    refresh_token?: string;
    user?: User;
  }
}
