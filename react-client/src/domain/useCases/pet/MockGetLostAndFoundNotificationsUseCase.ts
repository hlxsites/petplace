import { LostAndFountNotification } from "../../models/pet/PetModel";
import { GetLostAndFoundNotificationsRepository } from "../../repository/pet/GetLostAndFoundNotificationsRepository";

export class MockGetLostAndFoundNotificationsUseCase
  implements GetLostAndFoundNotificationsRepository
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async query(_id: string): Promise<LostAndFountNotification[]> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      {
        date: "2023-06-28T00:00:00",
        update: "2023-06-28T00:01:00",
        status: "missing",
        id: 897464,
        note: "",
      },
      {
        date: "2023-06-28T00:10:00",
        update: "2023-06-28T00:11:00",
        status: "found",
        id: 748744,
        note: "Found by the fair market",
      },
    ];
  }
}
