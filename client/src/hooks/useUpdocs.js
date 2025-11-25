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

    const data = await res.json();

    console.log(data);

    return data.data; // { timestamp, signature, apiKey }
  };

  // FilePond Upload Handler
  const processFile =
    (cloudName) =>
    async (fieldName, file, metadata, load, error, progress, abort) => {
      try {
        const { timestamp, signature, apiKey, cloudName, folder } =
          await getUploadSignature();

        console.log(timestamp, signature, apiKey, cloudName);

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

        load(result.data.public_id);
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
