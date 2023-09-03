import { Food } from "./food";

export type SavedFood = {
  id: string;
  foodDate: string;
  foodId: string;
  food: Food;
};

export type SavedFoodToSend = {
  foodDate: Date;
  foodId: string;
};
