export const instituteFormConfig = [
  /*******************************************
   * *********** Branding Information ***********
   *******************************************/
  {
    id: "branding",
    title: "Branding",
    description: "Institute logo and visual identity",
    icon: "image",
    fields: [
      {
        id: "logo",
        label: "Institute Logo",
        type: "image",
        editable: true,
        required: true,
        description: "Upload logo (PNG, JPG, max 2MB, min 200x200px)",
      },
    ],
  },

  /*******************************************
   * *********** Basic Information ***********
   *******************************************/
  {
    id: "basic-info",
    title: "Basic Information",
    description: "Core institute details (some fields are system-managed)",
    icon: "building",
    fields: [
      {
        id: "instituteId",
        label: "Institute ID",
        type: "text",
        editable: false,
        required: true,
        description: "System generated ID - cannot be changed",
      },
      {
        id: "instituteName",
        label: "Institute Name",
        type: "text",
        placeholder: "Enter institute name",
        editable: false,
        required: true,
        description: "Name cannot be changed after registration",
      },
      {
        id: "instituteCode",
        label: "Institute Code",
        type: "text",
        editable: false,
        required: true,
        description: "Official code assigned by regulatory body",
      },
      // {
      //   id: "establishedYear",
      //   label: "Established Year",
      //   type: "number",
      //   editable: false,
      //   required: true,
      // },
      // {
      //   id: "accreditationStatus",
      //   label: "Accreditation Status",
      //   type: "text",
      //   editable: false,
      //   required: true,
      //   description: "Updated by accreditation authority",
      // },
      {
        id: "instituteType",
        label: "Institute Type",
        type: "select",
        editable: false,
        required: true,
        options: [
          { value: "government", label: "Government" },
          { value: "private", label: "Private" },
          { value: "autonomous", label: "Autonomous" },
        ],
        description: "Institute Type cannot be changed after registration",
      },
    ],
  },
  /*******************************************
   * *********** Contact Information ***********
   *******************************************/
  {
    id: "contact-info",
    title: "Contact Information",
    description: "Manage contact details and verification",
    icon: "contact",
    fields: [
      {
        id: "email",
        label: "Official Email",
        type: "email",
        placeholder: "admin@institute.edu",
        editable: true,
        required: true,
        // verification: {
        //   required: true,
        //   type: "email",
        // },
        validation: {
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
        },
      },
      {
        id: "phone",
        label: "Contact Phone",
        type: "phone",
        placeholder: "+91 XXXXX XXXXX",
        editable: true,
        required: true,
        // verification: {
        //   required: true,
        //   type: "phone",
        // },
        validation: {
          pattern: "^\\+?[1-9]\\d{1,14}$",
        },
      },
      {
        id: "alternatePhone",
        label: "Alternate Phone",
        type: "phone",
        placeholder: "+91 XXXXX XXXXX",
        editable: true,
        required: false,
      },
      {
        id: "website",
        label: "Website URL",
        type: "url",
        placeholder: "https://www.institute.edu",
        editable: true,
        required: false,
      },
    ],
  },

  /*******************************************
   * *********** Address Information ***********
   *******************************************/
  {
    id: "address",
    title: "Address Details",
    description: "Physical location of the institute",
    icon: "map",
    fields: [
      {
        id: "addressLine1",
        label: "Address Line 1",
        type: "text",
        placeholder: "Building name, Street",
        editable: true,
        required: true,
      },
      {
        id: "addressLine2",
        label: "Address Line 2",
        type: "text",
        placeholder: "Area, Landmark",
        editable: true,
        required: false,
      },
      {
        id: "city",
        label: "City",
        type: "text",
        placeholder: "City name",
        editable: true,
        required: true,
      },
      {
        id: "state",
        label: "State",
        type: "select",
        editable: true,
        required: true,
        options: [
          { value: "maharashtra", label: "Maharashtra" },
          { value: "karnataka", label: "Karnataka" },
          { value: "tamilnadu", label: "Tamil Nadu" },
          { value: "delhi", label: "Delhi" },
          { value: "gujarat", label: "Gujarat" },
        ],
      },
      {
        id: "pincode",
        label: "PIN Code",
        type: "text",
        placeholder: "400001",
        editable: true,
        required: true,
        validation: {
          pattern: "^[0-9]{6}$",
        },
      },
    ],
  },
];

/*******************************************
 * *********** Academic Hierarchy ***********
 *******************************************/
export const academicHierarchyConfig = {
  programs: {
    editable: true,
    allowAdd: true,
    allowDelete: true,
  },
  degrees: {
    editable: true,
    allowAdd: true,
    allowDelete: true,
  },
  branches: {
    editable: true,
    allowAdd: true,
    allowDelete: true,
  },
  specializations: {
    editable: true,
    allowAdd: true,
    allowDelete: true,
  },
};

/*******************************************
 * *********** Primary Admin Credentials ***********
 *******************************************/
export const adminCredentialsConfig = {
  id: "admin-credentials",
  title: "Primary Admin Details",
  description: "Administrator account and credentials",
  icon: "user",
  fields: [
    {
      id: "adminName",
      label: "Admin Name",
      type: "text",
      placeholder: "Full name",
      editable: true,
      required: true,
    },
    {
      id: "adminEmail",
      label: "Admin Email",
      type: "email",
      placeholder: "admin@institute.edu",
      editable: true,
      required: true,
      // verification: {
      //   required: true,
      //   type: "email",
      // },
    },
    {
      id: "adminPhone",
      label: "Admin Phone",
      type: "phone",
      placeholder: "+91 XXXXX XXXXX",
      editable: true,
      required: true,
      // verification: {
      //   required: true,
      //   type: "phone",
      // },
    },
    {
      id: "adminDesignation",
      label: "Designation",
      type: "text",
      placeholder: "e.g., Principal, Director",
      editable: true,
      required: true,
    },
  ],
};
