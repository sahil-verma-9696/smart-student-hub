import FacultyLayout from "@/layout/FacultyLayout";
import AdminLayout from "@/layout/AdminLayout";
import PublicLayout from "@/layout/PublicLayout";
import StudentLayout from "@/layout/StudentLayout";
import ScholarWindowPage from "@/pages/student-pages/scholar-window/page";
import FacultyDashboardPage from "@/pages/faculty-pages/faculty-dashboard";
import AdminDashboardPage from "@/pages/admin-pages/components/admin-dashboard/page";
import ApprovalPannel from "@/pages/faculty-pages/approval-pannel";
import ActivitiesFilterPage from "@/pages/admin-pages/student-panel";
import AdminAnalyticsPage from "@/pages/admin-pages/admin-analytics";
import AdminSettingsPage from "@/pages/admin-pages/admin-settings";
import { createBrowserRouter } from "react-router";
import MindPilot from "@/pages/student-pages/MindPilot";
import PrivateVault from "@/pages/student-pages/PrivateVault";
import Settings from "@/pages/student-pages/Settings";
import { PortfolioPreview } from "@/pages/student-pages/portfolio/portfolio-preview";
import ActivityPageProvider from "@/pages/student-pages/provider/activity-page-provider";
import ActivitiesManagement from "@/pages/admin-pages/components/activity-management/activity-management";
import StudentManagementProvider from "@/pages/admin-pages/provider/student-management.provider";
import FacultyManagementProvider from "@/pages/admin-pages/provider/faculty-management.provider";
import InstituteManagementProvider from "@/pages/admin-pages/provider/institute-management.provider";
import ActivityTypeManagementPage from "@/pages/admin-pages/components/activity-type-management/page";
import AdminPageProvider from "@/pages/admin-pages/provider/admin-page.provider";
import Profile from "@/pages/student-pages/Profile";
import ProfilePageProvider from "@/pages/student-pages/provider/profile-page-provider";

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
        Component: ProfilePageProvider,
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
        Component: AdminPageProvider,
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
        path: "activity-types",
        Component: ActivityTypeManagementPage,
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
        Component: InstituteManagementProvider,
      },
      {
        path: "settings",
        Component: AdminSettingsPage,
      },
    ],
  },
]);
