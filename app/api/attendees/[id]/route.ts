import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;

    const session = await getServerSession(authOptions);

    if (!session || !session.user.role) {
      return new Response("Unauthorized", { status: 403 });
    }

    // const whereClause =
    //   session.user.role !== "EVENT_OWNER" ? {} : { ownerId: session.user.id };

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
