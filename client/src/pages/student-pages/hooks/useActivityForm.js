import { useState, useEffect } from "react";
import useAuthContext from "../../../hooks/useAuthContext";
import { useGlobalContext } from "@/contexts/global-context";

/**
 * Custom hook for managing dynamic activity form
 * Fetches activity types and handles activity submission
 */
export default function useActivityForm() {
  const [activityTypes, setActivityTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuthContext();
  const { BACKEND_URL, INSITITUTE_ID } = useGlobalContext();

  // Fetch approved activity types for student
  useEffect(() => {
    if (user && BACKEND_URL) {
      fetchActivityTypes();
    }
  }, [user, BACKEND_URL]);

  const fetchActivityTypes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/activity-types`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch activity types");

      const response = await res.json();
      // Filter only APPROVED activity types for students
      const approvedTypes = response.data?.filter(
        (type) => type.status === "APPROVED"
      ) || [];
      
      setActivityTypes(approvedTypes);
    } catch (error) {
      console.error("Error fetching activity types:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Upload file to Cloudinary via backend
   */
  const uploadFile = async (file) => {
    try {
      // Step 1: Get upload token
      const tokenRes = await fetch(
        `${BACKEND_URL}/up-docs/access-token?folderName=activities-attachments`
      );
      if (!tokenRes.ok) throw new Error("Failed to get upload token");

      const tokenData = await tokenRes.json();
      const token = tokenData.data;

      // Step 2: Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", token.apiKey);
      formData.append("timestamp", token.timestamp);
      formData.append("signature", token.signature);
      formData.append("folder", token.folder);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${token.cloudName}/auto/upload`;
      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Cloudinary upload failed");
      const cloudinaryData = await uploadRes.json();

      // Step 3: Save metadata to backend
      const fileMeta = {
        access_mode: cloudinaryData.access_mode,
        asset_id: cloudinaryData.asset_id,
        bytes: cloudinaryData.bytes,
        createdAtCloudinary: cloudinaryData.created_at,
        etag: cloudinaryData.etag,
        folder: cloudinaryData.folder,
        format: cloudinaryData.format,
        height: cloudinaryData.height,
        original_filename: cloudinaryData.original_filename,
        public_id: cloudinaryData.public_id,
        resource_type: cloudinaryData.resource_type,
        secure_url: cloudinaryData.secure_url,
        signature: cloudinaryData.signature,
        tags: cloudinaryData.tags,
        type: cloudinaryData.type,
        url: cloudinaryData.url,
        version_id: cloudinaryData.version_id,
        version: cloudinaryData.version,
        width: cloudinaryData.width,
      };

      const metaRes = await fetch(`${BACKEND_URL}/up-docs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fileMeta),
      });

      if (!metaRes.ok) throw new Error("Failed to save file metadata");
      const metaData = await metaRes.json();
      
      return metaData.data?.attachment?._id;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  /**
   * Submit activity with dynamic details
   */
  const submitActivity = async (activityData, files = []) => {
    try {
      setSubmitting(true);

      // Upload files if any
      const attachmentIds = [];
      for (const fileObj of files) {
        const file = fileObj.file || fileObj;
        const attachmentId = await uploadFile(file);
        if (attachmentId) attachmentIds.push(attachmentId);
      }

      // Prepare payload
      const payload = {
        activityTypeId: activityData.activityTypeId,
        title: activityData.title,
        description: activityData.description || "",
        location: activityData.location,
        locationType: activityData.locationType || "Other",
        details: activityData.details || {},
        attachments: attachmentIds,
        skills: activityData.skills || [],
        creditsEarned: activityData.creditsEarned || 0,
        externalUrl: activityData.externalUrl || "",
        isPublic: activityData.isPublic || false,
      };

      console.log("Submitting activity:", payload);

      const res = await fetch(`${BACKEND_URL}/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit activity");
      }

      const response = await res.json();
      return response.data;
    } catch (error) {
      console.error("Error submitting activity:", error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    activityTypes,
    loading,
    submitting,
    submitActivity,
    refetchActivityTypes: fetchActivityTypes,
  };
}
