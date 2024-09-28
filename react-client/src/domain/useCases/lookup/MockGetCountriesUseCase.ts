import { GetCountriesRepository } from "../../repository/lookup/GetCountriesRepository";

export class MockGetCountriesUseCase implements GetCountriesRepository {
  async query(): Promise<string[] | []> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return ["US", "CA"];
  }
}
