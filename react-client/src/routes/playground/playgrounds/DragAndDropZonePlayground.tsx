import { useState } from "react";
import { DragAndDropZone, Icon } from "~/components/design-system";

export const DragAndDropZonePlayground = () => {
  const [message, setMessage] = useState<string | undefined>();
  const [descriptor, setDescriptor] = useState("");

  return (
    <DragAndDropZone
      handleFiles={(files) => {
        if (files[0].name !== message) return setMessage(files[0].name);
        setDescriptor("Drop a different file!");

        setTimeout(() => {
          setDescriptor("");
        }, 3000);
      }}
    >
      <div className="flex-col justify-center border p-xxxxxlarge">
        <div>
          <Icon
            display="uploadCloud"
            size={48}
            className="text-brand-main"
          />
        </div>
        {message && (
          <h4 className="text-black">You dropped the file: {message} </h4>
        )}
        <p className="text-black">{descriptor}</p>
      </div>
    </DragAndDropZone>
  );
};
