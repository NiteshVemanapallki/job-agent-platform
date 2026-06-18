"use client";

import { useState } from "react";

export default function ApplicationAssistant() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);

  const generateAnswers = async () => {
    const response = await fetch("http://127.0.0.1:8000/application-assistant", {
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
      <h1 className="text-4xl font-bold mb-6">AI Job Application Assistant</h1>

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
        onClick={generateAnswers}
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        Generate Application Answers
      </button>

     <button
        onClick={() => navigator.clipboard.writeText(result.why_interested)}
        className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
      >
        Copy
     </button>

      {result && (
        <div className="mt-8 space-y-6">
          <div className="border p-6 rounded">
            <h2 className="text-xl font-bold mb-2">Why are you interested in this role?</h2>
            <p>{result.why_interested}</p>
          </div>

          <div className="border p-6 rounded">
            <h2 className="text-xl font-bold mb-2">Tell us about yourself</h2>
            <p>{result.tell_us_about_yourself}</p>
          </div>

          <div className="border p-6 rounded">
            <h2 className="text-xl font-bold mb-2">Why should we hire you?</h2>
            <p>{result.why_should_we_hire_you}</p>
          </div>

          <div className="border p-6 rounded">
            <h2 className="text-xl font-bold mb-2">Salary Expectation</h2>
            <p>{result.salary_expectation}</p>
          </div>

          <div className="border p-6 rounded">
            <h2 className="text-xl font-bold mb-2">Work Authorization</h2>
            <p>{result.work_authorization}</p>
          </div>

          <div className="border p-6 rounded">
            <h2 className="text-xl font-bold mb-2">Short Pitch</h2>
            <p>{result.short_pitch}</p>
          </div>
        </div>
      )}
    </div>
  );
}