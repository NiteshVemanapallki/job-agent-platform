from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import engine, SessionLocal
from models import Base, Job, ApplicationPackage


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

YOUR_SKILLS = [
    "python", "fastapi", "machine learning", "ml", "ai", "llm", "rag",
    "langchain", "langgraph", "aws", "docker", "kubernetes",
    "sql", "mongodb", "react", "spring boot", "java", "rest api",
    "nlp", "hugging face", "vector database", "faiss"
]

class JobRequest(BaseModel):
    job_description: str

class SaveJobRequest(BaseModel):
    company: str
    role: str
    job_description: str
    match_score: int
    resume_title: str

class ResumeRequest(BaseModel):
    resume_text: str
    job_description: str

class StatusUpdateRequest(BaseModel):
    status: str

class RecruiterMessageRequest(BaseModel):
    company: str
    role: str
    recruiter_name: str = ""

class CoverLetterRequest(BaseModel):
    company: str
    role: str
    job_description: str

class JobSearchRequest(BaseModel):
    role: str
    location: str
    keywords: str = ""

class ApplicationAssistantRequest(BaseModel):
    company: str
    role: str
    job_description: str

class InterviewAgentRequest(BaseModel):
    company: str
    role: str
    job_description: str

class ResumeTailorRequest(BaseModel):
    resume_text: str
    job_description: str
    role: str
    company: str

class AutoResumeRequest(BaseModel):
    company: str
    role: str
    master_resume: str
    job_description: str

class SavePackageRequest(BaseModel):
    company: str
    role: str

    job_analysis: str
    resume_tailor: str
    cover_letter: str
    recruiter_message: str
    application_answers: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {"message": "Job Agent Backend is running"}

@app.post("/analyze-job")
def analyze_job(data: JobRequest):
    jd = data.job_description.lower()

    matched = [skill for skill in YOUR_SKILLS if skill in jd]
    missing = [skill for skill in YOUR_SKILLS if skill not in jd]

    score = min(95, int((len(matched) / len(YOUR_SKILLS)) * 100) + 25)

    return {
        "match_score": score,
        "job_summary": "This job description was analyzed using your local skill-matching logic.",
        "why_apply": "You should apply if the role matches your AI/ML, backend, LLM, cloud, and production engineering skills.",
        "keywords": matched,
        "resume_title": "AI/ML Engineer | Python, LLMs, RAG, FastAPI, AWS",
        "missing_skills": missing[:8],
        "interview_questions": [
            "Explain your experience with Python and FastAPI.",
            "How have you used LLMs or RAG in a project?",
            "How do you deploy ML applications?",
            "How do you improve model performance in production?"
        ],
        "application_answer": "I am interested in this role because it matches my experience in AI/ML engineering, backend APIs, LLM applications, and scalable production systems."
    }

@app.post("/save-job")
def save_job(data: SaveJobRequest, db: Session = Depends(get_db)):
    new_job = Job(
        company=data.company,
        role=data.role,
        job_description=data.job_description,
        match_score=data.match_score,
        resume_title=data.resume_title,
        status="Saved"
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return {
        "message": "Job saved successfully",
        "job_id": new_job.id
    }

@app.get("/jobs")
def get_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).order_by(Job.created_at.desc()).all()

    return jobs
@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    jobs = db.query(Job).all()

    return {
        "saved": len(jobs),
        "applied": len([job for job in jobs if job.status == "Applied"]),
        "interviews": len([job for job in jobs if job.status == "Interview"]),
        "offers": len([job for job in jobs if job.status == "Offer"]),
        "rejected": len([job for job in jobs if job.status == "Rejected"])
    }
@app.post("/resume-analysis")
def resume_analysis(data: ResumeRequest):

    resume = data.resume_text.lower()
    jd = data.job_description.lower()

    keywords = [
        "python", "fastapi", "machine learning", "llm", "rag",
        "langchain", "aws", "docker", "kubernetes", "sql",
        "mongodb", "nlp", "hugging face", "react", "java"
    ]

    matched_keywords = []
    missing_keywords = []

    for keyword in keywords:
        if keyword in jd and keyword in resume:
            matched_keywords.append(keyword)
        if keyword in jd and keyword not in resume:
            missing_keywords.append(keyword)

    ats_score = max(50, 100 - len(missing_keywords) * 5)

    return {
        "ats_score": ats_score,
        "summary": "Resume analyzed successfully against the job description.",
        "matched_keywords": matched_keywords,
        "missing_keywords": missing_keywords,
        "recommended_skills": missing_keywords,
        "suggested_resume_bullets": [
            "Built and deployed AI-powered backend services using Python, FastAPI, and REST APIs to support production-ready machine learning workflows.",
            "Developed LLM and RAG-based applications using LangChain, vector search, and prompt engineering to improve response accuracy.",
            "Implemented scalable deployment workflows using AWS, Docker, and Kubernetes to improve reliability and production performance."
        ],
        "experience_improvements": [
            "Add measurable impact such as latency reduction, accuracy improvement, or user growth.",
            "Include tools and frameworks directly mentioned in the job description.",
            "Highlight production deployments, API development, cloud usage, and AI system ownership."
        ],
        "interview_questions": [
            "Explain your most relevant AI/ML project.",
            "How have you used Python and FastAPI in production?",
            "How would you design a RAG-based application?",
            "How do you deploy and monitor ML systems?"
        ]
    }
@app.put("/job-status/{job_id}")
def update_job_status(
    job_id: int,
    data: StatusUpdateRequest,
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        return {"error": "Job not found"}

    job.status = data.status

    db.commit()

    return {
        "message": "Status updated successfully",
        "status": job.status
    }
@app.post("/recruiter-message")
def recruiter_message(data: RecruiterMessageRequest):
    name = data.recruiter_name if data.recruiter_name else "there"

    return {
        "linkedin_connection": f"Hi {name}, I came across the {data.role} role at {data.company}. My background is in AI/ML engineering, Python, FastAPI, LLMs, RAG, and production backend systems. I’d be happy to connect and learn more about the opportunity.",
        
        "referral_request": f"Hi {name}, I’m very interested in the {data.role} role at {data.company}. My experience aligns with AI/ML engineering, backend APIs, LLM applications, and scalable production systems. If possible, I’d really appreciate your guidance or referral for this role.",
        
        "follow_up": f"Hi {name}, I wanted to follow up on the {data.role} role at {data.company}. I’m excited about the opportunity and believe my AI/ML and backend engineering experience would be a strong fit.",
        
        "thank_you": f"Hi {name}, thank you for taking the time to connect with me regarding the {data.role} role at {data.company}. I truly appreciate your time and support."
    }
@app.post("/search-jobs")
def search_jobs(data: JobSearchRequest):
    role = data.role.lower().strip()
    location = data.location.lower().strip()
    keywords = data.keywords.lower().strip()

    all_jobs = [
        {
            "company": "Google",
            "role": "AI Engineer",
            "location": "Remote",
            "source": "Company Careers",
            "match_score": 92,
            "apply_link": "https://careers.google.com",
            "description": "Work on AI systems using Python, LLMs, RAG, and scalable backend services.",
            "why_apply": "Strong fit because this role matches Python, LLMs, RAG, backend APIs, and scalable AI systems."
        },
        {
            "company": "Microsoft",
            "role": "Machine Learning Engineer",
            "location": "Seattle, WA",
            "source": "Company Careers",
            "match_score": 88,
            "apply_link": "https://careers.microsoft.com",
            "description": "Build ML platforms using Python, cloud infrastructure, and production ML pipelines.",
            "why_apply": "Good fit because this role matches machine learning, Python, cloud, and production ML experience."
        },
        {
            "company": "OpenAI",
            "role": "Applied AI Engineer",
            "location": "San Francisco, CA",
            "source": "Company Careers",
            "match_score": 90,
            "apply_link": "https://openai.com/careers",
            "description": "Build AI products using LLMs, evaluation systems, Python, and production APIs.",
            "why_apply": "Strong fit because this role aligns with LLM applications, evaluations, Python, and AI product engineering."
        },
        {
            "company": "Databricks",
            "role": "GenAI Engineer",
            "location": "Remote",
            "source": "Greenhouse Style",
            "match_score": 86,
            "apply_link": "https://www.databricks.com/company/careers",
            "description": "Develop GenAI applications using vector search, RAG, ML infrastructure, and cloud systems.",
            "why_apply": "Good fit because this role matches RAG, vector search, GenAI, and ML infrastructure."
        },
        {
            "company": "Anthropic",
            "role": "AI Product Engineer",
            "location": "Remote",
            "source": "Lever Style",
            "match_score": 89,
            "apply_link": "https://www.anthropic.com/careers",
            "description": "Build AI-powered product features using LLMs, backend systems, and safety-focused evaluation.",
            "why_apply": "Strong fit because this role combines LLMs, backend engineering, AI safety, and product development."
        }
    ]

    filtered_jobs = []

    for job in all_jobs:
        job_text = (
            job["company"] + " " +
            job["role"] + " " +
            job["location"] + " " +
            job["source"] + " " +
            job["description"]
        ).lower()

        role_match = role == "" or role in job_text
        location_match = location == "" or location in job_text
        keyword_match = keywords == "" or any(
            word in job_text for word in keywords.split()
        )

        if role_match and location_match and keyword_match:
            filtered_jobs.append(job)

    return {
        "query": data.role,
        "location": data.location,
        "jobs": filtered_jobs
    }     
                  
    filtered_jobs = []  

    for job in all_jobs:
        job_text = (
            job["company"] + " " +
            job["role"] + " " +
            job["location"] + " " +
            job["description"]
        ).lower()

        if role in job_text or location in job_text or keywords in job_text:
            filtered_jobs.append(job)

    return {
        "query": data.role,
        "location": data.location,
        "jobs": filtered_jobs if filtered_jobs else all_jobs
    }

@app.post("/cover-letter")
def cover_letter(data: CoverLetterRequest):
    return {
        "cover_letter": f"""
Dear Hiring Team,

I am excited to apply for the {data.role} position at {data.company}. My background in AI/ML engineering, Python, FastAPI, LLMs, RAG, backend APIs, and production-ready systems aligns well with this opportunity.

In my previous work, I have built AI-powered applications, developed scalable backend services, worked with machine learning workflows, and created practical solutions that improve automation and decision-making. I am especially interested in this role because it allows me to apply both software engineering and AI skills to solve real business problems.

I would welcome the opportunity to discuss how my experience can contribute to {data.company}'s engineering goals.

Best regards,
Nitesh Kumar
"""
}

@app.post("/application-assistant")
def application_assistant(data: ApplicationAssistantRequest):
    return {
        "why_interested": f"I am interested in the {data.role} role at {data.company} because it aligns with my background in AI/ML engineering, backend development, Python, FastAPI, LLMs, RAG, and production-ready systems. This role would allow me to contribute to real-world AI solutions while continuing to grow as an engineer.",

        "tell_us_about_yourself": "I am an AI/ML Engineer with experience building machine learning applications, backend APIs, LLM-powered systems, and production-ready software solutions. My strengths include Python, FastAPI, machine learning, RAG, LLM applications, cloud deployment, and problem-solving.",

        "why_should_we_hire_you": f"You should hire me because I bring a strong combination of AI/ML knowledge, backend engineering experience, and hands-on project execution. I can build practical AI features, develop scalable APIs, analyze model performance, and contribute quickly to the {data.role} role.",

        "salary_expectation": "I am open to discussing compensation within the posted salary range based on the overall opportunity, responsibilities, and benefits package.",

        "work_authorization": "I am currently authorized to work in the United States on F1 OPT and am STEM extension eligible.",

        "short_pitch": f"I am excited about the {data.role} role at {data.company}. My experience in Python, AI/ML, LLMs, RAG, FastAPI, and production backend systems makes me a strong fit for this opportunity."
    }

@app.post("/search-jobs")
def search_jobs(data: JobSearchRequest):
    role = data.role.lower()
    location = data.location.lower()
    keywords = data.keywords.lower()

    all_jobs = [
        {
            "company": "Google",
            "role": "AI Engineer",
            "location": "Remote",
            "source": "Company Careers",
            "match_score": 92,
            "apply_link": "https://careers.google.com",
            "description": "Work on AI systems using Python, LLMs, RAG, and scalable backend services.",
            "why_apply": "Strong fit because this role matches Python, LLMs, RAG, backend APIs, and scalable AI systems."
        },
        {
            "company": "Microsoft",
            "role": "Machine Learning Engineer",
            "location": "Seattle, WA",
            "source": "Company Careers",
            "match_score": 88,
            "apply_link": "https://careers.microsoft.com",
            "description": "Build ML platforms using Python, cloud infrastructure, and production ML pipelines.",
            "why_apply": "Good fit because this role matches machine learning, Python, cloud, and production ML experience."
        },
        {
            "company": "OpenAI",
            "role": "Applied AI Engineer",
            "location": "San Francisco, CA",
            "source": "Company Careers",
            "match_score": 90,
            "apply_link": "https://openai.com/careers",
            "description": "Build AI products using LLMs, evaluation systems, Python, and production APIs.",
            "why_apply": "Strong fit because this role aligns with LLM applications, evaluations, Python, and AI product engineering."
        },
        {
            "company": "Databricks",
            "role": "GenAI Engineer",
            "location": "Remote",
            "source": "Greenhouse Style",
            "match_score": 86,
            "apply_link": "https://www.databricks.com/company/careers",
            "description": "Develop GenAI applications using vector search, RAG, ML infrastructure, and cloud systems.",
            "why_apply": "Good fit because this role matches RAG, vector search, GenAI, and ML infrastructure."
        },
        {
            "company": "Anthropic",
            "role": "AI Product Engineer",
            "location": "Remote",
            "source": "Lever Style",
            "match_score": 89,
            "apply_link": "https://www.anthropic.com/careers",
            "description": "Build AI-powered product features using LLMs, backend systems, and safety-focused evaluation.",
            "why_apply": "Strong fit because this role combines LLMs, backend engineering, AI safety, and product development."
        }
    ]

    filtered_jobs = []

    for job in all_jobs:
        job_text = (
            job["company"] + " " +
            job["role"] + " " +
            job["location"] + " " +
            job["source"] + " " +
            job["description"]
        ).lower()

        role_match = role == "" or role in job_text
        location_match = location == "" or location in job_text
        keyword_match = keywords == "" or any(
            word in job_text for word in keywords.split()
        )

        if role_match and location_match and keyword_match:
            filtered_jobs.append(job)

    return {
        "query": data.role,
        "location": data.location,
        "jobs": filtered_jobs
    }

@app.post("/interview-agent")
def interview_agent(data: InterviewAgentRequest):
    return {
        "technical_questions": [
            "Explain your experience with Python in production systems.",
            "How would you design a FastAPI backend for an AI application?",
            "How do you build and evaluate a RAG pipeline?",
            "What is the difference between fine-tuning and prompt engineering?",
            "How would you monitor an ML model after deployment?"
        ],
        "system_design_questions": [
            f"Design an AI-powered job recommendation system for {data.company}.",
            "Design a scalable document processing pipeline using OCR, embeddings, and vector search.",
            "Design a production LLM application with authentication, logging, retries, and monitoring."
        ],
        "behavioral_questions": [
            "Tell me about yourself.",
            "Tell me about a time you solved a difficult technical problem.",
            "Describe a time you worked with ambiguity.",
            "Tell me about a project you are proud of.",
            "Why are you interested in this role?"
        ],
        "project_questions": [
            "Explain your most relevant AI/ML project end-to-end.",
            "What challenges did you face while building your RAG or LLM project?",
            "How did you measure success in your project?",
            "How would you improve your project if you had more time?"
        ],
        "preparation_plan": [
            "Review your resume projects and prepare 2-minute explanations.",
            "Practice Python, APIs, ML basics, LLMs, RAG, and deployment questions.",
            "Prepare STAR-format behavioral answers.",
            "Review the company, product, and job description before the interview."
        ]
    }

@app.post("/resume-tailor")
def resume_tailor(data: ResumeTailorRequest):
    resume = data.resume_text.lower()
    jd = data.job_description.lower()

    important_keywords = [
        "python", "fastapi", "llm", "rag", "langchain", "aws",
        "docker", "kubernetes", "machine learning", "nlp",
        "vector search", "faiss", "mongodb", "sql", "react"
    ]

    missing_keywords = [
        keyword for keyword in important_keywords
        if keyword in jd and keyword not in resume
    ]

    return {
        "target_title": f"{data.role} | Python, LLMs, RAG, FastAPI, AWS",
        "missing_keywords": missing_keywords,
        "skills_to_emphasize": missing_keywords,
        "projects_to_highlight": [
            "UniQuest AI / RAG-based recommendation project",
            "AI Job Agent platform",
            "Document intelligence or KYC extraction project",
            "FastAPI backend services"
        ],
        "tailored_bullets": [
            "Built AI-powered backend services using Python, FastAPI, and REST APIs to support scalable production workflows.",
            "Developed RAG-based LLM applications using LangChain, vector search, and prompt engineering to improve response accuracy.",
            "Implemented cloud-ready deployment workflows using AWS, Docker, and Kubernetes for reliable AI application delivery."
        ],
        "resume_improvement_plan": [
            "Move the most relevant AI/ML project higher on the resume.",
            "Add missing JD keywords naturally into Skills and Project bullets.",
            "Use measurable impact such as accuracy improvement, latency reduction, or number of users.",
            "Keep resume bullets concise and achievement-focused."
        ]
    }

@app.post("/auto-resume")
def auto_resume(data: AutoResumeRequest):
    return {
        "filename": f"{data.company}_{data.role}_Resume.txt".replace(" ", "_"),
        "resume_text": f"""
{data.role}
Target Company: {data.company}

PROFESSIONAL SUMMARY
AI/ML Engineer with experience in Python, FastAPI, machine learning, LLM applications, RAG systems, backend APIs, and production-ready AI solutions. Experienced in building scalable applications, analyzing job requirements, and aligning AI systems with real business needs.

TECHNICAL SKILLS
Python, FastAPI, Machine Learning, LLMs, RAG, LangChain, AWS, Docker, Kubernetes, SQL, MongoDB, React, REST APIs

RELEVANT EXPERIENCE
• Built AI-powered backend services using Python, FastAPI, and REST APIs to support scalable production workflows.
• Developed LLM and RAG-based applications using LangChain, vector search, and prompt engineering to improve response quality.
• Implemented cloud-ready deployment workflows using AWS, Docker, and Kubernetes for reliable AI application delivery.
• Created machine learning workflows for data processing, model evaluation, and application-level AI features.

PROJECTS
AI Job Agent Platform
• Built a full-stack AI job search platform with FastAPI, Next.js, SQLite, resume analysis, recruiter messaging, application assistance, and job tracking.

RAG / LLM Application
• Developed retrieval-augmented generation workflows using embeddings, vector search, and LLM prompts to improve grounded responses.

WHY THIS RESUME MATCHES THE ROLE
This resume is tailored for the {data.role} role at {data.company} by emphasizing AI/ML engineering, Python, FastAPI, LLMs, RAG, backend systems, cloud deployment, and production-ready software experience.
"""
    }
@app.post("/save-package")
def save_package(
    data: SavePackageRequest,
    db: Session = Depends(get_db)
):
    package = ApplicationPackage(
        company=data.company,
        role=data.role,
        job_analysis=data.job_analysis,
        resume_tailor=data.resume_tailor,
        cover_letter=data.cover_letter,
        recruiter_message=data.recruiter_message,
        application_answers=data.application_answers
    )

    db.add(package)
    db.commit()
    db.refresh(package)

    return {
        "message": "Package saved successfully",
        "id": package.id
    }
@app.get("/packages")
def get_packages(db: Session = Depends(get_db)):
    return (
        db.query(ApplicationPackage)
        .order_by(ApplicationPackage.created_at.desc())
        .all()
    )