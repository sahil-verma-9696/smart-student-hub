import { useEffect, useState } from "react";
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

  // ⭐ PRELOAD FILEPOND WITH EXISTING LOGO
  useEffect(() => {
    console.log(currentLogo, "currentLogo");
    if (currentLogo) {
      setFiles([
        {
          source: currentLogo.secureUrl || currentLogo.url,
          options: {
            type: "local",
            file: {
              name: currentLogo.originalFilename || "logo.png",
              type: "image/png", // force preview detection
              size: currentLogo.bytes,
            },
          },
        },
      ]);
    }
  }, [currentLogo, onUpload]);

  return (
    <FilePond
      allowMultiple={false}
      maxFiles={1}
      files={files}
      onupdatefiles={(items) => {
        setFiles(items);

        // When removed
        if (items.length === 0) {
          onRemove();
        }
      }}
      server={server}
      acceptedFileTypes={["image/png", "image/jpeg"]}
      instantUpload={true}
      credits={false}
      labelIdle={`Drag & Drop your logo or <span class="filepond--label-action">Browse</span>`}
      onprocessfile={(error, file) => {
        if (error) return;

        const backendResponse = JSON.parse(file.serverId);
        onUpload(backendResponse?.attachment?._id);
      }}
    />
  );
}
