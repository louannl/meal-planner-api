# Meal Planner API
<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#branches">Branches</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#postman">Postman</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#bugs-and-issues">Known bugs & issues</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#learning">Learning</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project
This is the API used for my meal-planner app, it allows users to manage their meals by giving information such as the days the meals are on, tags to identify groups of meals, and ingredients. The user can then return a shopping list, an aggregated list, of all the ingredients they will need for their weekly shop. 

Checkout the API in use by my frontend app: 
[MealPlanner App Github](https://github.com/louannl/meal-planner.git) /
[Online sample](meal-planner.louannloizou.co.uk)

Please see notes for the online example in the app github readme.

### Branches
There are three branches at current: main, rawsql, and sequelize. 
1. Main 

This is the working version used online with my frontend application.
Eventually I will merge the Sequelize branch to this branch. 

1. Rawsql

This is a snapshot of the code before I started working on the Sequelize version, there are only a few differences to the current main branch, barring the readme changes (mainly changes needed to setup the api online). 

There was a lot more work that could have gone into this version, however, I decided it would be a better use of my time learning to use sequelize.

3. Sequelize

This is the branch I am working on at current, checkout the branch readme for more information. 

I have used this opportunity to setup tests before re-factoring each section of code.

### Built With
- PostgreSQL / Sequelize*
- Node.js / Express
- Sequelize
- Docker
- Jest*

*Used on the Sequelize branch.

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites
To run this project you will need to install Node.js and NPM, checkout the NPM docs for how to download NPM [Link to NPM Docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm);
Additionally you will need to use a postgres database.

### Installation
1. Clone the repo
  ```sh
  git clone https://github.com/louannl/meal-planner-api.git
  ```
2. Install NPM packages (within the folder) - refer to getting started on how to install npm and node before this step:
  ```sh
  npm install
  ```
3. Copy .env.example and rename it to .env - Enter your postgres database details in `.env`. E.g.
  ```
  DATABASE_HOST=localhost
  ```
4. Migrate and seed the Database by running:
  ```sh
  db-migrate up
  ```
5. Run the command to start the API:
  ```sh
  npm run start
  ```

### Migrating the database (TBD)
This will create, migrate and seed the data on the database:
```
npm run db:reset
```

This will create the test database 
```
npm run db:create:test
```

### Testing
Once details are added to the .env file and the test database is created: 
```
npm run test
```

### Postman
The Postman collection is available to import from the JSON file: meal-planner.postman_collection.json.
This can be used to test the API without using the frontend application.

<!-- USAGE EXAMPLES -->
## Usage
This is designed to be used with my meal-planner react app, however you can still use this comfortably with Postman or with your own app.

The API lets you create/edit/delete meals which have details such as the day/s the meals are on, custom 'tags' and ingredients. Additionally you can add ingredients/tags separately. 

You can then fetch information on the meals or even fetch an aggregated ingredient list to make creating your weekly shopping list easier.

<!-- ROADMAP -->
## Bugs and Issues
*As a note, some issues are easily solved by using an ORM or will naturally be fixed when refactoring anyway. So some of the current issues with the app will have been solved in the sequelize branch, but are not currently in production.*

- Consistent queries and error handling:
  
  Some routes (a good example is routeHandler.js) use an earlier version of my database queries and handled errors differently to the newer routes.

  A lot of code could be replaced with smaller, simpler queries used elsewhere already, and some errors should not be thrown e.g. when the db has no data, it should still return an OK status instead of an error, no data found. 

- Testing
  
  The sequelize version uses testing as there was much more help/documentation on how to use jest with an ORM as opposed to without one. 

  JEST - Currently I run --inband - which is lame - I want to use transactions to test so my tests take a tiny tiny tiny amount of time compared to running in band. However, setting up a way to do this would take a significant amount of time. I'd eventually be able to use cls-hooked when it's no longer 'experimental'.

- User accounts / authentication 
  
  Uses the main postgres user and lacks authentication for uses, so lacks security. 

- No Transactions 
  
  No ORM, no transactions. If an error manages to get through on the creation of a meal with ingredients/days/tags for example, it could potentially still be created and stored in the database. The chances are higher with a lack of testing in place in the non-sequelize version. 

- Created_at / Updated_At
  
  These table columns are used in the sequelize version from the get go. They are useful for spotting errors and in general are good pieces of information to have for the user.

## Roadmap
- Users and Authentication
  
- DB transactions
  
  This would allow me to wrap an entire API call in a singular transaction, so if any failures happen I can roll back all of the queries.

- Custom dates instead of a set week.
  
  Remove the day table and implement dates column on the meal_days table.

- API lookup for ingredients / meals
  
  To allow users fetch meals or ingredients from a third-party api.

- Transactions as default *Sequelize

  At the time of writing, the cls-hooked library uses AsyncWrap which is unsupported by NodeJs, alternatively it uses Async-hooks which is still considered 'experimental' - so at the moment, I won't be implementing transactions as a default.

<!-- LEARNING -->
## Learning 
*Note: There can be a lot of detail here as this is a reference for myself as well as others*
- ORM
  
As using raw sql is uncommon, there was a lack of help I could find online when facing issues such as queries not returning the correct information or the migration not working (originally the migration error was due to import/require compatibility issues, then due to some sql fields being required in the migration files, which were not required when creating a postgresql database).

A lot of these issues were fixed by using ndb to debug and *guessing* roughly where the error is occurring and stepping through the functions till an issue cropped up.

- Array manipulation
  
I needed to use a lot of array manipulation to get data from the database and to process it before sending it to the frontend, so most of the computing is done within the api. 

In some cases, it was beneficial to use array manipulation instead of using multiple queries to the database, making it quicker to return data, which is a benefit of raw sql compared to an ORM.

- Require vs. Import
  
Before this I hadn't used ES6 imports. Imports required being more careful with positioning of some elements; notably with configuring the index.js file in the db folder.

- Folder Structure
  
I attempted to separate the routes from the 'business logic' in the domain folder and the database logic, as can be seen by the folder structure. 

This was fairly difficult in the beginning as initially I was just trying to test out creating the api, so you may notice some db logic doesn't go through domain but straight to the route files. However, I still found that having this logic separated made it much easier to find functions and reuse those functions down the line.