"use client";

import { useState } from "react";

export default function ApplyPipeline() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [outputTitle, setOutputTitle] = useState("");
  const [output, setOutput] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const callApi = async (endpoint: string, body: any, title: string) => {
    const response = await fetch(`http://127.0.0.1:8000/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    setOutputTitle(title);
    setOutput(data);
  };

  const generateFullPackage = async () => {
    setLoading(true);

    try {
      const analyzeRes = await fetch("http://127.0.0.1:8000/analyze-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_description: jobDescription }),
      });

      const resumeRes = await fetch("http://127.0.0.1:8000/resume-tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          role,
          resume_text: "Master resume placeholder",
          job_description: jobDescription,
        }),
      });

      const coverRes = await fetch("http://127.0.0.1:8000/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          role,
          job_description: jobDescription,
        }),
      });

      const recruiterRes = await fetch("http://127.0.0.1:8000/recruiter-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          role,
          recruiter_name: "",
        }),
      });

      const appRes = await fetch("http://127.0.0.1:8000/application-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          role,
          job_description: jobDescription,
        }),
      });

      const fullPackage = {
        job_analysis: await analyzeRes.json(),
        resume_tailor: await resumeRes.json(),
        cover_letter: await coverRes.json(),
        recruiter_message: await recruiterRes.json(),
        application_answers: await appRes.json(),
      };

      setOutputTitle("Full Application Package");
      setOutput(fullPackage);
    } catch (error) {
      setOutputTitle("Error");
      setOutput({
        message: "Something went wrong while generating the package.",
      });
    }

    setLoading(false);
  };

const savePackage = async () => {
  if (!output || outputTitle !== "Full Application Package") {
    alert("Please generate the full application package first.");
    return;
  }

  await fetch("http://127.0.0.1:8000/save-package", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      company,
      role,
      job_analysis: JSON.stringify(output.job_analysis),
      resume_tailor: JSON.stringify(output.resume_tailor),
      cover_letter: JSON.stringify(output.cover_letter),
      recruiter_message: JSON.stringify(output.recruiter_message),
      application_answers: JSON.stringify(output.application_answers),
    }),
  });

  alert("Full application package saved!");
};

  const renderValue = (value: any) => {
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc ml-6 mt-2">
          {value.map((item: any, index: number) => (
            <li key={index}>{String(item)}</li>
          ))}
        </ul>
      );
    }

    if (typeof value === "object" && value !== null) {
      return (
        <div className="space-y-4 mt-3">
          {Object.entries(value).map(([childKey, childValue]) => (
            <div key={childKey} className="border p-4 rounded">
              <h4 className="font-semibold capitalize">
                {childKey.replaceAll("_", " ")}
              </h4>
              {renderValue(childValue)}
            </div>
          ))}
        </div>
      );
    }

    return <p className="mt-2 whitespace-pre-wrap">{String(value)}</p>;
  };

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-6">Apply Pipeline</h1>

      <input
        className="border w-full p-3 mb-4 text-black"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <input
        className="border w-full p-3 mb-4 text-black"
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <textarea
        className="border w-full h-64 p-4 mb-4 text-black"
        placeholder="Paste Job Description"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <div className="flex gap-4 flex-wrap">
        <button
          onClick={() =>
            callApi("analyze-job", { job_description: jobDescription }, "Job Analysis")
          }
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Analyze Job
        </button>

        <button
          onClick={() =>
            callApi(
              "resume-tailor",
              {
                company,
                role,
                resume_text: "Master resume placeholder",
                job_description: jobDescription,
              },
              "Resume Tailor"
            )
          }
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Resume Tailor
        </button>

        <button
          onClick={() =>
            callApi(
              "cover-letter",
              { company, role, job_description: jobDescription },
              "Cover Letter"
            )
          }
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Cover Letter
        </button>

        <button
          onClick={() =>
            callApi(
              "recruiter-message",
              { company, role, recruiter_name: "" },
              "Recruiter Message"
            )
          }
          className="bg-orange-600 text-white px-4 py-2 rounded"
        >
          Recruiter Message
        </button>

        <button
          onClick={() =>
            callApi(
              "application-assistant",
              { company, role, job_description: jobDescription },
              "Application Answers"
            )
          }
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Application Answers
        </button>

        <button
          onClick={generateFullPackage}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading ? "Generating..." : "Generate Full Application Package"}
        </button>

        <button
          onClick={savePackage}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Save Package to Tracker
        </button>
      </div>

      <div className="mt-10 border rounded p-6">
        <h2 className="text-2xl font-bold mb-4">
          {outputTitle || "Results Area"}
        </h2>

        {!output && (
          <p className="text-gray-500">Pipeline outputs will appear here.</p>
        )}

        {output && (
          <div className="space-y-4">
            {Object.entries(output).map(([key, value]) => (
              <div key={key} className="border p-4 rounded">
                <h3 className="font-bold text-lg capitalize">
                  {key.replaceAll("_", " ")}
                </h3>
                {renderValue(value)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}