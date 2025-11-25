"use client";

import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import { useState } from "react";

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageExifOrientation,
  FilePondPluginFileValidateSize
);

export default function FileUploader({ onUpload }) {
  const [files, setFiles] = useState([]);

  return (
    <FilePond
      files={files}
      allowMultiple={true}
      maxFiles={5}
      onupdatefiles={setFiles}
      name="file"
      labelIdle='Drag & Drop or <span class="filepond--label-action">Browse</span>'
      server={{
        process: {
          url: `https://api.cloudinary.com/v1_1/dfqdx3ieb/upload`,
          method: "POST",
          withCredentials: false,
          headers: {},
          timeout: 7000,

          onload: (response) => {
            const res = JSON.parse(response);
            onUpload({
              url: res.secure_url,
              public_id: res.public_id,
              resource_type: res.resource_type,
            });
            return res.public_id; // filePond unique id
          },

          ondata: (formData) => {
            formData.append("upload_preset", "unsigned_upload");
            return formData;
          },
        },
      }}
    />
  );
}
