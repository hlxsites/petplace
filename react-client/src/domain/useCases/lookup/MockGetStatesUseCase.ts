import { CountryStateModel } from "~/domain/models/lookup/CountryStateModel";
import { GetStatesRepository } from "../../repository/lookup/GetStatesRepository";

export class MockGetStatesUseCase implements GetStatesRepository {
  async query(): Promise<CountryStateModel[]> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return [
      {
        id: "AA",
        title: "",
      },
      {
        id: "AE",
        title: "",
      },
      {
        id: "AK",
        title: "Alaska",
      },
      {
        id: "AL",
        title: "Alabama",
      },
      {
        id: "AP",
        title: "",
      },
      {
        id: "AR",
        title: "Arkansas",
      },
      {
        id: "AS",
        title: "",
      },
      {
        id: "AZ",
        title: "Arizona",
      },
      {
        id: "CA",
        title: "California",
      },
      {
        id: "CO",
        title: "Colorado",
      },
      {
        id: "CT",
        title: "Connecticut",
      },
      {
        id: "DC",
        title: "District of Columbia",
      },
      {
        id: "DE",
        title: "Delaware",
      },
      {
        id: "FL",
        title: "Florida",
      },
      {
        id: "FM",
        title: "",
      },
      {
        id: "GA",
        title: "Georgia",
      },
      {
        id: "GU",
        title: "",
      },
      {
        id: "HI",
        title: "Hawaii",
      },
      {
        id: "IA",
        title: "Iowa",
      },
      {
        id: "ID",
        title: "Idaho",
      },
      {
        id: "IL",
        title: "Illinois",
      },
      {
        id: "IN",
        title: "Indiana",
      },
      {
        id: "KS",
        title: "Kansas",
      },
      {
        id: "KY",
        title: "Kentucky",
      },
      {
        id: "LA",
        title: "Louisiana",
      },
      {
        id: "MA",
        title: "Massachusetts",
      },
      {
        id: "MD",
        title: "Maryland",
      },
      {
        id: "ME",
        title: "Maine",
      },
      {
        id: "MH",
        title: "",
      },
      {
        id: "MI",
        title: "Michigan",
      },
      {
        id: "MN",
        title: "Minnesota",
      },
      {
        id: "MO",
        title: "Missouri",
      },
      {
        id: "MP",
        title: "",
      },
      {
        id: "MS",
        title: "Mississippi",
      },
      {
        id: "MT",
        title: "Montana",
      },
      {
        id: "NC",
        title: "North Carolina",
      },
      {
        id: "ND",
        title: "North Dakota",
      },
      {
        id: "NE",
        title: "Nebraska",
      },
      {
        id: "NH",
        title: "New Hampshire",
      },
      {
        id: "NJ",
        title: "New Jersey",
      },
      {
        id: "NM",
        title: "New Mexico",
      },
      {
        id: "NV",
        title: "Nevada",
      },
      {
        id: "NY",
        title: "New York",
      },
      {
        id: "OH",
        title: "Ohio",
      },
      {
        id: "OK",
        title: "Oklahoma",
      },
      {
        id: "OR",
        title: "Oregon",
      },
      {
        id: "PA",
        title: "Pennsylvania",
      },
      {
        id: "PR",
        title: "",
      },
      {
        id: "PW",
        title: "",
      },
      {
        id: "RI",
        title: "Rhode Island",
      },
      {
        id: "SC",
        title: "South Carolina",
      },
      {
        id: "SD",
        title: "South Dakota",
      },
      {
        id: "TN",
        title: "Tennessee",
      },
      {
        id: "TX",
        title: "Texas",
      },
      {
        id: "UT",
        title: "Utah",
      },
      {
        id: "VA",
        title: "Virginia",
      },
      {
        id: "VI",
        title: "",
      },
      {
        id: "VT",
        title: "Vermont",
      },
      {
        id: "WA",
        title: "Washington",
      },
      {
        id: "WI",
        title: "Wisconsin",
      },
      {
        id: "WV",
        title: "West Virginia",
      },
      {
        id: "WY",
        title: "Wyoming",
      },
    ];
  }
}
