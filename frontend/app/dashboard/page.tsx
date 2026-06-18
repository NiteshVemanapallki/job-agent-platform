"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats) {
    return <div className="p-10">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-8">Job Agent Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="border rounded p-6">
          <h2 className="text-xl font-bold">Saved</h2>
          <p className="text-4xl mt-4">{stats.saved}</p>
        </div>

        <div className="border rounded p-6">
          <h2 className="text-xl font-bold">Applied</h2>
          <p className="text-4xl mt-4">{stats.applied}</p>
        </div>

        <div className="border rounded p-6">
          <h2 className="text-xl font-bold">Interviews</h2>
          <p className="text-4xl mt-4">{stats.interviews}</p>
        </div>

        <div className="border rounded p-6">
          <h2 className="text-xl font-bold">Offers</h2>
          <p className="text-4xl mt-4">{stats.offers}</p>
        </div>

        <div className="border rounded p-6">
          <h2 className="text-xl font-bold">Rejected</h2>
          <p className="text-4xl mt-4">{stats.rejected}</p>
        </div>
      </div>
    </div>
  );
}