export function createCloudinaryFilePondServer(folderName = "default") {
  return {
    process: (fieldName, file, metadata, load, error, progress, abort) => {
      let aborted = false;
      const abortController = new AbortController();

      // --------------------------
      // 1. Fetch signature
      // --------------------------
      async function getSignature() {
        const res = await fetch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/up-docs/access-token?folderName=${folderName}`
        );

        const json = await res.json();
        return json.data; // { timestamp, signature, apiKey, cloudName, folder }
      }

      // --------------------------
      // 2. Upload to Cloudinary
      // --------------------------
      async function uploadToCloudinary(sig) {
        const { timestamp, signature, apiKey, cloudName, folder } = sig;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("folder", folder);

        return fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          {
            method: "POST",
            body: formData,
            signal: abortController.signal,
          }
        );
      }

      // --------------------------
      // 3. Execute upload pipeline
      // --------------------------
      (async () => {
        try {
          const sign = await getSignature();

          const uploadRes = await uploadToCloudinary(sign);

          if (!uploadRes.ok) {
            error("Cloudinary upload failed");
            return;
          }

          const cloudinaryData = await uploadRes.json();

          // FilePond success callback
          load(cloudinaryData.public_id);

          // Optional: return entire Cloudinary metadata
          return cloudinaryData;
        } catch (err) {
          if (!aborted) {
            console.error(err);
            error("Upload failed or aborted");
          }
        }
      })();

      // --------------------------
      // 4. Abort handler per file
      // --------------------------
      return {
        abort: () => {
          aborted = true;
          abortController.abort();
          abort(); // Tell FilePond upload aborted
        },
      };
    },

    // OPTIONAL: revert handler if deleting files
    revert: (uniqueFileId, load) => {
      // Call backend to delete Cloudinary file if needed
      load();
    },
  };
}
