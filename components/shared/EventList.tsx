"use client";

import React, { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import Link from "next/link";
import { Event } from "@/types/event";
import { Calendar, MapPin, User, Clock, CheckCircle } from "lucide-react";

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) {
          throw new Error(`Failed to fetch events: ${res.statusText}`);
        }
        const data: Event[] = await res.json();
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

  const actionButtonClass =
    "px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-md transform hover:scale-105 inline-flex items-center justify-center";

  const renderEventCard = (event: Event, isPast: boolean = false) => (
    <div
      key={event.id}
      className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col ${
        isPast ? "opacity-80" : ""
      }`}
    >
      <div className="p-6 flex-grow">
        {!isPast ? (
          <Link
            href={`/event/${event.id}`}
            className="block hover:text-blue-700 transition-colors"
          >
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2 leading-tight">
              {event.title}
            </h2>
          </Link>
        ) : (
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2 leading-tight">
            {event.title}
          </h2>
        )}

        <p className="flex items-center text-gray-700 mb-1">
          <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
          <span className="font-medium">
            {new Date(event.date).toLocaleString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </p>
        <p className="flex items-center text-gray-700 mb-3">
          <MapPin className="w-4 h-4 mr-2 text-purple-600" />
          <span className="font-medium">{event.location}</span>
        </p>

        <p className="text-gray-600 text-base leading-relaxed line-clamp-3 mb-4">
          {" "}
          {event.description || "No description provided for this event."}
        </p>

        {event.owner && (
          <p className="flex items-center text-gray-800 text-sm font-medium border-t pt-3 mt-3 border-gray-100">
            <User className="w-4 h-4 mr-2 text-blue-500" />
            Organizer: {event.owner.name}
          </p>
        )}
      </div>

      <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-center">
        {" "}
        {isPast ? (
          <button
            disabled
            className={`${actionButtonClass} bg-gray-400 text-white cursor-not-allowed`}
          >
            <Clock className="w-4 h-4 mr-2" /> Expired
          </button>
        ) : (
          <Link
            href={`/event/${event.id}`}
            className={`${actionButtonClass} bg-blue-600 text-white hover:bg-blue-700`}
          >
            <CheckCircle className="w-4 h-4 mr-2" /> RSVP
          </Link>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      {upcomingEvents.length > 0 && (
        <div className="max-w-6xl mx-auto mb-12 animate-fadeIn">
          <h3 className="text-center text-4xl font-extrabold text-gray-900 mb-8 pb-4 border-b-2 border-indigo-200 inline-block px-4">
            Upcoming Events
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {" "}
            {upcomingEvents.map((event) => renderEventCard(event))}
          </div>
        </div>
      )}

      {pastEvents.length > 0 && (
        <div className="max-w-6xl mx-auto animate-fadeIn">
          <h3 className="text-center text-4xl font-extrabold text-gray-900 mb-8 pb-4 border-b-2 border-zinc-200 inline-block px-4">
            Past Events
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {" "}
            {pastEvents.map((event) => renderEventCard(event, true))}
          </div>
        </div>
      )}
    </div>
  );
}
