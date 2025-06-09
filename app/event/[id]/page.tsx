/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function PublicEventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      const res = await fetch(`/api/event?id=${id}`);
      const data = await res.json();
      setEvent(data);
    }
    fetchEvent();
  }, [id]);

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/rsvp", {
      method: "POST",
      body: JSON.stringify({ name, email, eventId: id }),
    });

    if (res.ok) setSubmitted(true);
    else alert("Failed to RSVP");
  };

  if (!event) return <div>Loading event...</div>;
  if (submitted)
    return <div className="p-6 text-green-600">Thanks for your RSVP!</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">{event.title}</h1>
      <p className="text-gray-600">{new Date(event.date).toLocaleString()}</p>
      <p>{event.location}</p>
      <p className="text-gray-700">{event.description}</p>

      <form onSubmit={handleRSVP} className="mt-6 space-y-4 border-t pt-4">
        <h2 className="text-xl font-semibold">RSVP to this event</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Your Name"
          className="w-full border p-2"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Your Email"
          className="w-full border p-2"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">
          Submit RSVP
        </button>
      </form>
    </div>
  );
}
