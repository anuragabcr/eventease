/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { EventData, RSVP } from "@/types/event"; // Ensure these types are correctly defined
import LoadingSpinner from "@/components/shared/LoadingSpinner"; // Assuming this component exists
import {
  Pencil,
  Save,
  XCircle,
  Calendar,
  MapPin,
  BookOpen,
  Ban,
  User,
  Mail,
  Clock,
  ExternalLink, // Added for external link icon if needed
} from "lucide-react";

export default function EventDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventData | null>(null);
  const [rsvps, setRsvps] = useState<RSVP[]>([]); // State to hold RSVP list
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(true); // Track initial loading state for both event and RSVPs
  const [accessDenied, setAccessDenied] = useState(false); // Track access denied state

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      setIsLoading(true);
      try {
        // Fetch Event Details
        const eventRes = await fetch(`/api/events/${id}`);
        if (eventRes.status === 403) {
          setAccessDenied(true);
          toast.error(
            "Access denied. You do not have permission to view/edit this event."
          );
          setIsLoading(false);
          return;
        }
        if (!eventRes.ok) {
          throw new Error(`Failed to load event: ${eventRes.statusText}`);
        }
        const eventData: EventData = await eventRes.json();
        setEvent(eventData);
        setForm({
          title: eventData.title,
          date: new Date(eventData.date).toISOString().slice(0, 16),
          location: eventData.location,
          description: eventData.description || "",
        });

        // Fetch RSVPs
        const rsvpsRes = await fetch(`/api/attendees/${id}`); // Assuming this is your API for RSVPs for a given event ID
        if (!rsvpsRes.ok) {
          throw new Error(`Failed to fetch RSVP list: ${rsvpsRes.statusText}`);
        }
        const rsvpsData: RSVP[] = await rsvpsRes.json();
        setRsvps(rsvpsData);
      } catch (error: any) {
        toast.error(
          `Error loading data: ${error.message || "An unknown error occurred"}`
        );
        console.error("Failed to fetch event or RSVPs:", error);
        setEvent(null); // Clear event on error
        setRsvps([]); // Clear RSVPs on error
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    const saveToastId = toast.loading("Saving changes...");
    try {
      // Using PUT method as per previous API route definition for update
      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Event updated successfully!", { id: saveToastId });
        setEditMode(false);
        const updatedEventData = await res.json();
        setEvent(updatedEventData); // Update the local event state with new data
        // No need for router.refresh() here if you're updating state directly
      } else {
        const errorData = await res.json();
        toast.error(`Update failed: ${errorData.message || res.statusText}`, {
          id: saveToastId,
        });
        console.error("API error during event update:", errorData);
      }
    } catch (error: any) {
      toast.error(
        `Something went wrong: ${error.message || "Please try again."}`,
        { id: saveToastId }
      );
      console.error("Network or unexpected error during update:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    // Reset form to original event data if available
    if (event) {
      setForm({
        title: event.title,
        date: new Date(event.date).toISOString().slice(0, 16),
        location: event.location,
        description: event.description || "",
      });
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  // Render access denied state
  if (accessDenied) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 p-6 text-center">
        <div className="bg-white p-10 rounded-xl shadow-2xl max-w-md w-full">
          <Ban className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-red-700 mb-4">
            Access Denied!
          </h1>
          <p className="text-gray-700 text-lg">
            You do not have permission to view or edit this event. Please ensure
            you are logged in as the event owner.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 bg-blue-600 text-white py-2 px-5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Render if event is null after loading (e.g., 404 from API)
  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
        <div className="bg-white p-10 rounded-xl shadow-2xl max-w-md w-full">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Event Not Found
          </h1>
          <p className="text-gray-700 text-lg">
            The event you are looking for could not be found.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 bg-blue-600 text-white py-2 px-5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 items-center p-4 sm:p-6 lg:p-8">
      {/* Event Details Section */}
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-2xl p-8 lg:p-10 space-y-8 animate-fadeIn mb-8">
        <div className="flex justify-between items-center border-b pb-6 mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Event Details
          </h1>
          <div className="flex space-x-3">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
                aria-label="Edit event"
              >
                <Pencil className="w-5 h-5 mr-2" /> Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
                  aria-label="Save changes"
                >
                  <Save className="w-5 h-5 mr-2" /> Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition-colors shadow-md"
                  aria-label="Cancel edit"
                >
                  <XCircle className="w-5 h-5 mr-2" /> Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Title Field */}
          <div>
            <label className="block text-md font-semibold text-gray-700 mb-2">
              Title
            </label>
            {editMode ? (
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                aria-label="Event Title Input"
              />
            ) : (
              <p className="text-xl text-gray-900 font-medium">{event.title}</p>
            )}
          </div>

          {/* Date Field */}
          <div>
            <label className="block text-md font-semibold text-gray-700 mb-2">
              Date
            </label>
            {editMode ? (
              <input
                name="date"
                type="datetime-local"
                value={form.date}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                aria-label="Event Date and Time Input"
              />
            ) : (
              <p className="flex items-center text-xl text-gray-900">
                <Calendar className="w-6 h-6 mr-3 text-indigo-600" />
                {new Date(event.date).toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>

          {/* Location Field */}
          <div>
            <label className="block text-md font-semibold text-gray-700 mb-2">
              Location
            </label>
            {editMode ? (
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                aria-label="Event Location Input"
              />
            ) : (
              <p className="flex items-center text-xl text-gray-900">
                <MapPin className="w-6 h-6 mr-3 text-purple-600" />
                {event.location}
              </p>
            )}
            {/* Link to public event page (optional, for sharing) */}
            <div className="mt-4">
              <span className="block text-md font-semibold text-gray-700 mb-2">
                Public Event Link:
              </span>
              <a
                href={`/events/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:underline text-lg"
              >
                {`${window.location.origin}/events/${id}`}
                <ExternalLink className="w-5 h-5 ml-2" />
              </a>
              <p className="text-sm text-gray-500 mt-1">
                Share this link for public RSVPs.
              </p>
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-md font-semibold text-gray-700 mb-2">
              Description
            </label>
            {editMode ? (
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[120px]"
                aria-label="Event Description Input"
              />
            ) : (
              <p className="flex items-start text-xl text-gray-900 leading-relaxed">
                <BookOpen className="w-6 h-6 mr-3 text-green-600 mt-1" />
                {event.description || "No description provided."}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* RSVP List Section */}
      <div className="max-w-4xl w-full p-6 rounded-2xl shadow-xl bg-white border border-gray-100 animate-fadeInUp">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
          RSVP List <span className="ml-3 text-blue-600">({rsvps.length})</span>
        </h2>

        {rsvps.length === 0 ? (
          <div className="text-center py-8 text-gray-600 text-lg">
            <p>No RSVPs have been received for this event yet.</p>
            <p className="mt-2">
              Share your event link to start getting sign-ups!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-tl-lg"
                  >
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-blue-500" /> Name
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-indigo-500" /> Email
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-tr-lg"
                  >
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-purple-500" /> RSVP
                      Time
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rsvps.map((rsvp) => (
                  <tr
                    key={rsvp.id}
                    className="odd:bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {rsvp.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a
                        href={`mailto:${rsvp.email}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-150"
                      >
                        {rsvp.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(rsvp.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
