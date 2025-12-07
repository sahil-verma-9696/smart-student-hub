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
      //  Upload to Own Backend
      // --------------------------
      async function postToServer(cloudinaryResponse) {
        if (!cloudinaryResponse) throw new Error("Not get cloudinary response");
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/up-docs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cloudinaryResponse),
        });
        const data = await res.json();
        return data.data;
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

          const cloudinaryRes = await uploadRes.json();

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

          const backendResponse = await postToServer(fileMeta);

          if (!backendResponse) {
            error("Backend upload failed");
            return;
          }

          // FilePond success callback
          load(JSON.stringify(backendResponse));

          // Optional: return entire Cloudinary metadata
          return;
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
