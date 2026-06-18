import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b p-4 flex gap-6">
      <Link href="/" className="font-semibold">
        Analyzer
      </Link>

      <Link href="/dashboard" className="font-semibold">
        Dashboard
      </Link>

      <Link href="/tracker" className="font-semibold">
        Tracker
      </Link>

      <Link href="/resume-agent" className="font-semibold">
        Resume Agent
      </Link>

      <Link href="/recruiter-agent" className="font-semibold">
        Recruiter Agent
      </Link>

      <Link href="/job-search" className="font-semibold">
        Job Search
      </Link>

      <Link href="/cover-letter-agent" className="font-semibold">
        Cover Letter
      </Link>

      <Link href="/application-assistant" className="font-semibold">
      Application Assistant
      </Link>

      <Link href="/interview-agent" className="font-semibold">
      Interview Agent
      </Link>

      <Link href="/resume-tailor" className="font-semibold">
      Resume Tailor
      </Link>

      <Link href="/auto-resume" className="font-semibold">
      Auto Resume
      </Link>

      <Link href="/apply-pipeline" className="font-semibold">
      Apply Pipeline
      </Link>
      
      <Link href="/packages" className="font-semibold">
      Packages
      </Link>
    </nav>
  );
}