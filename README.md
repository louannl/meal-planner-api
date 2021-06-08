## Meal Planner API
Backend for my meal-planner project

# Features

# Usage
NPM install

# POSTMAN

# Bugs and improvements

# How to use
## Migrating the database
Ensure the .env file is completed with your database details, there 
is an example env file on the github repo - .env.example.
Next run: 
```
$ db-migrate up
```

# Learning points 

## ORM usage
I learnt a lot from not using an ORM. This largely involved having to use a lot of array manipulation to process queries as well as having to understand how queries work in SQL much better. I assume also that setting up the migrations would have been easier too.

On one hand, it is likely that my code in places will run faster than a
ORM due to precise queries; on the other, this took way too much time to implement without an ORM. So I will be working on branching off the code and implementing a ORM instead while still retaining the original code, in case I forget how to use array.map again 🙋.

## Require vs import

## Improvements
As not using an ORM is not common, there was a lack of help I could find online when facing issues such as queries not returning the correct information or the migration not working (originally due to import/require issues, then due to some required fields which wouldn't be required in sql but are when migrating). A lot of these issues were fixed by using ndb to debug and *guessing* roughly where the error is occurring and stepping through the functions till an issue cropped up.

# Tests
😭
