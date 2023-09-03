import { List, ListItem, Typography } from "@mui/material";
import { IngredientsListItem } from "../interfaces/ingredients-list-item";

export type Props = {
  ingredients: IngredientsListItem[];
};

function IngredientsList({ ingredients }: Props) {
  return (
    <List>
      {ingredients.map((i) => {
        return (
          <ListItem key={i.id}>
            <Typography>
              {i.count} x {i.name}
            </Typography>
          </ListItem>
        );
      })}
    </List>
  );
}

export default IngredientsList;
