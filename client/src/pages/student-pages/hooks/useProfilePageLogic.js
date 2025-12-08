import { useGlobalContext } from "@/contexts/global-context";
import React from "react";
import toast from "react-hot-toast";

export default function useProfilePageLogic() {
  const [profileData, setProfileData] = React.useState(null);
  const { BACKEND_URL, USER_ID } = useGlobalContext();
  // GET : PROFILE DATA
  React.useEffect(() => {
    if (USER_ID) {
      (async function getProfileData() {
        try {
          const res = await fetch(`${BACKEND_URL}/student/${USER_ID}/profile`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          });
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
  }, [USER_ID, BACKEND_URL]);
  return {
    profileData,
  };
}
