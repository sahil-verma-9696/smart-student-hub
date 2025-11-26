import FacultyLayout from "@/layout/FacultyLayout";
import AdminLayout from "@/layout/AdminLayout";
import PublicLayout from "@/layout/PublicLayout";
import StudentLayout from "@/layout/StudentLayout";
import ScholarWindowPage from "@/pages/student-pages/student-scholarwindow";
import FacultyDashboardPage from "@/pages/faculty-pages/faculty-dashboard";
import AdminDashboardPage from "@/pages/admin-pages/admin-dashboard";
import ApprovalPannel from "@/pages/faculty-pages/approval-pannel";
import AdminAnalyticsPage from "@/pages/admin-pages/admin-analytics";
import AdminSettingsPage from "@/pages/admin-pages/admin-settings";
import { createBrowserRouter } from "react-router";
import StudentPanel from "@/pages/admin-pages/student-panel";
import FacultyPanel from "@/pages/admin-pages/faculty-panel";
import profile from "@/pages/student-pages/Profile";

export default createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
  },
  {
    path: "/student",

    Component: StudentLayout,
    children: [
      {
        index: true,
        path:"dashboard",
        Component: ScholarWindowPage,
      },
      {
        path:"profile",
        Component:profile
      }
    ],
  },
  {
    path: "/faculty",
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
      // {
      //   path: "add-student",
      //   Component: AdminAddStudentsPage,
      // },
      // {
      //   path: "add-faculty",
      //   Component: AdminAddFacultyPage,
      // },
      {
        path: "students-panel",
        Component: StudentPanel,
      },
      {
        path: "faculty-panel",
        Component: FacultyPanel,
      },
      {
        path: "analytics",
        Component: AdminAnalyticsPage,
      },
      {
        path: "settings",
        Component: AdminSettingsPage,
      },
    ],
  },
]);
