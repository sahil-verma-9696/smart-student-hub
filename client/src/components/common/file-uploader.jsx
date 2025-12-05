"use client";

import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import { useState } from "react";
import useUpDocs from "@/hooks/useUpdocs";

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageExifOrientation,
  FilePondPluginFileValidateSize
);

export default function FileUploader({ onUpload }) {
  const [files, setFiles] = useState([]);

  const { processFile } = useUpDocs();

  return (
    <FilePond
      files={files}
      allowMultiple={true}
      maxFiles={5}
      onupdatefiles={setFiles}
      name="file"
      labelIdle='Drag & Drop or <span class="filepond--label-action">Browse</span>'
      server={{
        // use the hook-provided process handler which gets signature from backend
        process: processFile(),
      }}
      onprocessfile={(error, file) => {
        if (!error && file && file.serverId) {
          // serverId is set to Cloudinary public_id by processFile
          // The processFile already calls postUpDoc to persist metadata, but we still
          // notify parent with the full server response stored in file.serverResponse
          try {
            const res = file.serverResponse || file.getMetadata?.() || null;
            if (res) onUpload(res);
          } catch (e) {
            // fallback: no server response
            console.error('File upload processed, but no server response available', e);
          }
        }
      }}
    />
  );
}
