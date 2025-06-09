/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AttendeePage() {
  const { eventId } = useParams();
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    const fetchAttendees = async () => {
      const res = await fetch(`/api/attendees?eventId=${eventId}`);
      const data = await res.json();
      setAttendees(data);
    };
    fetchAttendees();
  }, [eventId]);

  const handleExport = () => {
    window.open(`/api/export-attendees?eventId=${eventId}`, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Attendees</h1>
        <button
          onClick={handleExport}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Export CSV
        </button>
      </div>

      {attendees.length === 0 ? (
        <p>No RSVPs yet.</p>
      ) : (
        <table className="w-full border mt-4 text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((a: any) => (
              <tr key={a.id}>
                <td className="p-2 border">{a.name}</td>
                <td className="p-2 border">{a.email}</td>
                <td className="p-2 border">
                  {new Date(a.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
