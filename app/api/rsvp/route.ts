import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { name, email, eventId } = await req.json();

  if (!name || !email || !eventId) {
    return new Response("Missing fields", { status: 400 });
  }

  const rsvp = await prisma.rSVP.create({
    data: {
      name,
      email,
      eventId,
    },
  });

  return new Response(JSON.stringify(rsvp), { status: 200 });
}
