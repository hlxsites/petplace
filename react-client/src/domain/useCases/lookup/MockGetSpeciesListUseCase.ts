import { SpeciesModel } from "~/domain/models/lookup/LookupModel";
import { GetSpeciesListRepository } from "~/domain/repository/lookup/GetSpeciesListRepository";

export class MockGetSpeciesListUseCase implements GetSpeciesListRepository {
  query = async (): Promise<SpeciesModel[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      { id: 1, name: "Dog" },
      { id: 2, name: "Cat" },
    ];
  };
}
