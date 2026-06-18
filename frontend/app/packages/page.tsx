"use client";

import { useEffect, useState } from "react";

export default function PackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/packages")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPackages(data);
        } else {
          setPackages([]);
          setError(JSON.stringify(data));
        }
      })
      .catch((err) => {
        setPackages([]);
        setError(String(err));
      });
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-6">Saved Application Packages</h1>

      {error && (
        <div className="border p-4 rounded bg-red-100 text-black mb-6">
          Backend Error: {error}
        </div>
      )}

      {packages.length === 0 ? (
        <p>No packages saved yet.</p>
      ) : (
        <div className="space-y-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="border p-6 rounded">
              <h2 className="text-2xl font-bold">
                {pkg.company} — {pkg.role}
              </h2>

              <details className="mt-4">
                <summary className="font-bold cursor-pointer">Job Analysis</summary>
                <pre className="whitespace-pre-wrap mt-2">{pkg.job_analysis}</pre>
              </details>

              <details className="mt-4">
                <summary className="font-bold cursor-pointer">Resume Tailor</summary>
                <pre className="whitespace-pre-wrap mt-2">{pkg.resume_tailor}</pre>
              </details>

              <details className="mt-4">
                <summary className="font-bold cursor-pointer">Cover Letter</summary>
                <pre className="whitespace-pre-wrap mt-2">{pkg.cover_letter}</pre>
              </details>

              <details className="mt-4">
                <summary className="font-bold cursor-pointer">Recruiter Message</summary>
                <pre className="whitespace-pre-wrap mt-2">{pkg.recruiter_message}</pre>
              </details>

              <details className="mt-4">
                <summary className="font-bold cursor-pointer">Application Answers</summary>
                <pre className="whitespace-pre-wrap mt-2">{pkg.application_answers}</pre>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}