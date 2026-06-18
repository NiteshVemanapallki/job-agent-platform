"use client";

import { useState } from "react";

export default function InterviewAgent() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);

  const generateInterviewPrep = async () => {
    const response = await fetch("http://127.0.0.1:8000/interview-agent", {
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
      <h1 className="text-4xl font-bold mb-6">Interview Agent</h1>

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
        onClick={generateInterviewPrep}
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        Generate Interview Prep
      </button>

      {result && (
        <div className="mt-8 space-y-6">
          <Section title="Technical Questions" items={result.technical_questions} />
          <Section title="System Design Questions" items={result.system_design_questions} />
          <Section title="Behavioral Questions" items={result.behavioral_questions} />
          <Section title="Project Questions" items={result.project_questions} />
          <Section title="Preparation Plan" items={result.preparation_plan} />
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