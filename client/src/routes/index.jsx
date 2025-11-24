import FacultyLayout from "@/layout/FacultyLayout";
import AdminLayout from "@/layout/AdminLayout";
import PublicLayout from "@/layout/PublicLayout";
import StudentLayout from "@/layout/StudentLayout";
import { createBrowserRouter } from "react-router";
import ScholarWindowPage from "@/pages/student-scholarwindow";
import FacultyDashboardPage from "@/pages/faculty-dashboard";
import AdminDashboardPage from "@/pages/admin-dashboard";
import Quickactions from "@/components/dashboard/quickactions";
import ApprovalPannel from "@/pages/approval-pannel";
import FacultyAnalyticsPage from "@/pages/analytics";
import FacultySettings from "@/pages/FacultySettings";
import FacultyReporting from "@/pages/Reporting";

export default createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
  },
  {
    path: "/students",

    Component: StudentLayout,
    children: [
      {
        index: true,
        Component: ScholarWindowPage,
      },
    ],
  },
  {
    path: "/faculties",
    Component: FacultyLayout,
    children: [
      {
        index: true,
        Component: FacultyDashboardPage,
      },
      {
        path: "approval-pannel",
        Component: ApprovalPannel,
      },
      {
        path: "analytics",
        Component: FacultyAnalyticsPage,
      },
      {
        path: "settings",
        Component: FacultySettings,
      },
      {
        path: "reporting",
        Component: FacultyReporting,
      }
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      {
        index: true,
        Component: AdminDashboardPage,
      },
      {
        index: true,
        Component: Quickactions,
      },
    ],
  },
]);
