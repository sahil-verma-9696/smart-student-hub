export const initialData = {
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
  departments: [
    { id: "dept1", name: "Computer Science Department", instituteId: "" },
    { id: "dept2", name: "Electronics Department", instituteId: "" },
    { id: "dept3", name: "Mechanical Department", instituteId: "" },
    {
      id: "dept4",
      name: "Business Administration Department",
      instituteId: "",
    },
  ],
  programs: [
    {
      id: "prog1",
      name: "UG (Undergraduate)",
      instituteId: "",
      degrees: [
        {
          id: "deg1",
          name: "B.Tech",
          programId: "prog1",
          duration: 4,
          durationUnit: "Years",
          branches: [
            {
              id: "branch1",
              name: "Computer Science",
              degreeId: "deg1",
              departmentId: "dept1",
              specializations: [
                {
                  id: "spec1",
                  name: "Artificial Intelligence",
                  branchId: "branch1",
                },
                { id: "spec2", name: "Data Science", branchId: "branch1" },
              ],
            },
            {
              id: "branch2",
              name: "Electronics",
              degreeId: "deg1",
              departmentId: "dept2",
              specializations: [
                { id: "spec3", name: "VLSI Design", branchId: "branch2" },
                { id: "spec4", name: "Embedded Systems", branchId: "branch2" },
              ],
            },
          ],
          yearLevels: [
            {
              id: "year1",
              year: 1,
              degreeId: "deg1",
              semesters: [
                {
                  id: "sem1",
                  semNumber: 1,
                  yearId: "year1",
                  sections: [
                    {
                      id: "sec1",
                      name: "A",
                      seatCapacity: 60,
                      specializationId: "spec1",
                      semesterId: "sem1",
                    },
                    {
                      id: "sec2",
                      name: "B",
                      seatCapacity: 60,
                      specializationId: "spec1",
                      semesterId: "sem1",
                    },
                  ],
                },
                {
                  id: "sem2",
                  semNumber: 2,
                  yearId: "year1",
                  sections: [
                    {
                      id: "sec3",
                      name: "A",
                      seatCapacity: 60,
                      specializationId: "spec1",
                      semesterId: "sem2",
                    },
                  ],
                },
              ],
            },
            {
              id: "year2",
              year: 2,
              degreeId: "deg1",
              semesters: [
                {
                  id: "sem3",
                  semNumber: 3,
                  yearId: "year2",
                  sections: [],
                },
                {
                  id: "sem4",
                  semNumber: 4,
                  yearId: "year2",
                  sections: [],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "prog2",
      name: "PG (Postgraduate)",
      instituteId: "",
      degrees: [
        {
          id: "deg2",
          name: "M.Tech",
          programId: "prog2",
          duration: 2,
          durationUnit: "Years",
          branches: [
            {
              id: "branch3",
              name: "Computer Science",
              degreeId: "deg2",
              departmentId: "dept1",
              specializations: [
                { id: "spec5", name: "Machine Learning", branchId: "branch3" },
              ],
            },
          ],
          yearLevels: [],
        },
        {
          id: "deg3",
          name: "MBA",
          programId: "prog2",
          duration: 2,
          durationUnit: "Years",
          branches: [
            {
              id: "branch4",
              name: "Business Administration",
              degreeId: "deg3",
              departmentId: "dept4",
              specializations: [
                { id: "spec6", name: "Finance", branchId: "branch4" },
                { id: "spec7", name: "Marketing", branchId: "branch4" },
              ],
            },
          ],
          yearLevels: [],
        },
      ],
    },
  ],
  adminName: "Dr. Rajesh Kumar",
  adminEmail: "principal@nit.edu.in",
  adminPhone: "+91 9876543211",
  adminDesignation: "Principal",
  verification: {
    email: { verified: true, verifiedAt: "2024-01-15T10:30:00Z" },
    phone: { verified: false },
    adminEmail: { verified: true, verifiedAt: "2024-01-15T10:35:00Z" },
    adminPhone: { verified: false },
  },
};
