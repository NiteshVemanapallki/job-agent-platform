"use client";

import { useState } from "react";

export default function ResumeAgent() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);

  const analyzeResume = async () => {
    const response = await fetch("http://127.0.0.1:8000/resume-analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resume_text: resume,
        job_description: jobDescription,
      }),
    });

    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-6">Resume Agent</h1>

      <textarea
        className="border w-full h-48 p-4 mb-4 text-black"
        placeholder="Paste Resume Here"
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
        onClick={analyzeResume}
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        Analyze Resume
      </button>

      {result && (
        <div className="mt-8 border p-6 rounded">
          <h2 className="text-2xl font-bold">
            ATS Score: {result.ats_score}%
          </h2>

          <p className="mt-3">
            <strong>Summary:</strong> {result.summary}
          </p>

          <div className="mt-4">
            <strong>Matched Keywords</strong>
            <ul>
              {result.matched_keywords?.map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <strong>Missing Keywords</strong>
            <ul>
              {result.missing_keywords?.map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <strong>Suggested Resume Bullets</strong>
            <ul>
              {result.suggested_resume_bullets?.map(
                (item: string, index: number) => (
                  <li key={index}>• {item}</li>
                )
              )}
            </ul>
          </div>

          <div className="mt-4">
            <strong>Experience Improvements</strong>
            <ul>
              {result.experience_improvements?.map(
                (item: string, index: number) => (
                  <li key={index}>• {item}</li>
                )
              )}
            </ul>
          </div>

          <div className="mt-4">
            <strong>Interview Questions</strong>
            <ul>
              {result.interview_questions?.map(
                (item: string, index: number) => (
                  <li key={index}>• {item}</li>
                )
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}