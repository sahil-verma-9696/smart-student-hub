import React from "react";
import useAuthContext from "./useAuthContext";

export default function useGlobalData() {
  const [programs, setPrograms] = React.useState(null);
  const { user } = useAuthContext();

  const BACKEND_URL = import.meta.env.VITE_SERVER_URL;
  const INSITITUTE_ID = user?.institute?._id;

  // GET Institute's Programs
  React.useEffect(() => {
    if (INSITITUTE_ID) {
      (async function getInstituePrograms() {
        try {
          const res = await fetch(
            `${BACKEND_URL}/institute/${INSITITUTE_ID}/programs`,
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
          setPrograms(jsonRes?.data);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [BACKEND_URL, INSITITUTE_ID]);

  /****************************************************************
   * ************** MEMOIZED GLOBAL DATA  ***********************
   * ****************************************************************/
  const memoizedGlobalData = React.useMemo(() => {
    return {
      institutePrograms: programs,

      BACKEND_URL,
      INSITITUTE_ID,
    };
  }, [programs, BACKEND_URL, INSITITUTE_ID]);
  return memoizedGlobalData;
}
