import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { Session } from "next-auth";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params;

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params;
  const session: Session | null = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "EVENT_OWNER") {
    return NextResponse.json(
      { message: "Unauthorized or Forbidden" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { title, location, description, date } = body;

  if (!title || !location || !description || !date) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
      select: { ownerId: true },
    });

    if (!existingEvent) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    if (existingEvent.ownerId !== session.user.id) {
      return NextResponse.json(
        { message: "Forbidden: You do not own this event" },
        { status: 403 }
      );
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        title,
        location,
        description,
        date: new Date(date),
      },
    });

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error(`Error updating event with ID ${eventId}:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params;
  const session: Session | null = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "EVENT_OWNER") {
    return NextResponse.json(
      { message: "Unauthorized or Forbidden" },
      { status: 403 }
    );
  }

  try {
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
      select: { ownerId: true },
    });

    if (!existingEvent) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    if (existingEvent.ownerId !== session.user.id) {
      return NextResponse.json(
        { message: "Forbidden: You do not own this event" },
        { status: 403 }
      );
    }

    await prisma.event.delete({
      where: { id: eventId },
    });

    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting event with ID ${eventId}:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
