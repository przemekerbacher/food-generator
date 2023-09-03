import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  Modal,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import GeneratedFood from "../components/GeneratedFood";
import FoodGenerator, {
  Cell,
  Column,
  Row,
} from "../services/food-generator/food-generator";
import { Food } from "../interfaces/food";
import { useEffect, useRef, useState } from "react";
import FoodGrid from "../components/FoodGrid";
import CloseIcon from "@mui/icons-material/Close";
import { useImmer } from "use-immer";
import FoodStorage, {
  createFoodStorage,
} from "../services/storage/food-storage";
import IngredientsGrid from "../components/IngredientsGrid";
import { Audio } from "react-loader-spinner";
import dayjs from "dayjs";
import DateBox from "../components/DateBox";
import SavedFoodStorage from "../services/storage/saved-food-storage";
import { MeunBottom } from "../components/MenuBottom";
import { ArrowLeftIcon, ArrowRightIcon } from "@mui/x-date-pickers";
import weekday from "dayjs/plugin/weekday";
import { SavedFood, SavedFoodToSend } from "../interfaces/saved-food";
import { Ingredient } from "../interfaces/ingredient";
import { createIngredientsStorage } from "../services/storage/ingredients-storage";
import { IngredientsListItem } from "../interfaces/ingredients-list-item";
import IngredientsList from "../components/IngredientsList";
dayjs.extend(weekday);

const defaultDaysCount = 7;
const defaultStartDate = new Date();
const defaultDayNumber = 1; //1 stands for Monday

function Index() {
  const [isFoodGridOpen, setIsFoodGridopen] = useState(false);
  const [isIngredientsGridOpen, setIsIngredientsGridOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [foods, setFoods] = useState<Food[]>([]);
  const [startDate, setStatDate] = useState(
    getFirstDay(defaultStartDate, defaultDayNumber)
  );
  const [daysCount, setDaysCount] = useState(defaultDaysCount);
  const [foodGridData, setFoodGridData] = useImmer<{
    cells: Cell[];
    columns: Column[];
    rows: Row[];
  }>({
    cells: [],
    columns: [],
    rows: [],
  });
  const [snackBar, setSnackBar] = useImmer({
    open: false,
    message: "",
  });
  const [ingredientsModalOpened, setIngredientsModalOpened] = useState(false);

  const foodsRef = useRef(foods);
  const savedFoodRef = useRef<SavedFoodToSend[]>([]);
  const ingredientsRef = useRef<Ingredient[]>([]);
  const [ingredientsListItems, setIngredientsListItems] = useState<
    IngredientsListItem[]
  >([]);

  useEffect(() => {
    const items = generatIngredientsList(
      savedFoodRef.current.map((i) => i.foodId),
      foods,
      ingredientsRef.current
    );
    setIngredientsListItems(items);
  }, [savedFoodRef.current, foods]);

  useEffect(() => {
    if (foods.length > 0) {
      loadSavedFood();
    }
  }, [startDate, foods]);

  useEffect(() => {
    foodsRef.current = foods;
  }, [foods]);

  useEffect(() => {
    loadFood();
    laodIngredients();
  }, []);

  const loadFood = async () => {
    setIsLoading(true);

    const foodStorage = createFoodStorage();
    const food = await foodStorage.read();
    setFoods(food);

    setIsLoading(false);
  };
  const laodIngredients = async () => {
    setIsLoading(true);

    const ingredientsStorage = createIngredientsStorage();
    ingredientsRef.current = await ingredientsStorage.read();

    setIsLoading(false);
  };

  const generatIngredientsList = (
    foodIds: string[],
    foods: Food[],
    ingredients: Ingredient[]
  ) => {
    const ingredientsList: IngredientsListItem[] = [];
    const currentFood = foods.filter((i) => foodIds.includes(i.id));
    currentFood.forEach((food) => {
      if (food.ingredientsIds) {
        food.ingredientsIds.forEach((ingredientId) => {
          const ingredientListItem = ingredientsList.find(
            (i) => i.id === ingredientId
          );
          if (ingredientListItem) {
            ingredientListItem.count++;
          } else {
            const name = ingredients.find((i) => i.id)?.name ?? "";
            ingredientsList.push({
              count: 1,
              id: ingredientId,
              name,
            });
          }
        });
      }
    });

    return ingredientsList;
  };

  const loadSavedFood = async () => {
    setIsLoading(true);
    const endDate = dayjs(startDate)
      .add(daysCount, "day")
      .startOf("day")
      .toDate();
    const savedFoodStorage = new SavedFoodStorage();
    const savedFood = await savedFoodStorage.read(startDate, endDate);
    const foodGenerator = new FoodGenerator({
      daysCount,
      food: foodsRef.current,
      startDate,
    });

    foodGenerator.fillBySavedFood(savedFood);
    setFoodGridData((data) => {
      data.cells = foodGenerator.cells;
      data.columns = foodGenerator.columns;
      data.rows = foodGenerator.rows;
    });

    setIsLoading(false);
  };

  const generate = () => {
    const foodGenerator = new FoodGenerator({
      daysCount,
      food: foods,
      startDate,
    });
    foodGenerator.generate();

    setFoodGridData((data) => {
      data.cells = foodGenerator.cells;
      data.columns = foodGenerator.columns;
      data.rows = foodGenerator.rows;
    });
  };

  const save = async () => {
    setIsLoading(true);

    try {
      await new SavedFoodStorage().save(savedFoodRef.current);
      await loadFood();
      setSnackBar((draft) => {
        draft.open = true;
        draft.message =
          "Jedzonko zapisane. Wygeneruj listę zakupów i leć do sklepu mordeczko!";
      });
    } catch (e) {
      console.error(e);
    }

    setIsLoading(false);
  };

  const handleCreateList = () => {
    setIngredientsModalOpened(true);
  };

  function getFirstDay(date: Date, dayNumber: number): Date {
    const currentDayNumber = date.getDay();
    if (currentDayNumber === 0) {
      //for sunday I need previous week
      return dayjs(date)
        .add(-1, "day")
        .startOf("day")
        .weekday(dayNumber)
        .toDate();
    } else {
      return dayjs(date).startOf("day").weekday(dayNumber).toDate();
    }
  }

  function handleBackStartDate(): void {
    setStatDate((current) => {
      return dayjs(current).add(-daysCount, "day").toDate();
    });
  }

  function handleNextStartDate(): void {
    setStatDate((current) => {
      return dayjs(current).add(daysCount, "day").toDate();
    });
  }

  function handleFoodGridSaved(): void {
    loadFood();
  }

  return (
    <>
      <Container
        sx={{
          height: 0,
          flexGrow: 1,
          overflow: "auto",
          paddingTop: 4,
        }}
      >
        <Stack direction={"column"} spacing={3} sx={{ display: "flex" }}>
          <Typography variant="h4" textAlign={"center"}>
            Plan jedzenia na:
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton onClick={handleBackStartDate}>
              <ArrowLeftIcon />
            </IconButton>
            <DateBox value={startDate} readOnly />
            {" - "}
            <DateBox
              value={dayjs(startDate)
                .add(daysCount - 1, "day")
                .toDate()}
              readOnly
            />
            <IconButton onClick={handleNextStartDate}>
              <ArrowRightIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
              gap: 4,
            }}
          >
            {foodGridData.cells.length > 0 ? (
              <>
                <GeneratedFood
                  cells={foodGridData.cells}
                  columns={foodGridData.columns}
                  food={foods}
                  rows={foodGridData.rows}
                  onChange={(saved) => {
                    savedFoodRef.current = saved;
                  }}
                />
                <Button onClick={save}>Zapisz</Button>
              </>
            ) : null}
            <Modal
              open={isFoodGridOpen}
              onClose={() => {
                setIsFoodGridopen(false);
              }}
            >
              <Box sx={{ height: "100%" }}>
                <IconButton
                  onClick={() => setIsFoodGridopen(false)}
                  sx={{
                    position: "absolute",
                    top: 1,
                    right: 1,
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <FoodGrid onSaved={handleFoodGridSaved} />
              </Box>
            </Modal>
            <Modal
              open={isIngredientsGridOpen}
              onClose={() => {
                setIsIngredientsGridOpen(false);
              }}
            >
              <Box sx={{ height: "100%" }}>
                <IconButton
                  onClick={() => setIsIngredientsGridOpen(false)}
                  sx={{
                    position: "absolute",
                    top: 1,
                    right: 1,
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <IngredientsGrid />
              </Box>
            </Modal>
            <Modal
              open={isLoading}
              onClose={() => {
                setIsLoading(false);
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Audio
                  height="80"
                  width="80"
                  color="green"
                  ariaLabel="loading"
                />
              </Box>
            </Modal>
            <Modal
              open={ingredientsModalOpened}
              onClose={() => {
                setIngredientsModalOpened(false);
              }}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Paper
                sx={{
                  padding: 2,
                }}
              >
                <IngredientsList ingredients={ingredientsListItems} />
                <Button
                  variant="contained"
                  onClick={() => {
                    setIngredientsModalOpened(false);
                  }}
                >
                  Zamknij
                </Button>
              </Paper>
            </Modal>
          </Box>
        </Stack>
      </Container>
      <MeunBottom
        generate={generate}
        setIsFoodGridopen={setIsFoodGridopen}
        setIsIngredientsGridOpen={setIsIngredientsGridOpen}
        handleCreateList={handleCreateList}
      />
      <Snackbar
        open={snackBar.open}
        autoHideDuration={6000}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        onClose={() => {
          setSnackBar((draft) => {
            draft.open = false;
          });
        }}
      >
        <Alert severity="success">{snackBar.message}</Alert>
      </Snackbar>
    </>
  );
}

export default Index;
