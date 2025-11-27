import React from "react";

export default function useActivitiesPage() {
  /***********************************
   ************ Local States **********
   ***********************************/
  const [activities, setActivities] = React.useState(null);

  /***********************************
   ************ Functions ************
   ***********************************/

  /***********************************
   ************ UseEffects ************
   ***********************************/

  /*********************
   * Get all activities
   ********************/
  React.useEffect(() => {
    (async function getAllActivities() {
      const res = await fetch("http://localhost:3000/activities");
      const responce = await res.json();
      setActivities(responce.data);
    })();
  }, []);

  return {
    activities,
    setActivities,
  };
}
