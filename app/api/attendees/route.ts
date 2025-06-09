import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");

  if (!session || session.user.role !== "EVENT_OWNER") {
    return new Response("Unauthorized", { status: 403 });
  }

  if (!eventId) return new Response("Missing Event ID", { status: 400 });

  // Ensure the event belongs to the logged-in user
  const event = await prisma.event.findFirst({
    where: { id: eventId, ownerId: session.user.id },
  });

  if (!event)
    return new Response("Event not found or unauthorized", { status: 404 });

  const rsvps = await prisma.rSVP.findMany({
    where: { eventId },
    orderBy: { createdAt: "desc" },
  });

  return new Response(JSON.stringify(rsvps), { status: 200 });
}
