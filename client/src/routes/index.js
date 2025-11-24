import FacultyLayout from "@/layout/FacultyLayout";
import AdminLayout from "@/layout/AdminLayout";
import PublicLayout from "@/layout/PublicLayout";
import StudentLayout from "@/layout/StudentLayout";
import ScholarWindowPage from "@/pages/student-pages/student-scholarwindow";
import FacultyDashboardPage from "@/pages/faculty-pages/faculty-dashboard";
import AdminDashboardPage from "@/pages/admin-pages/admin-dashboard";
import ApprovalPannel from "@/pages/faculty-pages/approval-pannel";
import AdminAddStudentsPage from "@/pages/admin-pages/add-students";
import AdminAddFacultyPage from "@/pages/admin-pages/add-faculty";
import ActivitiesFilterPage from "@/pages/admin-pages/student-panel";
import AdminAnalyticsPage from "@/pages/admin-pages/admin-analytics";
import AdminSettingsPage from "@/pages/admin-pages/admin-settings";
import { createBrowserRouter } from "react-router";

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
        path: "add-student",
        Component: AdminAddStudentsPage,
      },
      {
        path: "add-faculty",
        Component: AdminAddFacultyPage,
      },
      {
        path: "students-panel",
        Component: ActivitiesFilterPage,
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
