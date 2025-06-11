"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

interface EventActionsProps {
  eventId: string;
  eventName: string;
}

export default function EventActions({
  eventId,
  eventName,
}: EventActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${eventName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    const deleteToastId = toast.loading(`Deleting event "${eventName}"...`);

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success(`Event "${eventName}" deleted successfully!`, {
          id: deleteToastId,
        });
        router.refresh();
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || "An unknown error occurred.";
        toast.error(`Failed to delete event: ${errorMessage}`, {
          id: deleteToastId,
        });
        console.error("API error during event deletion:", errorData);
      }
    } catch (error) {
      console.error(
        "Network or unexpected error during event deletion:",
        error
      );
      toast.error(
        "An unexpected error occurred during deletion. Please try again.",
        { id: deleteToastId }
      );
    }
  };

  return (
    <div className="mt-2 space-x-4">
      <Link
        href={`/dashboard/event-details/${eventId}`}
        className="text-blue-500 cursor-pointer px-3 py-1 border border-blue-500 rounded-md transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600 text-2xl "
        aria-label={`Edit event ${eventName}`}
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        className="text-red-500 cursor-pointer px-3 py-1 border border-red-500 rounded-md transition-colors duration-200 hover:bg-red-50 hover:text-red-600 text-xl"
        aria-label={`Delete event ${eventName}`}
      >
        Delete
      </button>
    </div>
  );
}
