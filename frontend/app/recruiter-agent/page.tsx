"use client";

import { useState } from "react";

export default function RecruiterAgent() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [recruiterName, setRecruiterName] = useState("");
  const [result, setResult] = useState<any>(null);

  const generateMessages = async () => {
    const response = await fetch("http://127.0.0.1:8000/recruiter-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company,
        role,
        recruiter_name: recruiterName,
      }),
    });

    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-6">Recruiter Agent</h1>

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

      <input
        className="border w-full p-3 mb-4 text-black"
        placeholder="Recruiter Name optional"
        value={recruiterName}
        onChange={(e) => setRecruiterName(e.target.value)}
      />

      <button
        onClick={generateMessages}
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        Generate Messages
      </button>

      {result && (
        <div className="mt-8 space-y-6">
          <div className="border p-6 rounded">
            <h2 className="text-xl font-bold mb-2">LinkedIn Connection</h2>
            <p>{result.linkedin_connection}</p>
          </div>

          <div className="border p-6 rounded">
            <h2 className="text-xl font-bold mb-2">Referral Request</h2>
            <p>{result.referral_request}</p>
          </div>

          <div className="border p-6 rounded">
            <h2 className="text-xl font-bold mb-2">Follow Up</h2>
            <p>{result.follow_up}</p>
          </div>

          <div className="border p-6 rounded">
            <h2 className="text-xl font-bold mb-2">Thank You</h2>
            <p>{result.thank_you}</p>
          </div>
        </div>
      )}
    </div>
  );
}