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
      // { name: "workshopName", label: "Workshop Name", type: "text", section: "basic" },
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
      // {
      //   name: "certificate",
      //   label: "Certificate Provided",
      //   type: "checkbox",
      //   section: "details",
      // },
    ],
  },

  internship: {
    label: "Internship",
    fields: [
      // BASIC
      {
        name: "title",
        label: "Title",
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

  // placement: {
  //   label: "Placement",
  //   fields: [
  //     // BASIC
  //     { name: "title", label: "Title", type: "text", section: "basic" },
  //     {
  //       name: "description",
  //       label: "Description",
  //       type: "textarea",
  //       section: "basic",
  //     },

  //     // DETAILS
  //     {
  //       name: "placement_company",
  //       label: "Company Name",
  //       type: "text",
  //       section: "details",
  //     },
  //     {
  //       name: "placement_role",
  //       label: "Role",
  //       type: "text",
  //       section: "details",
  //     },
  //     {
  //       name: "placement_package",
  //       label: "Package (LPA)",
  //       type: "number",
  //       section: "details",
  //     },
  //     {
  //       name: "placement_placementType",
  //       label: "Placement Type",
  //       type: "select",
  //       section: "details",
  //       options: [
  //         { label: "On-Campus", value: "on-campus" },
  //         { label: "Off-Campus", value: "off-campus" },
  //       ],
  //     },
  //     {
  //       name: "placement_joiningDate",
  //       label: "Joining Date",
  //       type: "date",
  //       section: "details",
  //     },
  //   ],
  // },
};
