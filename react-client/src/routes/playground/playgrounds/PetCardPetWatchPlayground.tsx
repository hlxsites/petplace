import { useState } from "react";
import { Button, Drawer } from "~/components/design-system";
import { PetCardPetWatch } from "~/components/Pet/PetCardPetWatch";

export const PetCardPetWatchPlayground = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open drawer to 24PetWatch</Button>
      <Drawer
        ariaLabel="petWatch"
        id="petWatchPlayground"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <PetCardPetWatch />
      </Drawer>
    </div>
  );
};
