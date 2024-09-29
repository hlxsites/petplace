import { GetStatesRepository } from "../../repository/lookup/GetStatesRepository";

export class MockGetStatesUseCase implements GetStatesRepository {
  async query(): Promise<string[]> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      "Alberta",
      "British Columbia",
      "Manitoba",
      "New Brunswick",
      "Newfoundland and Labrador",
      "Nova Scotia",
      "Northwest Territories",
      "Nunavut",
      "Ontario",
      "Prince Edward Island",
      "Quebec",
      "Saskatchewan",
      "Yukon",
    ];
  }
}
