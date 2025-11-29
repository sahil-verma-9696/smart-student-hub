import React from "react";

export default function useStudentPannel() {
  const [students, setStudents] = React.useState(null);

  React.useEffect(() => {
    fetch("http://localhost:3000/student", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    })
      .then((res) => res.json())
      .then((jsonRes) => setStudents(jsonRes?.data))
      .catch((err) => console.log(err));
  }, []);

  return { students };
}
