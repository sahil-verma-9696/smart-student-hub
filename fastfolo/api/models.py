from pydantic import BaseModel
from typing import List, Optional

class CertificateInfo(BaseModel):
    path: str
    type: str  # 'pdf', 'doc', 'image'

class StudentData(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    projects: Optional[List[str]] = None
    achievements: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    certificates: Optional[List[CertificateInfo]] = None
    education: Optional[List[str]] = None
    work_experience: Optional[List[str]] = None
    job_description: Optional[str] = None
