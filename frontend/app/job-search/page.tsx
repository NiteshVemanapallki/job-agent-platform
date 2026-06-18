"use client";

import { useState } from "react";

export default function JobSearchPage() {
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [keywords, setKeywords] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);

  const searchJobs = async () => {
    const response = await fetch("http://127.0.0.1:8000/search-jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role, location, keywords }),
    });

    const data = await response.json();
    setJobs(data.jobs);
  };

  const saveJob = async (job: any) => {
    await fetch("http://127.0.0.1:8000/save-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company: job.company,
        role: job.role,
        job_description: job.description,
        match_score: job.match_score,
        resume_title: `${job.role} Resume`,
      }),
    });

    alert("Job Saved!");
  };

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-6">Job Discovery Agent</h1>

      <input
        className="border w-full p-3 mb-4 text-black"
        placeholder="Role: AI Engineer"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <input
        className="border w-full p-3 mb-4 text-black"
        placeholder="Location: Remote / Seattle / Austin"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        className="border w-full p-3 mb-4 text-black"
        placeholder="Keywords: LLM RAG FastAPI AWS"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
      />

      <button
        onClick={searchJobs}
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        Search Jobs
      </button>

      <div className="mt-8 space-y-6">
        {jobs.map((job, index) => (
          <div key={index} className="border p-6 rounded">
            <h2 className="text-2xl font-bold">{job.role}</h2>

            <p className="mt-2">
              {job.company} — {job.location}
            </p>

            <p className="mt-2">Match Score: {job.match_score}%</p>

            <p className="mt-2">{job.description}</p>
            <p className="mt-2">
                <strong>Why Apply:</strong> {job.why_apply}
            </p>
            <p className="mt-2">
              <strong>Source:</strong> {job.source}
            </p>

            <div className="mt-4 flex gap-4">
              <a
                href={job.apply_link}
                target="_blank"
                className="text-blue-500 underline inline-block"
              >
                Apply Link
              </a>

              <button
                onClick={() => saveJob(job)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save Job
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}