import { ReactNode } from "react";
import { TagBox } from "devextreme-react";
import { Ingredient, isIngredient } from "../interfaces/ingredient";
import CustomStore from "devextreme/data/custom_store";
import { createIngredientsStorage } from "../services/storage/ingredients-storage";

export function IngredientsEditor(props: any): ReactNode {
  const ingredientsStorage = createIngredientsStorage();
  const value = props.value;

  const ingredientsDatasource = new CustomStore({
    key: "id",
    load: async () => {
      return await ingredientsStorage.read();
    },
    update: async (key, data) => {
      await ingredientsStorage.update(key, data);
    },
    remove: async (key) => {
      await ingredientsStorage.delete(key);
    },
    insert: async (item) => {
      if (!isIngredient(item)) {
        throw "To nie jest składnik :( ";
      }
      return await ingredientsStorage.create(item);
    },
  });
  return (
    <TagBox
      dataSource={ingredientsDatasource}
      onValueChanged={(e) => props.setValue(e.value)}
      valueExpr={"id"}
      displayExpr={"name"}
      showSelectionControls={true}
      searchEnabled={true}
      acceptCustomValue={false}
      onSelectionChanged={props.component.updateDimensions}
      value={value}
    />
  );
}
