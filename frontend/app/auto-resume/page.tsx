"use client";

import { useState } from "react";

export default function AutoResume() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [masterResume, setMasterResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);

  const generateResume = async () => {
    const response = await fetch("http://127.0.0.1:8000/auto-resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company,
        role,
        master_resume: masterResume,
        job_description: jobDescription,
      }),
    });

    const data = await response.json();
    setResult(data);
  };

  const downloadTxt = () => {
    const blob = new Blob([result.resume_text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-6">Auto Resume Generator</h1>

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
        placeholder="Paste Master Resume Here"
        value={masterResume}
        onChange={(e) => setMasterResume(e.target.value)}
      />

      <textarea
        className="border w-full h-48 p-4 mb-4 text-black"
        placeholder="Paste Job Description Here"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <button
        onClick={generateResume}
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        Generate Resume
      </button>

      {result && (
        <div className="mt-8 border p-6 rounded">
          <h2 className="text-2xl font-bold mb-4">Generated Resume</h2>

          <button
            onClick={downloadTxt}
            className="bg-green-600 text-white px-4 py-2 rounded mb-4"
          >
            Download TXT
          </button>

          <pre className="whitespace-pre-wrap">{result.resume_text}</pre>
        </div>
      )}
    </div>
  );
}
