import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { Session } from "next-auth";
import EventActions from "@/components/shared/EventActions";
import { Calendar, MapPin, PlusCircle, Ban, Users } from "lucide-react";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "EVENT_OWNER") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 p-6 text-center">
        <div className="bg-white p-10 rounded-xl shadow-2xl max-w-md w-full">
          <Ban className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-red-700 mb-4">
            Access Denied!
          </h1>
          <p className="text-gray-700 text-lg">
            You do not have permission to view this page. Please ensure you are
            logged in as an Event Owner.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center bg-blue-600 text-white py-2 px-5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const events = await prisma.event.findMany({
    where: { ownerId: session.user.id },
    orderBy: { date: "asc" },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <div className="max-w-5xl w-full bg-white shadow-2xl rounded-2xl p-8 lg:p-10 my-8 animate-fadeIn">
        <div className="flex justify-between items-center mb-8 border-b pb-6">
          <h1 className="text-4xl font-extrabold text-gray-900">My Events</h1>
          <div className="flex gap-2">
            <Link
              href={`/dashboard/attendees`}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-lg font-medium transition-colors duration-200 shadow-md transform hover:scale-105 whitespace-nowrap bg-indigo-600 text-white hover:bg-indigo-700"
              aria-label={`View attendees `}
            >
              <Users className="w-5 h-5 mr-2" />
              View Attendees
            </Link>

            <Link
              href="/dashboard/new-event"
              className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition-colors shadow-md transform hover:scale-105"
              aria-label="Create new event"
            >
              <PlusCircle className="w-6 h-6 mr-2" /> New Event
            </Link>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12 text-gray-600 text-xl">
            <p className="mb-4">You haven&apos;t created any events yet.</p>
            <p className="mb-6">
              Click the &quot;New Event&quot; button above to get started!
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {" "}
            {events.map((event) => (
              <li
                key={event.id}
                className="bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-md flex flex-col justify-between transform hover:scale-[1.02] transition-transform duration-200"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {event.title}
                  </h2>
                  <p className="flex items-center text-gray-700 mb-1">
                    <MapPin className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="font-medium">{event.location}</span>
                  </p>
                  <p className="flex items-center text-gray-600 mb-3 text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                    {new Date(event.date).toLocaleString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-gray-800 leading-relaxed text-base line-clamp-2">
                    {" "}
                    {event.description || "No description available."}
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  {" "}
                  <EventActions eventId={event.id} eventName={event.title} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
