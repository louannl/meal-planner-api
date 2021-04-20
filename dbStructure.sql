CREATE TABLE IF NOT EXISTS meals (
   id serial PRIMARY KEY,
   name VARCHAR(50) UNIQUE NOT NULL,
);

CREATE TABLE IF NOT EXISTS unit_types (
	id serial PRIMARY KEY,
	name VARCHAR(20) UNIQUE NOT NULL,
	symbol VARCHAR(5) UNIQUE NOT NULL.
);

CREATE TABLE IF NOT EXISTS ingredients (
	id serial PRIMARY KEY,
	name VARCHAR(50) UNIQUE NOT NULL,
);

CREATE TABLE IF NOT EXISTS days (
    id serial PRIMARY KEY,
    name VARCHAR(10) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS meal_ingredients (
    id serial PRIMARY KEY,
    meal_id INT NOT NULL,
    FOREIGN KEY (meal_id)
    	REFERENCES meals (id),
	ingredient_id INT NOT NULL,
    FOREIGN KEY (ingredient_id)
    	REFERENCES ingredients (id),
	amount INT NOT NULL,
	unit_type_id INT NOT NULL,
    FOREIGN KEY (unit_type_id)
    	REFERENCES unit_types (id),
    
);

CREATE TABLE IF NOT EXISTS tags (
	id serial PRIMARY KEY,
	name VARCHAR(50) UNIQUE NOT NULL,
);

CREATE TABLE IF NOT EXISTS meal_tags (
	id serial PRIMARY KEY,
	meal_id INT NOT NULL,
    FOREIGN KEY (meal_id)
    	REFERENCES meals (id),
	tag_id INT,
    FOREIGN KEY (tag_id)
    	REFERENCES tags (id)
);

CREATE TABLE IF NOT EXISTS day_meals (
	id serial PRIMARY KEY,
	meal_id INT NOT NULL,
    FOREIGN KEY (meal_id)
    	REFERENCES meals (id),
	day_id INT NOT NULL,
    FOREIGN KEY (day_id)
    	REFERENCES days (id),
);

-- "meta" data

INSERT INTO days(name) 
VALUES ('Monday'), ('Tuesday'), ('Wednesday'), ('Thursday'), ('Friday'), ('Saturday'), ('Sunday');

INSERT INTO unit_types(name, symbol)
VALUES ('grams', 'g'), ('millilitres', 'ml'), ('Amount', 'Amo.'), ('teaspoon', 'tsp'), ('tablespoon', 'tbsp'), ('pinch', 'pinch')