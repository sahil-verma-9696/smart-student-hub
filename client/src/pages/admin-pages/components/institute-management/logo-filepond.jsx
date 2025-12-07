import { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondImagePreview from "filepond-plugin-image-preview";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import { createCloudinaryFilePondServer } from "@/utils/cloudinary-filepond";

registerPlugin(FilePondImagePreview);

export function LogoFilePond({
  folderName = "institute",
  onUpload,
  onRemove,
  currentLogo,
}) {
  const [files, setFiles] = useState([]);

  const server = createCloudinaryFilePondServer(folderName);

  return (
    <FilePond
      allowMultiple={false}
      maxFiles={1}
      files={files}
      onupdatefiles={(items) => {
        setFiles(items);

        console.log("Items:", items);

        // WHEN uploaded successfully → FilePond stores serverId (public_id)
        if (items.length && items[0]?.serverId) {
          onUpload(items[0].serverId);
        }

        // WHEN removed
        if (items.length === 0) {
          onRemove();
        }
      }}
      acceptedFileTypes={["image/png", "image/jpeg"]}
      labelIdle={`Drag & Drop your logo or <span class="filepond--label-action">Browse</span>`}
      server={server}
      instantUpload={true}
      credits={false}
      onprocessfile={(error, file) => {
        if (error) return;

        const backendResponse = JSON.parse(file.serverId); // ← EXACT backend response

        onUpload(backendResponse?.attachment?._id); // ← store it
      }}
    />
  );
}
