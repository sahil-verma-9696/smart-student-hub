import { useGlobalContext } from "@/contexts/global-context";
import React from "react";

export default function useAdminInstPageLogic() {
  /**************************************************************************************
   * ************** Local States ********************************************************
   * **************************************************************************************/
  const [instituteStats, setInstituteStats] = React.useState(null);
  const [recentActivities, setRecentActivities] = React.useState(null);

  const { BACKEND_URL, INSITITUTE_ID } = useGlobalContext();

  // GET INSITUTE'S STATS
  React.useEffect(() => {
    if (INSITITUTE_ID) {
      (async function getInstitueStats() {
        try {
          const res = await fetch(
            `${BACKEND_URL}/institute/${INSITITUTE_ID}/stats`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "ngrok-skip-browser-warning": "true",
              },
            }
          );
          const jsonRes = await res.json();

          setInstituteStats(jsonRes?.data);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [INSITITUTE_ID, BACKEND_URL]);

  // GET Recent Activities
  React.useEffect(() => {
    if (INSITITUTE_ID) {
      (async function getRecentActivities() {
        try {
          const res = await fetch(
            `${BACKEND_URL}/institute/${INSITITUTE_ID}/activities?createdAt=desc`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "ngrok-skip-browser-warning": "true",
              },
            }
          );
          const jsonRes = await res.json();

          console.log(jsonRes);

          setRecentActivities(jsonRes?.data);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [INSITITUTE_ID, BACKEND_URL]);

  return {
    instituteStats,
    recentActivities,
  };
}
