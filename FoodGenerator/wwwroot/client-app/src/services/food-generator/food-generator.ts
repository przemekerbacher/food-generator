import dayjs from "dayjs";
import { Food } from "../../interfaces/food";
import { FoodType } from "../../interfaces/food-type";
import { foodTypes } from "../../interfaces/food-types";
import { SavedFood } from "../../interfaces/saved-food";

interface Config {
  food: Food[];
  daysCount: number;
  startDate: Date;
}

export interface Column {
  name: string;
  fieldName: string;
  index: number;
  date: Date;
}

export interface Row extends Partial<Omit<Food, "days_count">> {
  index: number;
}

export interface Cell {
  columnIndex: number;
  rowIndex: number;
  food: Food | null;
  column: Column;
  row: Row;
}

class FoodGenerator {
  config: Config;
  columns: Column[] = [];
  rows: Row[] = [];
  cells: Cell[] = [];

  constructor(config: Config) {
    this.config = config;
  }

  createColumns() {
    const { daysCount } = this.config;
    const columns: Column[] = [];

    for (let i = 0; i < daysCount; i++) {
      var date = dayjs(this.config.startDate).add(i, "day").toDate();
      const dateText = new Intl.DateTimeFormat("pl-PL", {
        dateStyle: "full",
      }).format(date);
      columns.push({
        name: dateText,
        index: i,
        fieldName: `field_${i}`,
        date: date,
      });
    }

    return columns;
  }

  createRows() {
    const { food } = this.config;

    const distinctFoodTypesIds: number[] = Array.from(
      new Set(food.map((i) => i.type))
    );
    var allTypes = foodTypes;
    const typesPassedWithFood = allTypes.filter((i) =>
      distinctFoodTypesIds.some((x) => x === i.id)
    );

    const rows: Row[] = [];
    for (let i = 0; i < typesPassedWithFood.length; i++) {
      const foodType = typesPassedWithFood[i];
      rows.push({
        type: foodType.id,
        index: i,
      });
    }

    return rows;
  }

  createCells() {
    const { columns, rows } = this;
    const cells: Cell[] = [];
    for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
      const column = columns[columnIndex];

      for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex];

        cells.push({
          columnIndex: column.index,
          rowIndex: row.index,
          food: null,
          column,
          row,
        });
      }
    }

    return cells;
  }

  fillCells() {
    const {
      rows,
      cells,
      config: { food },
    } = this;

    rows.forEach((row) => {
      const currentCells = cells.filter((i) => i.rowIndex === row.index);

      for (let cellIndex = 0; cellIndex < currentCells.length; cellIndex++) {
        const cell = currentCells[cellIndex];

        if (!cell.food) {
          //get random food
          const randomFood = this.getRandomFood(
            food.filter((i) => i.type === row.type),
            currentCells
              .filter((i) => i.food !== null)
              .map((i) => i.food) as Food[]
          );
          //fill for future days
          const endIndex = cellIndex + randomFood.daysCount - 1;
          for (
            var startIndex = cellIndex;
            startIndex <= endIndex;
            startIndex++
          ) {
            const currentCell = currentCells[startIndex];
            if (currentCell) currentCell.food = randomFood;
          }
        }
      }
    });
  }

  getRandomFood(allItems: Food[], existing: Food[]) {
    var currentItems = allItems;
    if (allItems.length > existing.length) {
      currentItems = getMissingElements(
        allItems,
        existing.filter((i) => Boolean(i)) as Array<Food>
      );
    }
    const randomIndex = Math.floor(Math.random() * currentItems.length);
    return currentItems[randomIndex];
  }

  generate() {
    this.columns = this.createColumns();
    this.rows = this.createRows();
    this.cells = this.createCells();
    this.fillCells();
  }

  fillBySavedFood(savedFood: SavedFood[]) {
    const {
      config: { food },
    } = this;

    if (savedFood.length > 0) {
      this.columns = this.createColumns();
      this.rows = this.createRows();
      this.cells = this.createCells();
    }

    savedFood.forEach((savedItem) => {
      const curentFood = food.find((i) => i.id === savedItem.foodId);
      if (curentFood) {
        const cell = this.cells.find((cell) => {
          var savedFoodDateAsLocalTimeZone = new Date(savedItem.foodDate);

          return (
            cell.column.date.toISOString() ===
              savedFoodDateAsLocalTimeZone.toISOString() &&
            cell.row.type === curentFood.type
          );
        });

        if (cell) {
          cell.food = curentFood;
        }
      }
    });
  }
}

export default FoodGenerator;

function getMissingElements(firstArray: Food[], secondArray: Food[]): Food[] {
  const missingElements: Food[] = [];
  for (const element of firstArray) {
    if (!secondArray.some((item) => item.id === element.id)) {
      missingElements.push(element);
    }
  }

  return missingElements;
}

function getRepeatedElements(
  firstArray: FoodType[],
  secondArray: FoodType[]
): FoodType[] {
  const repeatedEleements: FoodType[] = [];

  for (const element of firstArray) {
    if (secondArray.some((item) => item.id === element.id)) {
      repeatedEleements.push(element);
    }
  }

  return repeatedEleements;
}
