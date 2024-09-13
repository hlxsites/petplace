import { PetModel } from "../../models/pet/PetModel";
import { GetPetsListRepository } from "../../repository/pet/GetPetsListRepository";

export class MockGetPetsListUseCase implements GetPetsListRepository {
  async query(): Promise<PetModel[]> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        age: "Young",
        breed: "Some Dog",
        dateOfBirth: "03/05/2024",
        id: "buddy",
        img: "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg",
        isProtected: true,
        microchip: "1290",
        missingStatus: "found",
        mixedBreed: true,
        name: "Buddy",
        onboardCompleted: false,
        sex: "Male",
        spayedNeutered: false,
        species: "Dog",
        documentationStatus: "none",
        lostPetHistory: [
          {
            date: 1722300534,
            update: 1722354747,
            status: "missing",
            id: 1234567,
            note: "Lost report from submitted",
          },
          {
            date: 628021800000,
            update: 1722460747,
            status: "found",
            id: 2234567,
            note: "",
            foundedBy: {
              finderName: "Erica Wong",
              contact: [
                {
                  date: 1722430534,
                  methodContact: "Phone Call",
                  phoneNumber: "289-218-6754",
                },
                {
                  date: 1722430534,
                  methodContact: "Text Message",
                  phoneNumber: "289-218-6754",
                },
                {
                  date: 1722430534,
                  methodContact: "Email",
                  email: "dana.rayman@pethealthinc.com",
                },
              ],
            },
          },
        ],
      },
      {
        age: "Senior",
        breed: "Orange Cat",
        dateOfBirth: "07/07/2014",
        id: "lily",
        img: "https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg",
        isProtected: false,
        microchip: "8645",
        missingStatus: "missing",
        mixedBreed: false,
        name: "Lily",
        sex: "Female",
        spayedNeutered: true,
        species: "Cat",
        lostPetHistory: [
          {
            date: 1722300534,
            update: 1722354747,
            status: "missing",
            id: 1637427,
            note: "Lost report from submitted",
          },
          {
            date: 1722430534,
            update: 1722460747,
            status: "found",
            id: 2637427,
            note: "",
            foundedBy: {
              finderName: "Erica Wong",
              contact: [
                {
                  date: 1722430534,
                  methodContact: "Phone Call",
                  phoneNumber: "289-218-6754",
                },
                {
                  date: 1722430534,
                  methodContact: "Text Message",
                  phoneNumber: "289-218-6754",
                },
                {
                  date: 1722430534,
                  methodContact: "Email",
                  email: "dana.rayman@pethealthinc.com",
                },
              ],
            },
          },
          {
            date: 1722433434,
            update: 1722466747,
            status: "missing",
            id: 3637427,
            note: "Lost report from submitted",
          },
          {
            date: 1722430534,
            update: 1722460747,
            status: "found",
            id: 4637427,
            note: "",
            foundedBy: null,
          },
          {
            date: 1722433434,
            update: 1722466747,
            status: "missing",
            id: 5637427,
            note: "Lost report from submitted",
          },
          {
            date: 6,
            update: 1722460747,
            status: "found",
            id: 6637427,
            note: "",
          },
          {
            date: 7,
            update: 1722466747,
            status: "missing",
            id: 7637427,
            note: "Lost report from submitted",
          },
        ],
      },
      {
        breed: "Flufy dog",
        id: "charlie",
        img: "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2023/07/top-20-small-dog-breeds.jpeg.jpg",
        isProtected: true,
        microchip: "3856",
        missingStatus: "found",
        name: "Charlie",
        sex: "Male",
        spayedNeutered: true,
        species: "Dog",
        lostPetHistory: [],
      },
    ];
  }
}
