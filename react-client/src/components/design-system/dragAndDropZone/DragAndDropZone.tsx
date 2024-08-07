import { ReactNode, useEffect, useRef } from "react";
import { classNames } from "~/util/styleUtil";

type DragAndDropZone = {
  children: ReactNode;
  className?: string;
  dragStyles?: string;
  handleFiles: (files: FileList) => void;
};

export const DragAndDropZone = ({
  children,
  className,
  dragStyles = "border-2",
  handleFiles,
}: DragAndDropZone) => {
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
      dropRef.current?.classList.add(dragStyles);
    };

    const handleDragLeave = (event: DragEvent) => {
      event.preventDefault();
      dropRef.current?.classList.remove(dragStyles);
    };

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      dropRef.current?.classList.remove(dragStyles);
      const files = event.dataTransfer?.files;
      if (!files || !files.length) return;

      handleFiles(files);
    };

    const dropZone = dropRef.current;

    if (dropZone) {
      dropZone.addEventListener("dragover", handleDragOver);
      dropZone.addEventListener("dragleave", handleDragLeave);
      dropZone.addEventListener("drop", handleDrop);
    }

    return () => {
      if (dropZone) {
        dropZone.removeEventListener("dragover", handleDragOver);
        dropZone.removeEventListener("dragleave", handleDragLeave);
        dropZone.removeEventListener("drop", handleDrop);
      }
    };
  }, [dragStyles, handleFiles]);

  return (
    <div
      ref={dropRef}
      className={classNames("rounded-xl border-dashed", className)}
    >
      {children}
    </div>
  );
};
