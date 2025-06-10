"use client";

import React, { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  owner: Owner;
}

interface Owner {
  name: string;
  email: string;
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const now = new Date();

  const upcomingEvents = events.filter((event) => new Date(event.date) >= now);
  const pastEvents = events.filter((event) => new Date(event.date) < now);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        <LoadingSpinner />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <EmptyState />
      </div>
    );
  }

  const renderEventCard = (
    event: Event & { owner: { name: string } },
    isPast: boolean = false
  ) => (
    <div
      key={event.id}
      className="flex justify-between items-start p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
    >
      <div className="">
        {!isPast ? (
          <Link
            href={`/event/${event.id}`}
            className="block space-y-1 hover:underline"
          >
            <h2 className="text-lg font-semibold text-gray-800">
              {event.title}
            </h2>
            <p className="text-gray-600">
              {new Date(event.date).toLocaleString()}
            </p>
            <p className="text-gray-500">{event.location}</p>
          </Link>
        ) : (
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-gray-800">
              {event.title}
            </h2>
            <p className="text-gray-600">
              {new Date(event.date).toLocaleString()}
            </p>
            <p className="text-gray-500">{event.location}</p>
          </div>
        )}
      </div>

      <div className="ml-6">
        <h2 className="text-lg font-semibold text-gray-800">Organizer</h2>
        <p>{event.owner.name}</p>
      </div>

      <div className="ml-6">
        {isPast ? (
          <button
            disabled
            className="mt-4 px-4 py-2 rounded text-white font-medium bg-gray-400 cursor-not-allowed"
          >
            Expired
          </button>
        ) : (
          <div className="flex align-middle">
            <Link
              href={`/event/${event.id}`}
              className="mt-4 px-4 py-2 rounded text-white font-medium bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              RSVP
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="">
      {upcomingEvents.length > 0 && (
        <div className="bg-emerald-50 p-5 py-10">
          <h3 className="text-center text-2xl font-semibold text-gray-800 mb-4">
            Upcoming Events
          </h3>
          <div className="space-y-6">
            {upcomingEvents.map((event) => renderEventCard(event))}
          </div>
        </div>
      )}

      {pastEvents.length > 0 && (
        <div className="bg-zinc-50 p-5 py-10">
          <h3 className="text-center text-2xl font-semibold text-gray-800 mb-4">
            Past Events
          </h3>
          <div className="space-y-6">
            {pastEvents.map((event) => renderEventCard(event, true))}
          </div>
        </div>
      )}
    </div>
  );
}
