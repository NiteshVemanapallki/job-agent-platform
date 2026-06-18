"use client";

import { useState } from "react";

export default function Home() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);

  const analyzeJob = async () => {
    const response = await fetch("http://127.0.0.1:8000/analyze-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        job_description: jobDescription,
      }),
    });

    const data = await response.json();
    setResult(data);
  };

  const saveJob = async () => {
    if (!result) {
      alert("Please analyze the job first.");
      return;
    }

    await fetch("http://127.0.0.1:8000/save-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company: company || "Manual Entry",
        role: role || "AI Engineer",
        job_description: jobDescription,
        match_score: result.match_score,
        resume_title: result.resume_title,
      }),
    });

    alert("Job saved successfully!");
  };

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-6">AI Job Agent</h1>

      <input
        className="border w-full p-3 mb-4 text-black"
        placeholder="Company Name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <input
        className="border w-full p-3 mb-4 text-black"
        placeholder="Role Title"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <textarea
        className="border w-full p-4 h-48 text-black"
        placeholder="Paste Job Description Here"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <div className="flex gap-4 mt-4">
        <button
          onClick={analyzeJob}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Analyze Job
        </button>

        <button
          onClick={saveJob}
          className="bg-green-600 text-white px-6 py-3 rounded"
        >
          Save Job
        </button>
      </div>

      {result && (
        <div className="mt-8 border p-6 rounded">
          <h2 className="text-2xl font-bold">
            Match Score: {result.match_score}%
          </h2>

          <p className="mt-3">
            <strong>Summary:</strong> {result.job_summary}
          </p>

          <p className="mt-3">
            <strong>Why Apply:</strong> {result.why_apply}
          </p>

          <p className="mt-3">
            <strong>Resume Title:</strong> {result.resume_title}
          </p>

          <div className="mt-3">
            <strong>Keywords:</strong>
            <ul>
              {result.keywords.map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}