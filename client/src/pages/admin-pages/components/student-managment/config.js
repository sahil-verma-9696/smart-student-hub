export const STUDENT_BASE_CONFIG = {
    matchBy: "roll_number", // Unique identifier for update matching
  
    fields: [
      // REQUIRED FIELDS FOR BOTH ADD & CSV UPLOAD
      { key: "name", required: true, label: "Name" },
      { key: "email", required: true, label: "Email" },
      { key: "gender", required: true, label: "Gender", type: "enum", values: ["male", "female", "other"] },
      { key: "roll_number", required: true, label: "Roll Number" },
  
      // CONTACT INFO
      { key: "phone", required: true, label: "Phone", group: "contactInfo" },
      { key: "alternatePhone", required: true, label: "Alternate Phone", group: "contactInfo" },
      { key: "address", required: true, label: "Address", group: "contactInfo" },
  
      // OPTIONAL EXTRA FIELDS (ADD ANYTHING HERE)
      // { key: "fatherName", label: "Father Name" },
      // { key: "motherName", label: "Mother Name" },
      // { key: "department", label: "Department" },
      // { key: "year", label: "Year" },
    ],
  };
  