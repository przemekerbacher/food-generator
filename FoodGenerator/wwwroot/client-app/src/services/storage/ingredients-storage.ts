import { Ingredient } from "../../interfaces/ingredient";
import Storage from "./storage";
import Config from "../../config.json";

class IngredientsStorage extends Storage<Ingredient> {}

export default IngredientsStorage;

export const createIngredientsStorage = () => {
  return new IngredientsStorage({
    controller: Config.apiController,
    createAction: Config.ingredients.create,
    deleteAction: Config.ingredients.delete,
    readAction: Config.ingredients.read,
    updateAction: Config.ingredients.update,
  });
};
