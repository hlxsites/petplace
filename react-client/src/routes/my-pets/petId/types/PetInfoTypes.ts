import { BreedModel, SpeciesModel } from "~/domain/models/lookup/LookupModel";

export type PetInfoFormVariables = {
  breedVariables: BreedModel[];
  speciesVariables: SpeciesModel[];
};
