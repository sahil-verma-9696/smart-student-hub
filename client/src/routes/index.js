import FacultyLayout from "@/layout/FacultyLayout";
import AdminLayout from "@/layout/AdminLayout";
import PublicLayout from "@/layout/PublicLayout";
import StudentLayout from "@/layout/StudentLayout";
import ScholarWindowPage from "@/pages/student-pages/scholar-window/page";
import FacultyDashboardPage from "@/pages/faculty-pages/faculty-dashboard";
import AdminDashboardPage from "@/pages/admin-pages/admin-dashboard";
import ApprovalPannel from "@/pages/faculty-pages/approval-pannel";
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
import FacultyProfilePage from "@/pages/faculty-pages/components/profile/page";
import StudentProfilePage from "@/pages/student-pages/components/profile/page";
import FacultySettingsPage from "@/pages/faculty-pages/Settings";
import PATHS from "@/common/PATHS";
import ShareAchivos from "@/pages/student-pages/components/profile/Social/ShareAchivos";

export default createBrowserRouter([
  /********************************************
   **************** PUBLIC ROUTES *************
   ********************************************/
  {
    path: PATHS.BASE,
    Component: PublicLayout,
    children: [],
  },

  /********************************************
   **************** STUDENT ROUTES ************
   ********************************************/
  {
    path: `/${PATHS.STUDENT.BASE}`,
    Component: StudentLayout,
    children: [
      {
        index: true,
        Component: ScholarWindowPage,
      },
      {
        path: PATHS.STUDENT.ACTIVITIES,
        Component: ActivityPageProvider,
      },
      {
        path: PATHS.STUDENT.MINDPILOT,
        Component: MindPilot,
      },
      {
        path: PATHS.STUDENT.PORTFOLIO,
        Component: PortfolioPreview,
      },
      {
        path: PATHS.STUDENT.PRIVATE_VAULT,
        Component: PrivateVault,
      },
      {
        path: PATHS.STUDENT.SHAREACHIVOS,
        Component: ShareAchivos,
      },
      {
        path: PATHS.STUDENT.SETTINGS,
        Component: Settings,
      },
      {
        path: PATHS.STUDENT.PROFILE,
        Component: StudentProfilePage,
      },
    ],
  },

  /********************************************
   **************** FACULTY ROUTES ************
   ********************************************/
  {
    path: `/${PATHS.FACULTY.BASE}`,
    Component: FacultyLayout,
    children: [
      {
        index: true,
        Component: FacultyDashboardPage,
      },
      {
        path: PATHS.FACULTY.APPROVAL,
        Component: ApprovalPannel,
      },
      {
        path: PATHS.FACULTY.PROFILE,
        Component: FacultyProfilePage,
      },
      {
        path: PATHS.FACULTY.SETTINGS,
        Component: FacultySettingsPage,
      },
    ],
  },

  /********************************************
   **************** ADMIN ROUTES ***************
   ********************************************/
  {
    path: `/${PATHS.ADMIN.BASE}`,
    Component: AdminLayout,
    children: [
      {
        index: true,
        Component: AdminDashboardPage,
      },
      {
        path: PATHS.ADMIN.STUDENT_MGMT,
        Component: StudentManagementProvider,
      },
      {
        path: PATHS.ADMIN.FACULTY_MGMT,
        Component: FacultyManagementProvider,
      },
      {
        path: PATHS.ADMIN.ACTIVITIES,
        Component: ActivitiesManagement,
      },
      {
        path: PATHS.ADMIN.ActivitiesFilterPage,
        Component: ActivitiesFilterPage,
      },
      {
        path: PATHS.ADMIN.ANALYTICS,
        Component: AdminAnalyticsPage,
      },
      {
        path: PATHS.ADMIN.INSTITUTE,
        Component: AdminInstPageProvider,
      },
      {
        path: PATHS.ADMIN.SETTINGS,
        Component: AdminSettingsPage,
      },
    ],
  },
]);
