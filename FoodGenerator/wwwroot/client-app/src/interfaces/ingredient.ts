export type Ingredient = {
  id: string;
  name: string;
};

export function isIngredient(object: any): object is Ingredient {
  return "name" in object;
}
