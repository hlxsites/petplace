import { ReactNode, useEffect, useRef, useState } from "react";
import { classNames } from "~/util/styleUtil";

type DragAndDropZone = {
  children: ReactNode;
  className?: string;
  handleFiles: (files: FileList) => void;
};

export const DragAndDropZone = ({
  children,
  className,
  handleFiles,
}: DragAndDropZone) => {
  const dropRef = useRef<HTMLDivElement>(null);

  const [isDraggingOver, setIsDraggingOver] = useState(false);

  useEffect(() => {
    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
      setIsDraggingOver(true);
    };

    const handleDragLeave = (event: DragEvent) => {
      event.preventDefault();
      setIsDraggingOver(false);
    };

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      setIsDraggingOver(false);

      const files = event.dataTransfer?.files;
      if (!files?.length) return;

      handleFiles(files);
    };

    const dropZone = dropRef.current;

    dropZone?.addEventListener("dragover", handleDragOver);
    dropZone?.addEventListener("dragleave", handleDragLeave);
    dropZone?.addEventListener("drop", handleDrop);

    return () => {
      dropZone?.removeEventListener("dragover", handleDragOver);
      dropZone?.removeEventListener("dragleave", handleDragLeave);
      dropZone?.removeEventListener("drop", handleDrop);
    };
  }, [handleFiles, setIsDraggingOver]);

  return (
    <div
      className={classNames(
        "rounded-xl border-dashed",
        {
          "border-2": isDraggingOver,
        },
        className
      )}
      ref={dropRef}
    >
      {children}
    </div>
  );
};
