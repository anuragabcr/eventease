/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Calendar, MapPin, CheckCircle } from "lucide-react";
import Link from "next/link";
import { EventData } from "@/types/event";

export default function PublicEventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventData | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      if (!id) return;

      setIsLoading(true);
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch event: ${res.statusText}`);
        }
        const data: EventData = await res.json();
        setEvent(data);
      } catch (error: any) {
        toast.error(
          `Error loading event: ${error.message || "An unknown error occurred"}`
        );
        console.error("Failed to fetch event:", error);
        setEvent(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();

    const rsvpToastId = toast.loading("Submitting your RSVP...");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, eventId: id }),
      });

      if (res.ok) {
        toast.success("Thanks for your RSVP! See you there!", {
          id: rsvpToastId,
        });
        setSubmitted(true);
      } else {
        const errorData = await res.json();
        toast.error(`Failed to RSVP: ${errorData.message || res.statusText}`, {
          id: rsvpToastId,
        });
        console.error("RSVP API error:", errorData);
      }
    } catch (error: any) {
      console.error("Network or unexpected error during RSVP:", error);
      toast.error(
        `An unexpected error occurred: ${error.message || "Please try again."}`,
        { id: rsvpToastId }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6 text-center">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Event Not Found
          </h1>
          <p className="text-gray-700">
            The event you are looking for does not exist or an error occurred.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-6">
        <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-md w-full animate-fadeIn">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6 animate-bounceOnce" />{" "}
          <h1 className="text-4xl font-extrabold text-green-700 mb-4">
            RSVP Confirmed!
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Thank you for your RSVP to{" "}
            <span className="font-semibold">{event.title}</span>! We look
            forward to seeing you there.
          </p>
          <p className="my-6 text-gray-500 text-sm">
            You will receive a confirmation email shortly.
          </p>
          <Link
            href="/"
            className=" bg-red-400 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-red-700 transition-all "
          >
            Back to Event Listing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col lg:flex-row transition-all duration-300 ease-in-out">
        <div className="lg:w-2/3 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div className="px-5">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4 animate-slideInDown">
              {event.title}
            </h1>
            <div className="space-y-3 mb-6">
              <p className="flex items-center text-lg text-gray-700 font-medium">
                <Calendar className="w-5 h-5 mr-3 text-indigo-500" />{" "}
                {new Date(event.date).toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="flex items-center text-lg text-gray-700 font-medium">
                <MapPin className="w-5 h-5 mr-3 text-purple-500" />{" "}
                {event.location}
              </p>
            </div>
            <p className="text-gray-800 leading-relaxed text-lg sm:text-xl mb-6">
              {event.description}
            </p>
          </div>
        </div>

        <div className="lg:w-1/3 bg-blue-400 p-6 sm:p-8 lg:p-10 text-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-center lg:text-left">
            RSVP Now!
          </h2>
          <form onSubmit={handleRSVP} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold mb-2"
              >
                Your Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g., Jane Doe"
                className="w-full p-3 bg-blue-300 border border-blue-500 rounded-lg text-black placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-2"
              >
                Your Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="e.g., jane@example.com"
                className="w-full p-3 bg-blue-300 border border-blue-500 rounded-lg text-black placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white text-blue-600 py-3 rounded-lg font-bold text-lg hover:bg-blue-100 hover:text-blue-700 transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105 cursor-pointer"
            >
              Submit RSVP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
