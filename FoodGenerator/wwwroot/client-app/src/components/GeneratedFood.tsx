import {
  Column as FoodColumn,
  Row as FoodRow,
  Cell as FoodCell,
} from "../services/food-generator/food-generator";
import DataGrid, { Column, Lookup } from "devextreme-react/data-grid";
import { Food } from "../interfaces/food";
import { foodTypes } from "../interfaces/food-types";
import ArrayStore from "devextreme/data/array_store";
import { SavedFood, SavedFoodToSend } from "../interfaces/saved-food";
import { useEffect } from "react";
import { Cell } from "devextreme/ui/pivot_grid";
import LocalStore from "devextreme/data/local_store";
import { v4 as uuidv4, v4 } from "uuid";
import DataSource from "devextreme/data/data_source";
import { useMediaQuery, useTheme } from "@mui/material";

type Props = {
  columns: FoodColumn[];
  rows: FoodRow[];
  food: Food[];
  cells: FoodCell[];
  onChange: (saveFoodItems: SavedFoodToSend[]) => void;
};

function GeneratedFood({ columns, food, rows, cells, onChange }: Props) {
  const theme = useTheme();
  const upSM = useMediaQuery(theme.breakpoints.up("sm"));

  const items = rows.map((generatedRow) => {
    const currentCells = cells
      .filter((i) => i.rowIndex === generatedRow.index)
      .sort((i) => i.columnIndex);
    const row: any = {};

    row["id"] = v4();
    currentCells.forEach((cell) => {
      row[`field_${cell.columnIndex}`] = cell.food?.id;
      row["type"] = cell.food?.type;
      row[`date_${cell.columnIndex}`] = cell.column.date;
    });

    return row;
  });

  const dataSource = new DataSource({
    store: new ArrayStore({
      data: items,
      key: "id",
    }),
  });

  useEffect(() => {
    const savedFood = getSavedFood(items);
    onChange(savedFood);
  }, [cells]);

  return (
    <DataGrid
      columnHidingEnabled={!upSM}
      dataSource={dataSource}
      editing={{
        allowUpdating: true,
        mode: "cell",
      }}
      key={"id"}
      onSaved={(e) => {
        const items = e.component.getDataSource().items();
        const saveFood = getSavedFood(items);
        onChange(saveFood);
      }}
    >
      <Column dataField="type" caption={"Posiłek"} allowEditing={false}>
        <Lookup dataSource={foodTypes} displayExpr={"name"} valueExpr={"id"} />
      </Column>
      {columns.map((i, index) => {
        return (
          <Column key={index} dataField={i.fieldName} caption={i.name}>
            <Lookup
              dataSource={food}
              displayExpr={"name"}
              valueExpr={"id"}
              key={"id"}
            />
          </Column>
        );
      })}
    </DataGrid>
  );

  function getSavedFood(items: any[]): SavedFoodToSend[] {
    var savedFoods: SavedFoodToSend[] = [];

    items.forEach((i) => {
      Object.keys(i)
        .filter((x) => x.includes("field_"))
        .forEach((key) => {
          const columnIndex = parseInt(key.split("_")[1]);
          const foodDate = i[`date_${columnIndex}`];
          const foodId = i[key];

          savedFoods.push({
            foodDate,
            foodId,
          });
        });
    });
    return savedFoods;
  }
}

export default GeneratedFood;
