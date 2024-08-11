import { Tag } from "~/components/design-system/tag/Tag";

export const TagPlayground = () => {
  return (
    <div className="grid gap-medium">
      <Tag label="Info tag status" tagStatus="info" />
      <Tag label="Success tag status" tagStatus="success" />
      <Tag label="Warning tag status" tagStatus="warning" />
    </div>
  );
};
