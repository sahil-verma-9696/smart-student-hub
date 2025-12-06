import { useGlobalContext } from "@/contexts/global-context";
import React from "react";

export default function useStudentManagementData() {
  const [students, setStudents] = React.useState(null);
  const { INSITITUTE_ID, BACKEND_URL } = useGlobalContext();

  React.useEffect(() => {
    if (INSITITUTE_ID) {
      (async function fetchData() {
        try {
          const res = await fetch(
            `${BACKEND_URL}/institute/${INSITITUTE_ID}/students`
          );

          const jsonRes = await res.json();
          setStudents(jsonRes?.data);
        } catch (error) {
          console.error("Error fetching students:", error);
        }
      })();
    }
  }, [INSITITUTE_ID, BACKEND_URL]);
  return {
    students,
  };
}
