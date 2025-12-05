"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function useUpDocs() {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState("");

  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Get Cloudinary Signature
  const getUploadSignature = async () => {
    const res = await fetch("http://localhost:3000/up-docs/access-token", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const msg = data?.message || data?.msg || 'Failed to get upload signature';
      console.error('getUploadSignature error', msg, data);
      throw new Error(msg);
    }

    // Backend may return the payload directly or wrapped in { data: payload }
    const payload = data?.data ?? data;
    console.debug('getUploadSignature payload', payload);
    return payload; // { timestamp, signature, apiKey, cloudName, folder }
  };

  const postUpDoc = async (upDoc) => {
    const { created_at, ...payload } = upDoc || {};
    delete payload?.api_key;
    delete payload?.placeholder;
    try {
      const res = await fetch("http://localhost:3000/up-docs", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          createdAtCloudinary: created_at,
          ...payload,
        }),
        method: "POST",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        // Server uses GlobalExceptionFilter -> { data: null, error: { message, details } }
        const serverMsg = data?.error?.message || data?.message || data?.msg;
        const msg = serverMsg || "Failed to save upload metadata";
        console.error('postUpDoc server error', data);
        throw new Error(msg);
      }

      console.debug('postUpDoc: saved metadata', data);
      toast.success(data.msg || 'Uploaded');
    } catch (error) {
      toast.error(error.message || 'Upload save failed');
      console.error('postUpDoc error', error);
    }
  };

  // FilePond Upload Handler
  const processFile =
    () => async (fieldName, file, metadata, load, error, progress, abort) => {
      try {
        const { timestamp, signature, apiKey, cloudName, folder } =
          await getUploadSignature();

          console.debug('getUploadSignature result', { timestamp, signature, apiKey, cloudName, folder });

        const form = new FormData();
        form.append("file", file);
        form.append("api_key", apiKey);
        form.append("timestamp", Number(timestamp));
        form.append("signature", signature);
        form.append("folder", folder);

        const upload = axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          form,
          {
            onUploadProgress: (e) => progress(true, e.loaded, e.total),
          }
        );

        const result = await upload;
        console.debug('cloudinary upload result', result?.data);

        load(result.data.public_id);

        // persist metadata to backend
        await postUpDoc({ ...result.data });

        return result.data;
      } catch (err) {
        toast.error(err.message);
        error("Upload failed");
        console.error(err);
      }
    };

  // Submit Activity
  const handleSubmit = async () => {
    if (files.length === 0) return alert("Upload a file first!");

    const uploadedFile = files[0].serverId;

    const newActivity = {
      id: Date.now(),
      media: uploadedFile,
      description,
    };

    if (editMode) {
      setActivities((prev) =>
        prev.map((a) =>
          a.id === selectedActivity.id
            ? { ...a, media: uploadedFile, description }
            : a
        )
      );
    } else {
      setActivities((prev) => [newActivity, ...prev]);
    }

    setOpen(false);
    setFiles([]);
    setDescription("");
    setEditMode(false);
    setSelectedActivity(null);
  };

  const handleEdit = (activity) => {
    setSelectedActivity(activity);
    setDescription(activity.description);

    // Preload existing file
    setFiles([
      {
        source: activity.media,
        options: {
          type: "local",
        },
      },
    ]);

    setEditMode(true);
    setOpen(true);
  };

  return {
    // states
    open,
    setOpen,
    editMode,
    files,
    setFiles,
    description,
    setDescription,
    activities,
    handleSubmit,
    handleEdit,
    processFile,
  };
}
