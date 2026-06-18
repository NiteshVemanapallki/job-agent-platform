"use client";

import { useState } from "react";

export default function ResumeTailor() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);

  const tailorResume = async () => {
    const response = await fetch("http://127.0.0.1:8000/resume-tailor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company,
        role,
        resume_text: resume,
        job_description: jobDescription,
      }),
    });

    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-6">Resume Tailor Agent</h1>

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
        value={resume}
        onChange={(e) => setResume(e.target.value)}
      />

      <textarea
        className="border w-full h-48 p-4 mb-4 text-black"
        placeholder="Paste Job Description Here"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <button
        onClick={tailorResume}
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        Tailor Resume
      </button>

      {result && (
        <div className="mt-8 space-y-6">
          <div className="border p-6 rounded">
            <h2 className="text-xl font-bold mb-2">Target Resume Title</h2>
            <p>{result.target_title}</p>
          </div>

          <Section title="Missing Keywords" items={result.missing_keywords} />
          <Section title="Skills To Emphasize" items={result.skills_to_emphasize} />
          <Section title="Projects To Highlight" items={result.projects_to_highlight} />
          <Section title="Tailored Resume Bullets" items={result.tailored_bullets} />
          <Section title="Resume Improvement Plan" items={result.resume_improvement_plan} />
        </div>
      )}
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border p-6 rounded">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <ul>
        {items?.map((item: string, index: number) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}