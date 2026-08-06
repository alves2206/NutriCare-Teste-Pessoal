export type Nutrients = {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sodium: number;
};

export type Food = Nutrients & {
  id: string;
  name: string;
  brand?: string;
  category: string;
  referenceAmount: number;
  referenceUnit: string;
  notes?: string;
};

export type MealItem = {
  id: string;
  food: Food;
  consumedAmount: number;
  consumedUnit: string;
  calculated: Nutrients;
};

export type Meal = {
  id: string;
  date: string;
  time: string;
  type: string;
  notes?: string;
  items: MealItem[];
};

export type ProfileGoals = {
  calorieTarget: number;
  proteinTarget: number;
  carbohydrateTarget: number;
  fatTarget: number;
  fiberTarget: number;
  waterTarget: number;
};

export type WeightEntry = {
  id: string;
  date: string;
  weightKg: number;
  notes?: string;
};
