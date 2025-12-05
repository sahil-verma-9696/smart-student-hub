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
import AdminProgramsPage from "@/pages/admin-pages/add-programs";
import ActivitiesFilterPage from "@/pages/admin-pages/student-panel";
import AdminAnalyticsPage from "@/pages/admin-pages/admin-analytics";
import AdminSettingsPage from "@/pages/admin-pages/admin-settings";
import FacultyAssignmentsPage from "@/pages/admin-pages/faculty-assignments";
import AddActivityTypePage from "@/pages/admin-pages/add-activity-type";
import ActivityAssignmentManagement from "@/pages/admin-pages/activity-assignment-management";
import ActivityTypeManagement from "@/pages/admin-pages/activity-type-management";
import { createBrowserRouter } from "react-router";
import { UpDocs } from "@/pages/student-pages/UpDocs";
import PortfolioPage from "@/pages/student-pages/portfolio";
import MindPilot from "@/pages/student-pages/MindPilot";
import ShareAchivos from "@/pages/student-pages/ShareAchivos";
import PrivateVault from "@/pages/student-pages/PrivateVault";
import Settings from "@/pages/student-pages/Settings";
import { IntegrationOverview } from "@/pages/student-pages/integrations/integration-overview";
import { PortfolioPreview } from "@/pages/student-pages/portfolio/portfolio-preview";

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
        Component: ScholarWindowPage,
      },
      {
        path: "updocs",
        Component: UpDocs,
      },
      {
        path: "fastfolo",
        Component: PortfolioPreview,
      },
      {
        path: "mind-piolet",
        Component: MindPilot,
      },
      {
        path: "share-achivos",
        Component: ShareAchivos,
      },
      {
        path: "private-vault",
        Component: PrivateVault,
      },
      {
        path: "setting",
        Component: Settings,
      },
      {
        path: "social-integrations",
        Component: IntegrationOverview,
      },
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
      {
        path: "add-student",
        Component: AdminAddStudentsPage,
      },
      {
        path: "add-faculty",
        Component: AdminAddFacultyPage,
      },
      {
        path: "faculty-assignments",
        Component: FacultyAssignmentsPage,
      },
      {
        path: "programs",
        Component: AdminProgramsPage,
      },
      {
        path: "add-activity-type",
        Component: AddActivityTypePage,
      },
      {
        path: "activity-type-management",
        Component: ActivityTypeManagement,
      },
      {
        path: "activity-assignment-management",
        Component: ActivityAssignmentManagement,
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
