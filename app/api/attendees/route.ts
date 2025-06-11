import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "EVENT_OWNER") {
    return new Response("Unauthorized", { status: 403 });
  }

  const events = await prisma.event.findMany({
    where: { ownerId: session.user.id },
    select: { id: true },
  });

  if (events.length === 0) {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  const eventIds = events.map((e) => e.id);

  const rsvps = await prisma.rSVP.findMany({
    where: {
      eventId: { in: eventIds },
    },
    include: {
      event: {
        select: { title: true, date: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return new Response(JSON.stringify(rsvps), { status: 200 });
}
