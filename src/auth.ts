import NextAuth from "next-auth"
import "next-auth/jwt"

import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  // debug: true,
  // secret: "IIC/cJNhqiPvLHEOzUs3C66+p1Tf/bFmQ8eboaPH4SI=",
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // prompt: "none",
          // callback: '', // Not work
          prompt: "select_account",
          hd: "askrindo.co.id",
          access_type: "offline",
          scope: 'openid email profile https://www.googleapis.com/auth/spreadsheets.readonly',
          response_type: "code",
        },
      },
    }),
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        // email: {},
        // password: {},
        accessToken: {},
        user: {},
      },
      /* eslint-disable @typescript-eslint/no-explicit-any */
      authorize: async (credentials: any) => {
        if (credentials) {
          const user = credentials;
          return {
            name: user.name,
            email: user.email,
            image: user.image,
          };
        }
        return null;
      },
    }),
  ],
  // basePath: "/pipa/api/auth",
  session: { strategy: "jwt" },
  cookies: {
    csrfToken: {
      options: {
        secure: true,
        sameSite: 'none'
      }
    },
    callbackUrl: {
      options: {
        secure: true,
        sameSite: 'none'
      }
    },
    sessionToken: {
      options: {
        secure: true,
        sameSite: 'none'
      }
    }
  },
  callbacks: {
async jwt({ token, account }) {
  if (account) {
    return {
      ...token,
      accessToken: account.access_token,
      expires_at: account.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
      /* eslint-disable @typescript-eslint/no-explicit-any */
      refresh_token: account.refresh_token ?? (token as any).refresh_token,
    };
  } else if (token.expires_at && Date.now() < token.expires_at * 1000) {
    // Subsequent logins, but the `accessToken` is still valid
    return token;
  } else {
    // Subsequent logins, but the `accessToken` has expired, try to refresh it
    if (!token.refresh_token) throw new TypeError("Missing refresh_token");

    try {
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          grant_type: "refresh_token",
          refresh_token: token.refresh_token!,
        }),
      });

      const tokensOrError = await response.json();

      if (!response.ok) throw tokensOrError;

      const newTokens = tokensOrError as {
        access_token: string;
        expires_in: number;
        refresh_token?: string;
      };

      return {
        ...token,
        accessToken: newTokens.access_token,
        expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
        refresh_token: newTokens.refresh_token
          ? newTokens.refresh_token
          : token.refresh_token,
      };
    } catch (error) {
      console.error("Error refreshing access_token", error);
      // If we fail to refresh the token, return an error so we can handle it on the page
      return {
        ...token,
        error: "RefreshTokenError",
      };
    }
  }
},
    // jwt({ token, account }) {
    //   if (account) token.accessToken = account.access_token;
    //   return token
    // },
    async session({ session, token }) {
      // console.log("account", user);
      if (token?.accessToken) session.accessToken = token.accessToken;// as string
      return session
    },
  },
})
 
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: "RefreshTokenError"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    expires_at: number
    refresh_token?: string
    error?: "RefreshTokenError"
  }
}