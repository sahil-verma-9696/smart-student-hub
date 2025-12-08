import { USER_ROLE } from "@/common/enum";
import { useGlobalContext } from "@/contexts/global-context";
import React from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router";

export default function useProfilePageLogic() {
  const [profileData, setProfileData] = React.useState(null);
  const { BACKEND_URL, USER_ID, USER_ROLE: userRole } = useGlobalContext();

  const { studentId } = useParams();

  // GET : PROFILE DATA
  React.useEffect(() => {
    if (USER_ID) {
      (async function getProfileData() {
        try {
          const res = await fetch(
            `${BACKEND_URL}/student/${studentId}/profile`,
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

          setProfileData(jsonRes?.data);
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Failed to fetch profile data"
          );
          console.log(error);
        }
      })();
    }
  }, [USER_ID, BACKEND_URL, userRole, studentId]);
  return {
    profileData,
  };
}
