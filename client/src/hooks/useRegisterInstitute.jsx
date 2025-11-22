import React from "react";

export default function useRegisterInstitute(instituteData) {
  /******************************************
   * variables
   ********************************************/
  const BASE_URL = "https://22ca083d4466.ngrok-free.app";
  /******************************************
   * Local State for handling api call.
   ********************************************/
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  /******************************************
   * Function to register an institute.
   ********************************************/
  async function registerInstitute() {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/auth/institute/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(instituteData),
      });

      const data = await res.json();
      setData(data);
      setLoading(false);
    } catch (err) {
      console.error("REQUEST ERROR:", err);
      setError(err);
      setLoading(false);
    }
  }

  return {
    registerInstitute,
    data,
    loading,
    error,
  };
}
