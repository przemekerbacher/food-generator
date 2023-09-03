import { Food } from "../../interfaces/food";
import Storage from "./storage";
import Config from "../../config.json";
class FoodStorage extends Storage<Food> {}

export default FoodStorage;

export const createFoodStorage = () => {
  return new FoodStorage({
    controller: Config.apiController,
    createAction: Config.foods.create,
    deleteAction: Config.foods.delete,
    readAction: Config.foods.read,
    updateAction: Config.foods.update,
  });
};
