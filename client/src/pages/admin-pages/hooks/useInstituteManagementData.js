import { useGlobalContext } from "@/contexts/global-context";
import React from "react";

export default function useInstituteManagementData() {
  const [instituteDetails, setInstituteDetails] = React.useState(null);
  const { INSITITUTE_ID, BACKEND_URL } = useGlobalContext();

  // GET Institute's Data
  React.useEffect(() => {
    if (INSITITUTE_ID && !instituteDetails) {
      (async function fetchData() {
        try {
          const res = await fetch(
            `${BACKEND_URL}/institute/${INSITITUTE_ID}/institute-details`
          );

          const jsonRes = await res.json();
          setInstituteDetails(jsonRes?.data);
        } catch (error) {
          console.error("Error fetching students:", error);
        }
      })();
    }
  }, [INSITITUTE_ID, BACKEND_URL, instituteDetails]);

  // PATCH Institute's Data
  async function updateInstituteDetails(data) {
    try {
      const res = await fetch(
        `${BACKEND_URL}/institute/${INSITITUTE_ID}/institute-details`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(data),
        }
      );
      const jsonRes = await res.json();
      setInstituteDetails(jsonRes?.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }
  return {
    instituteDetails,
    setInstituteDetails,
    updateInstituteDetails
  };
}
