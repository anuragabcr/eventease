import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return new Response("Missing ID", { status: 400 });

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) return new Response("Event not found", { status: 404 });

  return new Response(JSON.stringify(event), { status: 200 });
}
