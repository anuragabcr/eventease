"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Calendar, MapPin, Info, Sparkles, PlusCircle } from "lucide-react";

export default function NewEventPage() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const createEventToastId = toast.loading("Creating your event...");

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, location, description, date }),
      });

      if (res.ok) {
        toast.success("Event created successfully!", {
          id: createEventToastId,
        });
        router.push("/dashboard");
        router.refresh();
      } else {
        const errorData = await res.json();
        toast.error(
          `Failed to create event: ${errorData.message || res.statusText}`,
          { id: createEventToastId }
        );
        console.error("API error during event creation:", errorData);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        "Network or unexpected error during event creation:",
        error
      );
      toast.error(
        `An unexpected error occurred: ${
          error?.message || "Please try again."
        }`,
        { id: createEventToastId }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl w-full bg-white shadow-2xl rounded-2xl p-8 lg:p-10 animate-fadeIn">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">
          Create New Event
        </h1>
        <p className="text-center text-lg text-gray-600 mb-8">
          Fill out the details below to schedule your exciting event!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-md font-semibold text-gray-700 mb-2"
            >
              <Sparkles className="inline-block w-5 h-5 mr-2 text-yellow-500" />{" "}
              Event Title
            </label>
            <input
              id="title"
              name="title"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 text-gray-900"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Annual Tech Conference"
              required
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-md font-semibold text-gray-700 mb-2"
            >
              <MapPin className="inline-block w-5 h-5 mr-2 text-purple-500" />{" "}
              Location
            </label>
            <input
              id="location"
              name="location"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 text-gray-900"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Grand Exhibition Hall"
              required
            />
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-md font-semibold text-gray-700 mb-2"
            >
              <Calendar className="inline-block w-5 h-5 mr-2 text-indigo-500" />{" "}
              Date & Time
            </label>
            <input
              id="date"
              name="date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="datetime-local"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-md font-semibold text-gray-700 mb-2"
            >
              <Info className="inline-block w-5 h-5 mr-2 text-green-500" />{" "}
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[120px] placeholder-gray-400 text-gray-900"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of your event..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105 inline-flex items-center justify-center"
          >
            <PlusCircle className="w-5 h-5 mr-2" /> Create Event
          </button>
        </form>
      </div>
    </div>
  );
}
