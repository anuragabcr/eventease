"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewEventPage() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/events", {
      method: "POST",
      body: JSON.stringify({ title, location, description, date }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      alert("Failed to create event");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event Title"
          required
        />
        <input
          className="w-full border p-2"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          required
        />
        <input
          className="w-full border p-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          type="datetime-local"
          required
        />
        <textarea
          className="w-full border p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">
          Create Event
        </button>
      </form>
    </div>
  );
}
