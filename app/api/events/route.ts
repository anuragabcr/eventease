import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const events = await prisma.event.findMany({
    include: {
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  return new Response(JSON.stringify(events), { status: 200 });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.role) {
    return new Response("Unauthorized", { status: 403 });
  }

  const { title, location, description, date } = await req.json();

  const event = await prisma.event.create({
    data: {
      title,
      location,
      description,
      date: new Date(date),
      ownerId: session.user.id,
    },
  });

  return new Response(JSON.stringify(event), { status: 200 });
}
