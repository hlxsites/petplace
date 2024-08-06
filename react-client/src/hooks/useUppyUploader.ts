import Uppy, { Meta, UppyFile, UploadResult } from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import "@uppy/core/dist/style.css";
import "@uppy/drag-drop/dist/style.css";
import { useCallback, useEffect, useState } from "react";

type FileUploadError = { name: string; message: string; details?: string };

export type UseUppyUploaderProps = {
  onFileAdd?: (file: UppyFile<Meta, Record<string, never>>) => void;
  onComplete?: (result: UploadResult<Meta, Record<string, never>>) => void;
  onError?: (file: FileUploadError) => void;
};

export function useUppyUploader({
  onFileAdd,
  onComplete,
  onError,
}: UseUppyUploaderProps = {}) {
  const [uppy] = useState(
    () =>
      new Uppy({
        autoProceed: false,
        restrictions: {
          maxFileSize: 10 * 1024 * 1024,
          allowedFileTypes: [
            ".png",
            ".jpg",
            ".jpeg",
            ".pdf",
            ".txt",
            ".doc",
            ".docx",
          ],
        },
      })
  );
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    uppy.use(XHRUpload, {
      endpoint: "",
    });

    if (onFileAdd) {
      uppy.on("file-added", (file) => {
        setIsUploading(true);
        onFileAdd(file);
      });
    }

    if (onComplete) {
      uppy.on("complete", (completion) => {
        setIsUploading(false);
        onComplete(completion);
      });
    }

    if (onError) {
      uppy.on("error", (error) => {
        setIsUploading(false);
        onError(error);
      });
      uppy.on("restriction-failed", (_, error) => {
        setIsUploading(false);
        onError(error);
      });
    }

    return () => uppy.destroy();
  }, [uppy, onFileAdd, onComplete, onError]);

  const handleFiles = useCallback(
    function someFunction(files: FileList) {
      Object.values(files).map((file) =>
        uppy.addFile({
          source: "input",
          name: file.name,
          type: file.type,
          data: file,
        })
      );

      if (files.length) {
        setIsUploading(true);
        // TODO: check why it fails on uploading added files
        uppy.upload().catch(function catchUppyError(error) {
          console.error("Upload error:", error);
          setIsUploading(false);
          if (onError) {
            onError(error as FileUploadError);
          }
        });
      }
    },
    [uppy, setIsUploading, onError]
  );

  return { isUploading, handleFiles, uppy };
}
