import { BreedModel } from "~/domain/models/lookup/LookupModel";
import { GetBreedListRepository } from "~/domain/repository/lookup/GetBreedListRepository";

export class MockGetBreedListUseCase implements GetBreedListRepository {
  query = async (): Promise<BreedModel[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      { id: 1, name: "Poodle" },
      { id: 2, name: "Golden Retriever" },
      { id: 3, name: "Labrador" },
      { id: 4, name: "Pug" },
      { id: 5, name: "Beagle" },
    ];
  };
}
