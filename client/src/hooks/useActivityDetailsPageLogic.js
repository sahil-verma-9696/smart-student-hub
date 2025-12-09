import { useGlobalContext } from "@/contexts/global-context";
import React from "react";
import { useParams } from "react-router";

export default function useActivityDetailsPageLogic() {
  const [activity, setActivity] = React.useState(null);

  const { activityId } = useParams();

  const { BACKEND_URL } = useGlobalContext();

  // GET : Activity all details
  React.useEffect(() => {
    if (activityId) {
      (async function getActivityDetails() {
        try {
          const res = await fetch(`${BACKEND_URL}/activities/${activityId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          });
          const jsonRes = await res.json();
          console.log(jsonRes);
          setActivity(jsonRes?.data);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [activityId, BACKEND_URL]);
  return { activity };
}
