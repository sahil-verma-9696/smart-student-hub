"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import useUpDocs from "@/hooks/useUpdocs";

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageExifOrientation,
  FilePondPluginFileValidateSize
);

 const UpDocs = () => {
  const cloudName = "dfqdx3ieb";

  const {
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
  } = useUpDocs();

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">Your Activities</h2>
        <Button onClick={() => setOpen(true)}>Add New Activity</Button>
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editMode ? "Edit Activity" : "Add Activity"}
            </DialogTitle>
          </DialogHeader>

          <div className="modal-scroll space-y-4">
            {/* FilePond */}
            <FilePond
              files={files}
              onupdatefiles={setFiles}
              allowMultiple={false}
              maxFiles={1}
              name="file"
              allowRevert={true}
              allowProcess={true}
              instantUpload={false}
              server={{
                process: processFile(),
                revert: async (uniqueFileId, load) => {
                  // you can add Cloudinary delete here too
                  load();
                },
              }}
              labelIdle='Drag & Drop or <span class="filepond--label-action">Browse</span>'
            />

            {/* Description */}
            <Textarea
              placeholder="Enter description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button className="w-full mt-3" onClick={handleSubmit}>
            {editMode ? "Update" : "Upload"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Activities */}
      <div className="mt-8 space-y-4">
        {activities.map((act) => (
          <div
            key={act.id}
            className="border p-4 rounded-lg shadow-sm bg-white flex items-start justify-between"
          >
            <div>
              <p className="font-medium mb-2">{act.description}</p>

              <img
                src={`https://res.cloudinary.com/${cloudName}/image/upload/${act.media}`}
                className="w-40 rounded-md"
              />
            </div>

            <Button variant="outline" onClick={() => handleEdit(act)}>
              Edit
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpDocs;