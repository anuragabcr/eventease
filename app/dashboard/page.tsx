import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "EVENT_OWNER") {
    return <div className="text-red-600 p-4">Access denied</div>;
  }

  const events = await prisma.event.findMany({
    where: { ownerId: session.user.id },
    orderBy: { date: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Events</h1>
        <Link
          href="/dashboard/new-event"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <p>No events yet.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.id} className="border p-4 rounded shadow-sm">
              <h2 className="font-semibold">{event.title}</h2>
              <p>
                {event.location} • {new Date(event.date).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">{event.description}</p>
              {/* Placeholder for Edit/Delete */}
              <div className="mt-2 space-x-2">
                <button className="text-blue-500">Edit</button>
                <button className="text-red-500">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
