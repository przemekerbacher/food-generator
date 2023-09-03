import Container from "@mui/material/Container";
import DataGrid, { Column } from "devextreme-react/data-grid";
import { Ingredient, isIngredient } from "../interfaces/ingredient";
import CustomStore from "devextreme/data/custom_store";
import IngredientsStorage, {
  createIngredientsStorage,
} from "../services/storage/ingredients-storage";

function IngredientsGrid() {
  const ingredientsStorage = createIngredientsStorage();
  return (
    <Container
      sx={{
        display: "flex",
        height: "100%",
        flexDirection: "column",
        paddingY: 2,
      }}
    >
      <DataGrid<Ingredient, string>
        columnHidingEnabled={true}
        dataSource={
          new CustomStore({
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
          })
        }
        editing={{
          allowAdding: true,
          allowDeleting: true,
          allowUpdating: true,
          mode: "cell",
        }}
        className="auto-grow"
      >
        <Column dataField="name" caption="Nazwa" dataType="string" />
      </DataGrid>
    </Container>
  );
}

export default IngredientsGrid;
