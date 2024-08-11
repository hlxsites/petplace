import { Button, DropdownMenu } from "~/components/design-system";

export const DropdownMenuPlayground = () => {
  return (
    <div className="flex flex-col items-center gap-base">
      <DropdownMenu
        trigger={<Button>Actions</Button>}
        items={[
          {
            icon: "add",
            label: "Add",
            onClick: () => {
              alert("add menu item onClick callback");
            },
          },
          {
            icon: "trash",
            label: "Delete",
            onClick: () => {
              alert("delete menu item onClick callback");
            },
            variant: "highlight",
          },
        ]}
      />
    </div>
  );
};
