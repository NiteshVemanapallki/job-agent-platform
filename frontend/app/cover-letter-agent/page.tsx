"use client";

import { useState } from "react";

export default function CoverLetterAgent() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);

  const generateCoverLetter = async () => {
    const response = await fetch("http://127.0.0.1:8000/cover-letter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company,
        role,
        job_description: jobDescription,
      }),
    });

    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-6">Cover Letter Agent</h1>

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
        className="border w-full h-48 p-4 mb-4 text-black"
        placeholder="Paste Job Description Here"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <button
        onClick={generateCoverLetter}
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        Generate Cover Letter
      </button>

      {result && (
        <div className="mt-8 border p-6 rounded whitespace-pre-line">
          <h2 className="text-2xl font-bold mb-4">Generated Cover Letter</h2>
          <p>{result.cover_letter}</p>
        </div>
      )}
    </div>
  );
}
