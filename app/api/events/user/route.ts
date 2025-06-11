import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.role) {
    return new Response("Unauthorized", { status: 403 });
  }

  const whereClause =
    session.user.role !== "EVENT_OWNER" ? {} : { ownerId: session.user.id };
  const events = await prisma.event.findMany({
    where: whereClause,
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
