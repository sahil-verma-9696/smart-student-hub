export const FACULTY_BASE_CONFIG = {
  matchBy: "employee_code", // Unique identifier for update matching

  fields: [
    // REQUIRED FIELDS FOR BOTH ADD & CSV UPLOAD
    { key: "name", required: true, label: "Name" },
    { key: "email", required: true, label: "Email" },
    { key: "gender", required: true, label: "Gender", type: "enum", values: ["male", "female", "other"] },
    { key: "employee_code", required: true, label: "Employee Code" },

    // OPTIONAL FIELDS
    { key: "department", required: false, label: "Department" },
    { key: "designation", required: false, label: "Designation" },

    // CONTACT INFO
    { key: "phone", required: true, label: "Phone", group: "contactInfo" },
    { key: "alternatePhone", required: true, label: "Alternate Phone", group: "contactInfo" },
    { key: "address", required: true, label: "Address", group: "contactInfo" },
  ],
};
