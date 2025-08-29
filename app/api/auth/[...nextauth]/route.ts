// app/api/auth/[...nextauth]/route.ts
export const runtime = "nodejs"; // Prisma adapter → Node runtime

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "../../../../lib/prisma"; // alias ажиллахгүй бол relative

// ENV хамгаалалт
function env(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ENV: ${name}`);
  return v;
}

const handler = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: env("GOOGLE_CLIENT_ID"),
      clientSecret: env("GOOGLE_CLIENT_SECRET"),
    }),
  ],
  secret: env("AUTH_SECRET"),
  session: { strategy: "database" },
});

// ⬇️ v5 дээр ч ажилладаг найдвартай экспорт
export { handler as GET, handler as POST };
