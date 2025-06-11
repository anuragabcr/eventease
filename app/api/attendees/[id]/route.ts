import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;

    const rsvps = await prisma.rSVP.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    });

    return new Response(JSON.stringify(rsvps), { status: 200 });
  } catch (error) {
    console.error("Error fetching RSVPs by event:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
