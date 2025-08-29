// app/api/households/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@/auth.config";            // ← server helper
import { db } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Нэвтэрсэн хүний household-ууд
  const me = await db.user.findUnique({ where: { email: session.user.email } });
  if (!me) return NextResponse.json({ households: [] });

  const memberships = await db.membership.findMany({
    where: { userId: me.id },
    include: { household: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    households: memberships.map(m => ({
      id: m.household.id,
      name: m.household.name,
      role: m.role,
      createdAt: m.household.createdAt,
    })),
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const name = (body?.name ?? "").toString().trim();
  const role = (body?.role ?? "PARENT").toString().toUpperCase() as "PARENT" | "CHILD";

  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  if (!["PARENT", "CHILD"].includes(role)) return NextResponse.json({ error: "Invalid role" }, { status: 400 });

  const me = await db.user.findUnique({ where: { email: session.user.email } });
  if (!me) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Household + Membership
  const household = await db.household.create({
    data: {
      name,
      ownerId: me.id,
      members: {
        create: {
          userId: me.id,
          role,
        },
      },
    },
    include: { members: true },
  });

  return NextResponse.json({ household }, { status: 201 });
}
