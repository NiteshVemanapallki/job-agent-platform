"use client";

import { useEffect, useState } from "react";

export default function TrackerPage() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data));
  }, []);

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-6">Job Tracker</h1>

      {jobs.length === 0 ? (
        <p>No jobs saved yet.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-3">Company</th>
              <th className="border p-3">Role</th>
              <th className="border p-3">Score</th>
              <th className="border p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="border p-3">{job.company}</td>
                <td className="border p-3">{job.role}</td>
                <td className="border p-3">{job.match_score}%</td>
                <td className="border p-3">
                    <select
                        value={job.status}
                        onChange={async (e) => {
                            const newStatus = e.target.value;
                            await fetch(`http://127.0.0.1:8000/job-status/${job.id}`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ status: newStatus }),
                            });
                        }}
                    >
                        <option value="Saved">Saved</option>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}