//Meal class

const db = require("../db");
const checks = require('../routes/checks');


//GETDAY/SETDAY/GET/SETINGREDIENT
class Meal {
    constructor()
}

//'JOIN meals ON meal_ingredients.meal_id=meals.id'

//FORM structure
/*
{Meal:
    day: Required not unique
    MealName: Required not unique
    MealTag: Optional
    ingredients: Required {
        name: 
        amount: 
        unitType:
    }
    comment (not implemented yet)
}
*/
