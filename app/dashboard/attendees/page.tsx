/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import {
  FileJson,
  FileSpreadsheet,
  ArrowUp,
  ArrowDown,
  ChevronDown,
} from "lucide-react";
import { AttendeeData } from "@/types/event";

export default function AttendeesTable() {
  const [data, setData] = useState<AttendeeData[]>([]);
  const [filtered, setFiltered] = useState<AttendeeData[]>([]);
  const [eventFilter, setEventFilter] = useState("");
  const [organizerFilter, setOrganizerFilter] = useState("");
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/attendees`);
        if (!res.ok) {
          throw new Error(`Failed to load attendees: ${res.statusText}`);
        }
        const result: AttendeeData[] = await res.json();
        setData(result);
        setFiltered(result);
      } catch (err: any) {
        toast.error(err.message || "Error fetching data");
        console.error("Error fetching attendees:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  const uniqueEvents = useMemo(
    () => ["", ...new Set(data.map((d) => d.event.title))],
    [data]
  );
  const uniqueOrganizers = useMemo(
    () => ["", ...new Set(data.map((d) => d.event.owner.name))],
    [data]
  );

  useEffect(() => {
    let temp = [...data];
    if (eventFilter) {
      temp = temp.filter((d) => d.event.title === eventFilter);
    }
    if (organizerFilter) {
      temp = temp.filter((d) => d.event.owner.name === organizerFilter);
    }

    if (sortKey) {
      const sorted = temp.sort((a: any, b: any) => {
        const valA = getNestedValue(a, sortKey);
        const valB = getNestedValue(b, sortKey);

        if (sortKey === "createdAt") {
          const dateA = new Date(valA).getTime();
          const dateB = new Date(valB).getTime();
          return sortDir === "asc" ? dateA - dateB : dateB - dateA;
        }
        if (typeof valA === "string" && typeof valB === "string") {
          return sortDir === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }
        if (valA < valB) return sortDir === "asc" ? -1 : 1;
        if (valA > valB) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
      setFiltered(sorted);
    } else {
      setFiltered(temp);
    }
  }, [eventFilter, organizerFilter, data, sortKey, sortDir]);
  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const handleSort = (key: string) => {
    const direction = sortKey === key && sortDir === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortDir(direction);
  };

  const exportToJSON = () => {
    if (filtered.length === 0) {
      toast.error("No data to export!");
      return;
    }
    const blob = new Blob([JSON.stringify(filtered, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendees.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Attendees exported to JSON!");
  };

  const exportToExcel = () => {
    if (filtered.length === 0) {
      toast.error("No data to export!");
      return;
    }
    const exportData = filtered.map((d, i) => ({
      "S/N": i + 1,
      "Attendee Name": d.name,
      "Attendee Email": d.email,
      "Event Title": d.event.title,
      "Event Organizer": d.event.owner.name,
      "RSVP Time": new Date(d.createdAt).toLocaleString(),
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendees");
    XLSX.writeFile(workbook, "attendees.xlsx");
    toast.success("Attendees exported to Excel!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
        <EmptyState description="No attendees recorded yet across all events." />
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
        <EmptyState description="No attendees found matching your current filters." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <div className="max-w-6xl w-full bg-white shadow-2xl rounded-2xl p-8 lg:p-10 my-8 animate-fadeIn">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 pb-4 border-b-2 border-indigo-200 inline-block px-4">
          All Attendees <span className="text-gray-600">({data.length})</span>
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 p-4 bg-gray-50 rounded-lg shadow-inner">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:w-auto">
              <select
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-900 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
              >
                <option value="">All Events</option>
                {uniqueEvents.map((event) => (
                  <option key={event} value={event}>
                    {event}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            <div className="relative w-full sm:w-auto">
              <select
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-900 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={organizerFilter}
                onChange={(e) => setOrganizerFilter(e.target.value)}
              >
                <option value="">All Organizers</option>
                {uniqueOrganizers.map((org) => (
                  <option key={org} value={org}>
                    {org}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4 sm:mt-0 w-full sm:w-auto justify-center sm:justify-end">
            <button
              onClick={exportToJSON}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md text-sm"
              aria-label="Export attendees to JSON"
            >
              <FileJson className="w-4 h-4 mr-2" /> JSON
            </button>
            <button
              onClick={exportToExcel}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md text-sm"
              aria-label="Export attendees to Excel"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-tl-lg"
                >
                  S/N
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => handleSort("event.title")}
                >
                  <div className="flex items-center">
                    Event
                    {sortKey === "event.title" &&
                      (sortDir === "asc" ? (
                        <ArrowUp className="w-3 h-3 ml-1" />
                      ) : (
                        <ArrowDown className="w-3 h-3 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Attendee Name
                    {sortKey === "name" &&
                      (sortDir === "asc" ? (
                        <ArrowUp className="w-3 h-3 ml-1" />
                      ) : (
                        <ArrowDown className="w-3 h-3 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center">
                    Email
                    {sortKey === "email" &&
                      (sortDir === "asc" ? (
                        <ArrowUp className="w-3 h-3 ml-1" />
                      ) : (
                        <ArrowDown className="w-3 h-3 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => handleSort("event.owner.name")}
                >
                  <div className="flex items-center">
                    Organizer
                    {sortKey === "event.owner.name" &&
                      (sortDir === "asc" ? (
                        <ArrowUp className="w-3 h-3 ml-1" />
                      ) : (
                        <ArrowDown className="w-3 h-3 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-tr-lg cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    RSVP Time
                    {sortKey === "createdAt" &&
                      (sortDir === "asc" ? (
                        <ArrowUp className="w-3 h-3 ml-1" />
                      ) : (
                        <ArrowDown className="w-3 h-3 ml-1" />
                      ))}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((r, i) => (
                <tr
                  key={r.id}
                  className="odd:bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {i + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {r.event.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {r.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <a
                      href={`mailto:${r.email}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-150"
                    >
                      {r.email}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {r.event.owner.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(r.createdAt).toLocaleString("en-US", {
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
      </div>
    </div>
  );
}
