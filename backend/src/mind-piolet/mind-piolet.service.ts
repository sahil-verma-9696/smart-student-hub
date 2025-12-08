import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { ChatGroq } from '@langchain/groq';
import { HumanMessage } from '@langchain/core/messages';
import { StudentService } from '../student/student.service';
import { MindPiolet, MindPioletDocument } from './schema/mind-piolet.schema';
import { AnalysisRequestDto } from './dto/analysis-request.dto';

@Injectable()
export class MindPioletService {
  private model: ChatGroq | null = null;

  constructor(
    @InjectModel(MindPiolet.name) private mindPioletModel: Model<MindPioletDocument>,
    private studentService: StudentService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    if (apiKey) {
      this.model = new ChatGroq({
        apiKey: apiKey,
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
      });
    } else {
      console.warn('GROQ_API_KEY not found. MindPiolet AI features will be disabled.');
    }
  }

  async analyzeSkills(userId: string, dto: AnalysisRequestDto) {
    const student = await this.getStudentData(userId);
    const prompt = this.buildSkillAnalysisPrompt(student, dto);
    const response = await this.generateResponse(prompt);
    
    await this.saveInteraction(userId, 'SKILL', dto, response);
    return { result: response };
  }

  async generateRoadmap(userId: string, dto: AnalysisRequestDto) {
    if (!dto.role) throw new Error('Role is required for roadmap generation');
    
    const student = await this.getStudentData(userId);
    const prompt = this.buildRoadmapPrompt(student, dto);
    const response = await this.generateResponse(prompt);

    await this.saveInteraction(userId, 'ROADMAP', dto, response, dto.role);
    return { result: response };
  }

  async interviewPrep(userId: string, dto: AnalysisRequestDto) {
    if (!dto.role) throw new Error('Role is required for interview preparation');

    const student = await this.getStudentData(userId);
    const prompt = this.buildInterviewPrompt(student, dto);
    const response = await this.generateResponse(prompt);

    await this.saveInteraction(userId, 'INTERVIEW', dto, response, dto.role);
    return { result: response };
  }

  async getHistory(userId: string) {
    return this.mindPioletModel.find({ student: userId }).sort({ createdAt: -1 }).exec();
  }

  private async getStudentData(userId: string) {
    const student = await this.studentService.getByUserId(userId);
    if (!student) throw new NotFoundException('Student not found');
    
    // Map Mongoose document to plain object structure expected by prompts
    const basic = student.basicUserDetails as any;
    const academic = student.academicDetails as any;
    
    return {
      name: basic.name,
      email: basic.email,
      education: academic ? `${academic.degree} in ${academic.program}` : 'Not Provided',
      skills: student.skills || [],
      interests: student.interests || [],
      projects: student.projects || [],
      achievements: student.achievements || [],
      strengths: student.strengths || [],
      weaknesses: student.weaknesses || [],
      languages: student.languages || [],
      experience: student.experience || 'Fresher',
      target_role: student.target_role || 'Not Specified',
    };
  }

  private async generateResponse(prompt: string): Promise<string> {
    if (!this.model) {
      return 'AI features are currently unavailable. Please configure the GROQ_API_KEY environment variable.';
    }
    
    try {
      console.log('--- Sending Request to Groq ---');
      console.log('Prompt Preview:', prompt.substring(0, 200) + '...');
      const response = await this.model.invoke([new HumanMessage(prompt)]);
      console.log('--- Received Response from Groq ---');
      console.log('Response Content:', response.content);
      return response.content as string;
    } catch (error) {
      console.error('AI Generation Error:', error);
      return 'I apologize, but I encountered an error while generating your personalized response. Please try again later.';
    }
  }

  private async saveInteraction(userId: string, type: string, input: any, output: string, role?: string) {
    await this.mindPioletModel.create({
      student: userId,
      type,
      role,
      metadata: input,
      response: output,
    });
  }

  // --- PROMPT BUILDERS (Ported from Python) ---

  private buildSkillAnalysisPrompt(student: any, dto: AnalysisRequestDto): string {
    const conversationText = dto.conversation 
      ? dto.conversation.map(m => `${m.role}: ${m.content}`).join('\n') 
      : '';
    const targetRole = dto.role?.trim() || student.target_role || 'Not Specified';
    const hasTargetRole = targetRole.toLowerCase() !== 'not specified';

    return `
You are **MindPilot**, an expert career advisor providing HIGHLY PERSONALIZED analysis for ${student.name}.

**Student Profile:**
- Name: ${student.name}
- Email: ${student.email}
- Education: ${student.education}
- Target Role: ${targetRole}
- Current Skills: ${student.skills.length ? student.skills.join(', ') : 'None listed'}
- Languages: ${student.languages.length ? student.languages.join(', ') : 'None listed'}
- Interests: ${student.interests.length ? student.interests.join(', ') : 'None listed'}
- Projects Completed: ${student.projects.length} projects
- Achievements: ${student.achievements.length ? student.achievements.join(', ') : 'None listed'}
- Key Strengths: ${student.strengths.length ? student.strengths.join(', ') : 'None identified'}
- Areas for Growth: ${student.weaknesses.length ? student.weaknesses.join(', ') : 'None identified'}

**Conversation History:**
${conversationText}

**User Request/Context:**
"${dto.message || ''}"

(If the user request is specific, prioritize it. Otherwise, perform a standard skill analysis.)

---

# ⚠ CRITICAL INSTRUCTION
YOU MUST START YOUR RESPONSE WITH:
"Hi ${student.name}! 👋"

Then provide the analysis below.

---

# ⚠ IMPORTANT FORMAT RULES – FOLLOW STRICTLY
- MUST use Markdown headings (e.g., # Heading)
- MUST use Markdown lists (e.g., - Item) for all lists
- MUST put each list item on a NEW LINE
- DO NOT use paragraphs for lists
- Response should look like a REAL chatbot answer  
- NEVER assume the student wants a software/tech career unless the target role or skills explicitly point to it.
- If the student has no target role and no skills, politely ask them to share their interests before giving task-specific advice.
- Recommendations must reference the student's actual skills, interests, projects, and weaknesses. If data is missing, acknowledge it briefly and give low-barrier next steps to discover interests.

---

# 💪 CURRENT STRENGTHS  
List ONLY skills where the student performs well (use Markdown list):
- 
- 
- 

---

# ⚠ WEAK AREAS / GAPS  
List ONLY areas that *need improvement* (use Markdown list). If information is missing, call it out as "Missing data" rather than inventing gaps:
- 
- 
- 

---

# 📌 QUICK IMPROVEMENT TIPS (MICRO LEARNING)  
- One-line advice per skill or interest the student actually has (or explicitly lacks).  
- Only short courses / resources  
- Mention platforms in brackets (Coursera, YT, Udemy)  
- Max 5 bullets  
${hasTargetRole ? `- Advice must be relevant to the role "${targetRole}". If a suggestion is not role-specific, do not include it.` : '- Encourage the student to clarify their desired role or industry before deep-diving into domain-specific resources.'}
`;
  }

  private buildRoadmapPrompt(student: any, dto: AnalysisRequestDto): string {
    const conversationText = dto.conversation 
      ? dto.conversation.map(m => `${m.role}: ${m.content}`).join('\n') 
      : '';

    const targetRole = dto.role?.trim() || student.target_role || 'Not Specified';
    const hasProjects = student.projects.length > 0;
    const projectsSummary = hasProjects
      ? student.projects
          .map((p: any) => {
            const details = p.description ? `: ${p.description}` : '';
            return `- ${p.title}${details}`;
          })
          .join('\n')
      : '- No projects completed yet';

    const lines: string[] = [
      `You are **MindPilot**, an industry mentor building a **time-bound roadmap** for ${student.name}.`,
      '',
      '**Student Snapshot**',
      `- Experience level: ${student.experience}`,
      `- Target role: ${targetRole}`,
      `- Current skills: ${student.skills.length ? student.skills.join(', ') : 'None listed'}`,
      `- Interests: ${student.interests.length ? student.interests.join(', ') : 'None listed'}`,
      '- Projects:',
      projectsSummary,
      `- Strengths: ${student.strengths.length ? student.strengths.join(', ') : 'Not provided'}`,
      `- Weaknesses: ${student.weaknesses.length ? student.weaknesses.join(', ') : 'Not provided'}`,
      '',
      '**Conversation history**',
      conversationText || '- None provided',
      '',
      '**Important Guardrails**',
      `- Begin with a brief, warm greeting to ${student.name} referencing their actual profile (experience, strengths, or gaps).`,
      `- Keep advice aligned to ${targetRole}; do not assume a software/tech path unless their data clearly indicates it.`,
      '- Acknowledge missing data (skills, projects, etc.) and propose low-barrier ways to gather it.',
      '- Use Markdown headings and bullet lists. Each bullet must appear on a new line.',
      `- Structure the roadmap as sequential, time-based phases suitable for a ${student.experience?.toLowerCase?.() || 'fresher'}.`,
      '- Tie every recommendation back to the student’s current skills, interests, strengths, weaknesses, or target role. No generic filler.',
      '',
      '---',
      '',
      '# 🔍 Role Alignment Summary',
      `- Explain why ${targetRole} matches (or what gaps exist) given the profile (2 bullets).`,
      '- If the role is "Not Specified", ask the student to clarify before deep-diving.',
      '',
      '# 🗺️ Roadmap Overview (Human Narrative)',
      '- Provide a short paragraph describing the journey at a high level.',
      '',
      '# 📆 Sprint Plan (Use Weeks or Months)',
      'Lay out **6 sequential phases**. For each phase:',
      '## Phase X – Title',
      '- Duration: e.g., "Week 1" or "Month 2"',
      '- Focus: core theme covered in this phase.',
      `- Learning tasks: 2-3 items referencing ${student.name}'s profile (build on strengths, close weaknesses).`,
      `- Output/Checkpoint: deliverable ${student.name} should produce.`,
      '- Include discovery/shadowing if foundational awareness is missing.',
      '',
      '# 🧰 Tools & Resources (Role-Specific)',
      `| Category | Resource | Why it matters for ${targetRole} |`,
      '|----------|----------|----------------------------------|',
      `- Remove categories that are not relevant to ${targetRole}.`,
      '',
      '# 🤝 Portfolio & Experience Builders',
      `- Suggest 3 initiatives/projects tailored to ${targetRole} that fit ${student.name}'s level.`,
      `- Each bullet must mention the skill gap or strength it leverages.`,
      '',
      '# 🧭 Progress Checkpoints',
      '- Define 3 measurable checkpoints with metric, target outcome, and validation method.',
      '',
      '# ✅ Quick Wins (This Week)',
      `- List 3 under-two-hour actions aligned to the earliest roadmap phase for ${student.name}.`,
      '- Keep them simple, confidence-boosting, and role-aligned.',
      '',
      '# 🙋 Final Prompt',
      `- Invite ${student.name} to share new preferences, constraints, or feedback to refine the plan.`,
    ];

    return lines.join('\n');
  }

  private buildInterviewPrompt(student: any, dto: AnalysisRequestDto): string {
    const hasProjects = student.projects.length > 0;
    const projectsList = hasProjects
      ? student.projects
          .slice(0, 3)
          .map((p: any) => `     - ${p.title}: ${p.description || 'No description provided'}`)
          .join('\n')
      : '     - No projects yet';

    const lines: string[] = [
      `You are an **Industry-Level Role-Specific Interview Preparation AI** preparing ${student.name} for interviews.`,
      '',
      `🎯 **Target Job Role: ${dto.role || 'Not specified'}**`,
      `👤 **Candidate: ${student.name}**`,
      `   - Education: ${student.education}`,
      `   - Experience Level: ${student.experience}`,
      `   - Skills: ${student.skills.length ? student.skills.join(', ') : 'None listed'}`,
      `   - Key Strengths: ${student.strengths.length ? student.strengths.join(', ') : 'None identified'}`,
      '',
      "📋 **Candidate's Portfolio:**",
      '   - Projects:',
      projectsList,
      `   - Achievements: ${student.achievements.length ? student.achievements.join(', ') : 'None listed'}`,
      '',
      '**User Request/Context:**',
      `"${dto.message || ''}"`,
      '',
      '---',
      '',
      '## 📌 PERSONALIZATION RULES',
      `- Address ${student.name} by name when giving advice.`,
      '- Reference their specific projects and achievements in examples.',
      `- Consider their experience level (${student.experience}) when suggesting interview difficulty.`,
      `- Build confidence by highlighting their strengths: ${student.strengths.length ? student.strengths.join(', ') : 'None identified'}.`,
      '',
      '---',
      '',
      '## 🚨 STRICT RULES — MUST FOLLOW',
      '1. Determine if the role is Technical, Semi-Technical, or Non-Technical.',
      '2. Classify it into one of the following categories: Web Dev / Backend / Frontend / AI-ML / Data / Cybersecurity / Testing / Cloud / DevOps / UI-UX / Business Analyst / HR / Marketing / Finance / Management.',
      '3. Only include sections that make sense for the chosen category.',
      '4. If a section does not apply, skip it entirely.',
      '5. If the role is unclear, respond with: **"Please specify exact domain (e.g., Data Analyst / HR Manager / UI-UX Designer)"**.',
      '6. Never generate irrelevant content or make assumptions.',
      '7. Use Markdown only: # headings, tables with |, and list items with -. Put each bullet on a new line.',
      `8. Address ${student.name} directly in each guidance section and tie tips back to their profile or missing data.`,
      '',
      '---',
      '',
      '## 🔍 ROLE ANALYSIS (COMPULSORY FIRST)',
      '| Role Type | Technical? | Why this category |',
      '|-----------|-------------|-------------------|',
      `|           | YES / NO    | Cite ${student.name}'s profile to justify the classification |`,
      '',
      '❗ If the role is non-technical, do not include coding, tech stack, DSA, or project sections.',
      '',
      '---',
      '',
      '## 🧠 CORE SKILLS REQUIRED (ONLY ROLE-SPECIFIC)',
      '- List exactly three skill areas interviewers test for this role.',
      '- Include at least one behavioural or soft-skill bullet if the role is non-technical.',
      '- If profile information is missing, note the gap instead of guessing.',
      '',
      '👉 If the role is non-tech, focus on:',
      '- Case study solving',
      '- Market knowledge',
      '- Teamwork / communication',
      '- Critical thinking',
      '',
      '---',
      '',
      '## ⚙ TECH STACK (ONLY IF TECHNICAL ROLE)',
      'FORMAT MUST BE:',
      '| Category   | Tools |',
      '|------------|-------|',
      '| Languages  |       |',
      '| Frameworks |       |',
      '| Databases  |       |',
      '',
      '---',
      '',
      '## 🎯 Role-Specific Case Drill',
      `- Provide one scenario tailored to ${student.name}'s background and the target role.`,
      `- Add a short checklist (3 bullets) describing how ${student.name} should structure the answer.`,
      '',
      '---',
      '',
      '## 🗣️ Behavioural Question Bank',
      `- List exactly five question prompts referencing ${student.name}'s experience level.`,
      `- If ${hasProjects ? 'projects are available' : 'there are no projects yet'}, highlight how to leverage academic, extracurricular, or personal experiences.`,
      '',
      '---',
      '',
      '## ✅ Preparation To-Do (This Week)',
      `- Provide three under-two-hour tasks that ${student.name} can complete immediately.`,
      '- Mention the supporting resource or template in brackets (e.g., [LinkedIn Learning]).',
      '',
      '---',
      '',
      '## 🙋 Closing Prompt',
      `- End with a sentence inviting ${student.name} to share outcomes so you can refine the prep plan.`,
    ];

    return lines.join('\n');
  }
}

