import FacultyLayout from "@/layout/FacultyLayout";
import AdminLayout from "@/layout/AdminLayout";
import PublicLayout from "@/layout/PublicLayout";
import StudentLayout from "@/layout/StudentLayout";
import ScholarWindowPage from "@/pages/student-pages/scholar-window/page";
import FacultyDashboardPage from "@/pages/faculty-pages/faculty-dashboard";
import AdminDashboardPage from "@/pages/admin-pages/admin-dashboard";
import ApprovalPannel from "@/pages/faculty-pages/approval-pannel";
import AdminAddStudentsPage from "@/pages/admin-pages/add-students";
import AdminAddFacultyPage from "@/pages/admin-pages/add-faculty";
import ActivitiesFilterPage from "@/pages/admin-pages/student-panel";
import AdminAnalyticsPage from "@/pages/admin-pages/admin-analytics";
import AdminSettingsPage from "@/pages/admin-pages/admin-settings";
import { createBrowserRouter } from "react-router";
import MindPilot from "@/pages/student-pages/MindPilot";
import PrivateVault from "@/pages/student-pages/PrivateVault";
import Settings from "@/pages/student-pages/Settings";
import { PortfolioPreview } from "@/pages/student-pages/portfolio/portfolio-preview";
import ActivityPageProvider from "@/providers/activity-page-provider";
import ActivitiesManagement from "@/pages/admin-pages/components/activity-management/activity-management";
import AdminInstPageProvider from "@/pages/admin-pages/provider/admin-inst.provider";
import StudentManagementProvider from "@/pages/admin-pages/provider/student-management.provider";
import FacultyManagementProvider from "@/pages/admin-pages/provider/faculty-management.provider";

export default createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    /***********************************************************************
     * *********************** Public Routes *****************************
     * ***********************************************************************/
    children: [],
  },
  {
    path: "/student",
    Component: StudentLayout,
    /***********************************************************************
     * *********************** Student Routes *****************************
     * ***********************************************************************/
    children: [
      {
        index: true,
        Component: ScholarWindowPage,
      },
      {
        path: "activities",
        Component: ActivityPageProvider,
      },
      {
        path: "mind-piolet",
        Component: MindPilot,
      },
      {
        path: "fastfolo",
        Component: PortfolioPreview,
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
        path: "profile",
        Component: Settings,
      },
    ],
  },
  {
    path: "/faculty",
    Component: FacultyLayout,
    /***********************************************************************
     * *********************** Faculty Routes *****************************
     * ***********************************************************************/
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
    /***********************************************************************
     * *********************** Admin Routes *****************************
     * ***********************************************************************/
    children: [
      {
        index: true,
        Component: AdminDashboardPage,
      },
      {
        path: "student-management",
        Component: StudentManagementProvider,
      },
      {
        path: "faculty-management",
        Component: FacultyManagementProvider,
      },
      {
        path: "activities",
        Component: ActivitiesManagement,
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
        path: "institue",
        Component: AdminInstPageProvider,
      },
      {
        path: "settings",
        Component: AdminSettingsPage,
      },
    ],
  },
]);
