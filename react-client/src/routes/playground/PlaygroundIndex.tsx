/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { useSearchParams } from "react-router-dom";

import { Button } from "~/components/design-system";
import * as ComponentsPlaygroundList from "./playgrounds";

/*
    Follow this instruction to add new component playground:
    1. Create a new file in /playgrounds folder with the name of the component you want to create a playground for.
    2. Export the component in /playgrounds/index.ts file.
*/

const ComponentsKeysList = Object.keys(ComponentsPlaygroundList);

const SELECTED_KEY = "display";

const PlaygroundIndex = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = searchParams.get(SELECTED_KEY) ?? ComponentsKeysList[0];

  // @ts-expect-error - the index.ts file in this folder exports all the Playground components
  const SelectedComponent: JSX.Element = ComponentsPlaygroundList[selected];

  return (
    <div className="flex w-full">
      <div className="flex w-[200px] flex-col gap-base p-small">
        {ComponentsKeysList.map(renderMenuItem)}
      </div>
      <div className="flex min-h-full w-full flex-col gap-base p-base">
        {/* @ts-expect-error - TS doesn't understand the hacky way we are importing the component */}
        <SelectedComponent />
      </div>
    </div>
  );

  function renderMenuItem(item: string) {
    const isSelected = item === selected;
    return (
      <Button
        key={item}
        className="text-sm"
        fullWidth
        onClick={onSelect(item)}
        variant={isSelected ? "primary" : "secondary"}
      >
        {item.replace("Playground", "")}
      </Button>
    );
  }

  function onSelect(item: string) {
    return () => {
      setSearchParams({ [SELECTED_KEY]: item });
    };
  }
};

export default PlaygroundIndex;
