"use client";

import React, { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [rsvpStatus, setRsvpStatus] = useState<Record<string, boolean>>({});

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

  const handleRSVP = async (eventId: string) => {
    // Mock RSVP API call
    try {
      await fetch(`/api/events/${eventId}/rsvp`, { method: "POST" });
      setRsvpStatus((prev) => ({ ...prev, [eventId]: true }));
    } catch (err) {
      console.error("RSVP failed:", err);
    }
  };

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

  return (
    <div className="space-y-6">
      {events.map((event) => (
        <div
          key={event.id}
          className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold text-gray-800">{event.title}</h2>
          <p className="text-gray-600">
            {new Date(event.date).toLocaleString()}
          </p>
          <p className="text-gray-500">{event.location}</p>

          <button
            onClick={() => handleRSVP(event.id)}
            disabled={rsvpStatus[event.id]}
            className={`mt-4 px-4 py-2 rounded text-white font-medium ${
              rsvpStatus[event.id]
                ? "bg-green-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {rsvpStatus[event.id] ? "RSVPed" : "RSVP"}
          </button>
        </div>
      ))}
    </div>
  );
}
