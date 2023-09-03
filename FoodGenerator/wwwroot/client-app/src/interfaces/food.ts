export interface Food {
  id: string;
  name: string;
  type: number;
  daysCount: number;
  ingredientsIds: string[];
}

export function isFood(object: any): object is Food {
  return "name" in object && "type" in object && "daysCount" in object;
}
