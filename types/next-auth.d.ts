// next-auth.d.ts
import { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string; // Add this line to include the 'id' property
      role?: string; // Add any other custom properties like 'role' if you use them
      // ...and so on for any other custom properties you're adding to `session.user`
    } & DefaultSession["user"]; // This merges with the default user properties (name, email, image)
  }
}

declare module "next-auth/jwt" {
  /**
   * The contents of JWT can be extended.
   */
  interface JWT extends DefaultJWT {
    id: string; // Add this line to include the 'id' property in the JWT
    role?: string; // Add any other custom properties like 'role' if you use them
    // ...and so on for any other custom properties you're adding to the token
  }
}
