export const ActivityConfig = {
  default: {
    label: "Default",
    fields: [
      { name: "title", label: "Title", type: "text", section: "basic" },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        section: "basic",
      },
    ],
  },

  // ---------------------------------------------------
  //  H A C K A T H O N
  // ---------------------------------------------------
  hackathon: {
    label: "Hackathon",
    fields: [
      // BASIC
      { name: "title", label: "Title", type: "text", section: "basic" },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        section: "basic",
      },

      // DETAILS
      {
        name: "level",
        label: "Level",
        type: "select",
        section: "details",
        options: [
          { label: "College Level", value: "college" },
          { label: "State Level", value: "state" },
          { label: "National Level", value: "national" },
        ],
      },
      {
        name: "participantType",
        label: "Participation",
        type: "radio",
        section: "details",
        options: [
          { label: "Solo", value: "solo" },
          { label: "Team", value: "team" },
        ],
      },
      {
        name: "deadline",
        label: "Submission Deadline",
        type: "date",
        section: "details",
      },
      {
        name: "organizer",
        label: "Organizer",
        type: "text",
        section: "details",
      },
      {
        name: "teamSize",
        label: "Team Size",
        type: "number",
        section: "details",
      },
      {
        name: "rank",
        label: "Rank",
        type: "text",
        section: "details",
      },
      {
        name: "hackDescription",
        label: "Hack Description",
        type: "textarea",
        section: "details",
      },

      // SKILLS
      {
        name: "hackathon_skill",
        label: "Skills",
        type: "tags",
        section: "skill",
        placeholder: "e.g. Python, JS, RAG",
      },
    ],
  },

  // ---------------------------------------------------
  //  W O R K S H O P
  // ---------------------------------------------------
  workshop: {
    label: "Workshop",
    fields: [
      // BASIC
      { name: "title", label: "Title", type: "text", section: "basic" },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        section: "basic",
      },

      // DETAILS
      { name: "speaker", label: "Speaker", type: "text", section: "details" },
      { name: "duration", label: "Duration", type: "text", section: "details" },
      {
        name: "mode",
        label: "Mode",
        type: "select",
        section: "details",
        options: [
          { label: "Online", value: "online" },
          { label: "Offline", value: "offline" },
        ],
      },

      // SKILLS
      {
        name: "workshop_skill",
        label: "Skills",
        type: "tags",
        section: "skill",
        placeholder: "e.g. Communication, Leadership",
      },
    ],
  },

  // ---------------------------------------------------
  //  I N T E R N S H I P
  // ---------------------------------------------------
  internship: {
    label: "Internship",
    fields: [
      // BASIC
      { name: "title", label: "Title", type: "text", section: "basic" },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        section: "basic",
      },

      // DETAILS
      { name: "company", label: "Company", type: "text", section: "details" },
      { name: "role", label: "Role", type: "text", section: "details" },
      {
        name: "inst_duration",
        label: "Duration",
        type: "text",
        section: "details",
      },
      {
        name: "inst_startDate",
        label: "Start Date",
        type: "date",
        section: "details",
      },
      {
        name: "inst_endDate",
        label: "End Date",
        type: "date",
        section: "details",
      },
      {
        name: "inst_paid",
        label: "Paid Internship",
        type: "radio",
        section: "details",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
      },

      // SKILLS
      {
        name: "internship_skill",
        label: "Skills",
        type: "tags",
        section: "skill",
        placeholder: "e.g. React, SQL, Teamwork",
      },
    ],
  },

  // ---------------------------------------------------
  //  C E R T I F I C A T I O N
  // (Not in DTO, but included from your config)
  // ---------------------------------------------------
  certification: {
    label: "Certification",
    fields: [
      {
        name: "title",
        label: "Certification Name",
        type: "text",
        section: "basic",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        section: "basic",
      },

      {
        name: "issuedBy",
        label: "Issued By",
        type: "text",
        section: "details",
      },
      {
        name: "credentialId",
        label: "Credential ID",
        type: "text",
        section: "details",
      },
      {
        name: "issueDate",
        label: "Issue Date",
        type: "date",
        section: "details",
      },
      {
        name: "validity",
        label: "Valid For (Months)",
        type: "number",
        section: "details",
      },
    ],
  },

  // ---------------------------------------------------
  //  C U S T O M
  // ---------------------------------------------------
  custom: {
    label: "Custom",
    fields: [
      { name: "title", label: "Title", type: "text", section: "basic" },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        section: "basic",
      },

      // SKILLS
      {
        name: "custom_skill",
        label: "Skills",
        type: "tags",
        section: "skill",
        placeholder: "Enter skills",
      },

      // additional dynamic fields (user-created) will be appended here
    ],
  },

  // ---------------------------------------------------
  //  P L A C E M E N T
  // ---------------------------------------------------
  placement: {
    label: "Placement",
    fields: [
      // BASIC
      { name: "title", label: "Title", type: "text", section: "basic" },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        section: "basic",
      },

      // DETAILS
      {
        name: "placement_company",
        label: "Company Name",
        type: "text",
        section: "details",
      },
      {
        name: "placement_role",
        label: "Role",
        type: "text",
        section: "details",
      },
      {
        name: "placement_package",
        label: "Package (LPA)",
        type: "number",
        section: "details",
      },
      {
        name: "placement_placementType",
        label: "Placement Type",
        type: "select",
        section: "details",
        options: [
          { label: "On-Campus", value: "on-campus" },
          { label: "Off-Campus", value: "off-campus" },
        ],
      },
      {
        name: "placement_joiningDate",
        label: "Joining Date",
        type: "date",
        section: "details",
      },
      {
        name: "placement_referenceNo",
        label: "Reference Number",
        type: "number",
        section: "details",
      },

      // SKILLS
      {
        name: "placement_skill",
        label: "Skills",
        type: "tags",
        section: "skill",
        placeholder: "e.g. DSA, Aptitude, Communication",
      },
    ],
  },

  // ---------------------------------------------------
  //  P L A C E M E N T
  // ---------------------------------------------------
  high_school: {
    label: "High School Marksheet",
    fields: [
      // BASIC
      { name: "title", label: "Title", type: "text", section: "basic" },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        section: "basic",
      },

      // DETAILS
      {
        name: "board",
        label: "Board",
        type: "text",
        section: "details",
      },
      {
        name: "schoolName",
        label: "School Name",
        type: "text",
        section: "details",
      },
      {
        name: "percentage",
        label: "Percentage",
        type: "number",
        section: "details",
      },

      {
        name: "passingYear",
        label: "Passing Year",
        type: "date",
        section: "details",
      },
      // SKILLS
      {
        name: "highschool_subjects",
        label: "Subjects",
        type: "tags",
        section: "skill",
        placeholder: "e.g. Mathematics, English, Science",
      },
    ],
  },

  intermediate_school: {
    label: "Intermediate School Marksheet",
    fields: [
      // BASIC
      { name: "title", label: "Title", type: "text", section: "basic" },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        section: "basic",
      },

      // DETAILS
      {
        name: "board",
        label: "Board",
        type: "text",
        section: "details",
      },
      {
        name: "schoolName",
        label: "School Name",
        type: "text",
        section: "details",
      },
      {
        name: "percentage",
        label: "Percentage",
        type: "number",
        section: "details",
      },

      {
        name: "passingYear",
        label: "Passing Year",
        type: "date",
        section: "details",
      },
      // SKILLS
      {
        name: "intermediateschool_subjects",
        label: "Subjects",
        type: "tags",
        section: "skill",
        placeholder: "e.g. Mathematics, English, Science",
      },
    ],
  },

  semester_results: {
    label: "Semester Results",
    fields: [
      // ---------------- BASIC ----------------
      { name: "title", label: "Title", type: "text", section: "basic" },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        section: "basic",
      },

      // ---------------- SEMESTER DETAILS ----------------
      {
        name: "semester",
        label: "Semester",
        type: "text", // or "number"
        section: "details",
      },
      {
        name: "academicYear",
        label: "Academic Year",
        type: "text", // example: "2023-2024"
        section: "details",
      },
      {
        name: "examType",
        label: "Exam Type",
        type: "select",
        options: ["Regular", "Re-Exam", "Backlog"],
        section: "details",
      },

      // ---------------- MARKS DETAILS ----------------
      {
        name: "cgpa",
        label: "CGPA",
        type: "number",
        section: "marks",
      },
      {
        name: "sgpa",
        label: "SGPA",
        type: "number",
        section: "marks",
      },
      {
        name: "percentage",
        label: "Percentage",
        type: "number",
        section: "marks",
      },
      {
        name: "totalCredits",
        label: "Total Credits",
        type: "number",
        section: "marks",
      },
      {
        name: "earnedCredits",
        label: "Earned Credits",
        type: "number",
        section: "marks",
      },

      // ---------------- RESULT STATUS ----------------
      {
        name: "resultStatus",
        label: "Result Status",
        type: "select",
        options: ["Pass", "Fail", "Backlog"],
        section: "result",
      },
      {
        name: "passingDate",
        label: "Passing Date",
        type: "date",
        section: "result",
      },

      // ---------------- ATTACHMENTS ----------------
      {
        name: "marksheet",
        label: "Marksheet / Scorecard",
        type: "file",
        section: "attachments",
      },
    ],
  },

  year_results: {
    label: "Year Results",
    fields: [
      // ---------------- BASIC ----------------
      { name: "title", label: "Title", type: "text", section: "basic" },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        section: "basic",
      },
  
      // ---------------- YEAR DETAILS ----------------
      {
        name: "year",
        label: "Academic Year",
        type: "text", // Example: "2023-2024"
        section: "details",
      },
      {
        name: "yearNumber",
        label: "Year Number",
        type: "select",
        options: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
        section: "details",
      },
  
      // ---------------- SEMESTER SUB-RESULTS ----------------
      {
        name: "sem1SGPA",
        label: "Semester 1 SGPA",
        type: "number",
        section: "semesters",
      },
      {
        name: "sem2SGPA",
        label: "Semester 2 SGPA",
        type: "number",
        section: "semesters",
      },
  
      // ---------------- FINAL YEAR PERFORMANCE ----------------
      {
        name: "finalCGPA",
        label: "Final CGPA",
        type: "number",
        section: "final",
      },
      {
        name: "finalPercentage",
        label: "Final Percentage",
        type: "number",
        section: "final",
      },
      {
        name: "totalCredits",
        label: "Total Credits",
        type: "number",
        section: "final",
      },
      {
        name: "earnedCredits",
        label: "Earned Credits",
        type: "number",
        section: "final",
      },
  
      // ---------------- RESULT STATUS ----------------
      {
        name: "resultStatus",
        label: "Result Status",
        type: "select",
        options: ["Pass", "Fail", "Backlog"],
        section: "status",
      },
  
      {
        name: "passingDate",
        label: "Passing Date",
        type: "date",
        section: "status",
      },

      {
        name: 'backlogs',
        label: 'Backlogs',
        type: 'number',
        section: 'status'
      }
    ],
  }

};
