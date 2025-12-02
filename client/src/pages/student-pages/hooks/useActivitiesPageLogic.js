import React from "react";
import useAuthContext from "../../../hooks/useAuthContext";

export default function useActivitiesPageLogic() {
  const [activities, setActivities] = React.useState(null);
  const [activityStats, setActivityStats] = React.useState(null);

  const { user } = useAuthContext();

  /* ----------------------------------------------------
    STEP 1: GET ACCESS TOKEN
  ---------------------------------------------------- */
  async function getAccessToken() {
    const res = await fetch(
      "http://localhost:3000/up-docs/access-token?folderName=activities-attachments"
    );
    if (!res.ok) throw new Error("Failed to get upload token");

    const data = await res.json();
    return data.data; // adjust if backend returns differently
  }

  /* ----------------------------------------------------
    STEP 2: UPLOAD FILE TO CLOUDINARY
  ---------------------------------------------------- */
  async function uploadToCloudinary(file, token) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("api_key", token.apiKey);
    formData.append("timestamp", token.timestamp);
    formData.append("signature", token.signature);
    formData.append("folder", token.folder);

    const res = await fetch(token.uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Cloudinary upload failed");

    return await res.json();
  }

  /* ----------------------------------------------------
    STEP 3: SAVE FILE METADATA TO BACKEND  (/up-docs)
  ---------------------------------------------------- */
  async function saveFileMeta(fileMeta) {
    const res = await fetch("http://localhost:3000/up-docs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fileMeta),
    });

    if (!res.ok) throw new Error("Failed to save file metadata");

    const data = await res.json();
    return data.data?.attachment; // saved resource
  }

  /* ----------------------------------------------------
    STEP 4: POST ACTIVITY  (/activities)
  ---------------------------------------------------- */
  async function postActivity(activity, filePondFiles = []) {
    try {
      // 1. get token
      const token = await getAccessToken();
      token[
        "uploadUrl"
      ] = `https://api.cloudinary.com/v1_1/${token.cloudName}/auto/upload`;

      let uploadedResources = [];

      // 2. upload each file to Cloudinary & save meta
      for (const fp of filePondFiles) {
        const file = fp.file; // FilePond gives {file, ...}

        const cloudinaryRes = await uploadToCloudinary(file, token);

        const fileMeta = {
          access_mode: cloudinaryRes.access_mode,
          asset_id: cloudinaryRes.asset_id,
          bytes: cloudinaryRes.bytes,
          createdAtCloudinary: cloudinaryRes.created_at,
          etag: cloudinaryRes.etag,
          folder: cloudinaryRes.folder,
          format: cloudinaryRes.format,
          height: cloudinaryRes.height,
          original_filename: cloudinaryRes.original_filename,
          public_id: cloudinaryRes.public_id,
          resource_type: cloudinaryRes.resource_type,
          secure_url: cloudinaryRes.secure_url,
          signature: cloudinaryRes.signature,
          tags: cloudinaryRes.tags,
          type: cloudinaryRes.type,
          url: cloudinaryRes.url,
          version_id: cloudinaryRes.version_id,
          version: cloudinaryRes.version,
          width: cloudinaryRes.width,
        };
        const savedResource = await saveFileMeta(fileMeta);
        uploadedResources.push(savedResource?._id);
      }

      // 3. final activity dto
      const dto = {
        ...activity,
        attachments: uploadedResources,
        student: user?._id,
      };

      console.log(dto, token, uploadedResources);

      // 4. post activity
      const res = await fetch("http://localhost:3000/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });

      if (!res.ok) throw new Error("Failed to post activity");

      const response = await res.json();

      // // add to local state
      setActivities((prev) => {
        return [response.data, ...(prev || [])];
      });

      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /* ----------------------------------------------------
    GET ALL ACTIVITIES OF STUDENT
  ---------------------------------------------------- */
  React.useEffect(() => {
    if (activities === null) {
      (async function getAllActivities() {
        const res = await fetch(
          `http://localhost:3000/activities?studentId=${user?._id}`
        );
        const responce = await res.json();
        setActivities(responce.data);
      })();
    }
  }, [user, activities]);

  /* ----------------------------------------------------
    GET ACTIVITIE STATS
  ---------------------------------------------------- */
  React.useEffect(() => {
    if (activities === null) {
      (async function getAllActivities() {
        const res = await fetch(
          `http://localhost:3000/activities/stats?studentId=${user?._id}`
        );
        const responce = await res.json();
        setActivityStats(responce.data);
      })();
    }
  }, [user, activities]);

  /* ----------------------------------------------------
    FILTER ACTIVITIES
  ---------------------------------------------------- */
  async function fetchFilteredActivities(filters = {}) {
    const { title = "*", status = "all", activityType = "all" } = filters;

    const params = new URLSearchParams();

    // always required
    params.set("studentId", user?._id);

    // add ONLY meaningful fields
    if (title && title !== "*") params.set("title", title);
    if (status && status !== "all") params.set("status", status);
    if (activityType && activityType !== "all")
      params.set("activityType", activityType);

    const url = `http://localhost:3000/activities?${params.toString()}`;

    const res = await fetch(url);
    const response = await res.json();
    setActivities(response.data);
  }

  return {
    activities,
    activityStats,
    setActivities,
    postActivity,
    fetchFilteredActivities,
  };
}
