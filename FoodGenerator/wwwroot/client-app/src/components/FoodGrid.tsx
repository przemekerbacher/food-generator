import { Container } from "@mui/material";
import DataGrid, {
  Button,
  Column,
  FilterRow,
  HeaderFilter,
  Lookup,
  SearchPanel,
} from "devextreme-react/data-grid";
import { foodTypes } from "../interfaces/food-types";
import CustomStore from "devextreme/data/custom_store";
import { Food, isFood } from "../interfaces/food";
import { isIngredient } from "../interfaces/ingredient";
import { IngredientsEditor } from "./IngredientsEditor";
import { createFoodStorage } from "../services/storage/food-storage";
import { createIngredientsStorage } from "../services/storage/ingredients-storage";

type Props = {
  onSaved?: () => void;
};

function FoodGrid({ onSaved }: Props) {
  const foodStorage = createFoodStorage();
  const ingredientsStorage = createIngredientsStorage();
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
    <Container
      sx={{
        display: "flex",
        height: "100%",
        flexDirection: "column",
        paddingY: 2,
      }}
    >
      <DataGrid<Food, string>
        columnHidingEnabled={true}
        dataSource={
          new CustomStore({
            key: "id",
            load: async () => {
              return await foodStorage.read();
            },
            update: async (key, data) => {
              await foodStorage.update(key, data);
            },
            remove: async (key) => {
              await foodStorage.delete(key);
            },
            insert: async (item) => {
              if (!isFood(item)) {
                throw "To nie jest jedzonko :( ";
              }
              return await foodStorage.create(item);
            },
          })
        }
        editing={{
          allowAdding: true,
          allowDeleting: true,
          allowUpdating: true,
          mode: "form",
        }}
        className="auto-grow"
        onRowUpdating={(options) => {
          options.newData = { ...options.oldData, ...options.newData };
        }}
        onInitNewRow={(e) => {
          e.data.daysCount = 1;
          e.data.type = foodTypes[0].id;
        }}
        onSaved={onSaved}
      >
        <FilterRow visible={true} />
        <HeaderFilter visible={true} />
        <SearchPanel visible={true} width={240} />
        <Column
          dataField="name"
          caption="Nazwa"
          dataType="string"
          sortIndex={0}
        />
        <Column dataField="type" caption="Rodzaj" groupIndex={0}>
          <Lookup dataSource={foodTypes} displayExpr="name" valueExpr="id" />
        </Column>
        <Column dataField="daysCount" caption="Liczba dni" dataType="number" />
        <Column
          dataField="ingredientsIds"
          caption="Składniki"
          editCellRender={IngredientsEditor}
          cellTemplate={(container, options) => {
            const text = (options.value || [])
              .map((element: string) => {
                if (options.column.lookup?.calculateCellValue) {
                  return options.column.lookup.calculateCellValue(element);
                } else {
                  return null;
                }
              })
              .join(", ");
            container.textContent = text || "ni ma";
            container.title = text;
          }}
        >
          <Lookup
            dataSource={ingredientsDatasource}
            valueExpr="id"
            displayExpr="name"
          />
        </Column>
        <Column type="buttons">
          <Button name="save" />
          <Button name="edit" />
          <Button name="delete" />
        </Column>
      </DataGrid>
    </Container>
  );
}

export default FoodGrid;
