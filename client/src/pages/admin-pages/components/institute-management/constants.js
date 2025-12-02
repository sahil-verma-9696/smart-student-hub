export const initialData = {
  // ⬇⬇ YOUR SAME INITIAL DATA KEPT EXACT
  instituteId: "INST-2024-001234",
  instituteName: "National Institute of Technology",
  instituteCode: "NIT-KA-001",
  establishedYear: 1960,
  accreditationStatus: "NAAC A++",
  instituteType: "government",
  email: "admin@nit.edu.in",
  phone: "+91 9876543210",
  alternatePhone: "",
  website: "https://www.nit.edu.in",
  addressLine1: "NH 48, Innovation Park",
  addressLine2: "Tech District",
  city: "Bangalore",
  state: "karnataka",
  pincode: "560001",
  logo: "",
  programs: [
    {
      id: "prog1",
      name: "Engineering",
      degrees: [
        {
          id: "deg1",
          name: "B.Tech",
          duration: "4 Years",
          branches: [
            {
              id: "branch1",
              name: "Computer Science",
              specializations: [
                { id: "spec1", name: "Artificial Intelligence" },
                { id: "spec2", name: "Data Science" },
              ],
            },
            {
              id: "branch2",
              name: "Electronics",
              specializations: [
                { id: "spec3", name: "VLSI Design" },
                { id: "spec4", name: "Embedded Systems" },
              ],
            },
          ],
        },
        {
          id: "deg2",
          name: "M.Tech",
          duration: "2 Years",
          branches: [
            {
              id: "branch3",
              name: "Computer Science",
              specializations: [{ id: "spec5", name: "Machine Learning" }],
            },
          ],
        },
      ],
    },
    {
      id: "prog2",
      name: "Management",
      degrees: [
        {
          id: "deg3",
          name: "MBA",
          duration: "2 Years",
          branches: [
            {
              id: "branch4",
              name: "Business Administration",
              specializations: [
                { id: "spec6", name: "Finance" },
                { id: "spec7", name: "Marketing" },
              ],
            },
          ],
        },
      ],
    },
  ],
  adminName: "Dr. Dev",
  adminEmail: "principal@nit.edu.in",
  adminPhone: "+91 9876543211",
  adminDesignation: "Dean",
  verification: {
    email: { verified: true, verifiedAt: "2024-01-15T10:30:00Z" },
    phone: { verified: false },
    adminEmail: { verified: true, verifiedAt: "2024-01-15T10:35:00Z" },
    adminPhone: { verified: false },
  },
};
