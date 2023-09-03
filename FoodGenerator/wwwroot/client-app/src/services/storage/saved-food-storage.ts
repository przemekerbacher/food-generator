import axios, { Axios } from "axios";
import { SavedFood, SavedFoodToSend } from "../../interfaces/saved-food";
import { Food } from "../../interfaces/food";

class SavedFoodStorage {
  api: Axios;
  constructor() {
    this.api = axios.create({
      baseURL: `https://localhost:44331/api`,
    });
  }
  async read(startDate: Date, endDate: Date) {
    const result = await this.api.get<SavedFood[]>("readsavedfood", {
      params: {
        startDate,
        endDate,
      },
    });

    return result.data;
  }

  async save(foods: Array<SavedFoodToSend>) {
    await this.api.post<SavedFood[]>("SaveFood", foods);
  }
}

export default SavedFoodStorage;
