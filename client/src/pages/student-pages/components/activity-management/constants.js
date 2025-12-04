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
      // {
      //   name: "teamMember",
      //   label: "Team Member",
      //   type: "text",
      //   section: "details",
      // },
    ],
  },

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
      {
        name: "certificate",
        label: "Certificate Provided",
        type: "checkbox",
        section: "details",
      },
    ],
  },

  internship: {
    label: "Internship",
    fields: [
      // BASIC
      {
        name: "title",
        label: "Internship Title",
        type: "text",
        section: "basic",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        section: "basic",
      },

      // DETAILS
      { name: "company", label: "Company", type: "text", section: "details" },
      { name: "role", label: "Role", type: "text", section: "details" },
      { name: "duration", label: "Duration", type: "text", section: "details" },
      {
        name: "startDate",
        label: "Start Date",
        type: "date",
        section: "details",
      },
      { name: "endDate", label: "End Date", type: "date", section: "details" },
      {
        name: "paid",
        label: "Paid Internship",
        type: "radio",
        section: "details",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
      },
    ],
  },

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

  research: {
    label: "Research",
    fields: [
      {
        name: "title",
        label: "Research Title",
        type: "text",
        section: "basic",
      },
      {
        name: "abstract",
        label: "Abstract",
        type: "textarea",
        section: "basic",
      },

      {
        name: "supervisor",
        label: "Supervisor",
        type: "text",
        section: "details",
      },
      { name: "domain", label: "Domain", type: "text", section: "details" },
      {
        name: "published",
        label: "Published",
        type: "checkbox",
        section: "details",
      },
      {
        name: "publishDate",
        label: "Publish Date",
        type: "date",
        section: "details",
      },
    ],
  },

  publication: {
    label: "Publication",
    fields: [
      { name: "title", label: "Paper Title", type: "text", section: "basic" },
      {
        name: "abstract",
        label: "Abstract",
        type: "textarea",
        section: "basic",
      },

      {
        name: "journal",
        label: "Journal/Conference",
        type: "text",
        section: "details",
      },
      {
        name: "indexing",
        label: "Indexing",
        type: "select",
        section: "details",
        options: [
          { label: "Scopus", value: "scopus" },
          { label: "SCI", value: "sci" },
          { label: "UGC", value: "ugc" },
        ],
      },
      { name: "doi", label: "DOI", type: "text", section: "details" },
      {
        name: "year",
        label: "Publication Year",
        type: "number",
        section: "details",
      },
    ],
  },

  leadership: {
    label: "Leadership",
    fields: [
      { name: "title", label: "Position", type: "text", section: "basic" },
      {
        name: "description",
        label: "Role Description",
        type: "textarea",
        section: "basic",
      },

      {
        name: "club",
        label: "Club / Organization",
        type: "text",
        section: "details",
      },
      { name: "duration", label: "Duration", type: "text", section: "details" },
      {
        name: "responsibilities",
        label: "Responsibilities",
        type: "textarea",
        section: "details",
      },
    ],
  },

  community: {
    label: "Community Service",
    fields: [
      {
        name: "title",
        label: "Activity Title",
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
        name: "hours",
        label: "Service Hours",
        type: "number",
        section: "details",
      },
      { name: "location", label: "Location", type: "text", section: "details" },
      {
        name: "impact",
        label: "Impact Summary",
        type: "textarea",
        section: "details",
      },
    ],
  },

  conference: {
    label: "Conference",
    fields: [
      {
        name: "title",
        label: "Conference Title",
        type: "text",
        section: "basic",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        section: "basic",
      },

      { name: "location", label: "Location", type: "text", section: "details" },
      {
        name: "attendedOn",
        label: "Attended On",
        type: "date",
        section: "details",
      },
      {
        name: "participationType",
        label: "Participation",
        type: "select",
        section: "details",
        options: [
          { label: "Attendee", value: "attendee" },
          { label: "Speaker", value: "speaker" },
          { label: "Panelist", value: "panelist" },
        ],
      },
    ],
  },

  competition: {
    label: "Competition",
    fields: [
      {
        name: "title",
        label: "Competition Name",
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
        name: "rank",
        label: "Rank / Position",
        type: "number",
        section: "details",
      },
      { name: "category", label: "Category", type: "text", section: "details" },
      {
        name: "teamSize",
        label: "Team Size",
        type: "number",
        section: "details",
      },
    ],
  },

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
      // user-added dynamic fields will be appended here
    ],
  },
};
