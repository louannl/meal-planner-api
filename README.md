# Meal Planner API
<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
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
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#bugs-and-issues">Bugs & Issues</a></li>
    <li><a href="#learning">Learning</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project
This is the API used for my meal-planner app, it allows users to manage their meals by giving information such as the 
days the meals are on, tags to identify groups of meals, and ingredients. 
The user can then return a shopping list, an aggregated list, of all the ingredients they 
will need for their weekly shop.

Checkout the API in use by my frontend app: 
[Meal Planner - GitHub](https://github.com/louannl/meal-planner.git)

### Built With
- PostgreSQL / ~~Sequelize~~ Prisma
- Node.js / Express
- Docker
- Jest

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites
To run this project you will need to install Node.js and NPM, checkout the NPM docs for how to download NPM 
[Link to NPM Docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm);

### Installation
1. Clone the repo
  ```sh
  git clone https://github.com/louannl/meal-planner-api.git
  ```
2. Install NPM packages (optional)
  ```sh
  npm install
  ```
3. Set up your containers and volumes using:
  ```sh
  docker-compose up
  ```
4. Use bash to interact within the container then run migrations/seeds etc.
  ```sh
  docker container exec -it meal_planner_service bash
  ```
5. Run migrations and seeding within the container:
  ```sh
  npm run db:migrate
  npm run db:seed
  npm run db:reset
  ```

### Testing
Note: Tests are run in the root of the project. **Not** the docker container.
```sh
npm run test
```
*pretest is set up to reset the test db on every run.

### Postman
The Postman collection is available to import from the JSON file: meal-planner.postman_collection.json.

This can be used to test the API without using the frontend application.

<!-- USAGE EXAMPLES -->
## Usage
This is designed to be used with my meal-planner react app, however you can still use this comfortably with Postman or with your own app.

The API lets you create/edit/delete meals which have details such as the day/s the meals are on, custom 'tags' and ingredients. Additionally you can add ingredients/tags separately. 

You can then fetch information on the meals or even fetch an aggregated ingredient list to make creating your weekly shopping list easier.

## Roadmap
- Users and Authentication
  
- Utilise DB transactions in testing
  - Will allow for quicker feature tests by allowing me to isolate the tests from each other.

- Custom dates instead of a set week.
  - Remove the day table and implement dates column on the meal_days table or something similar.

- 3rd Party API lookup for ingredients / meals
  - To allow users fetch meals or ingredients from a third-party api.

<!-- BUGS AND ISSUES -->
## Bugs and Issues
*As a note, I've started adding newer issues to the repo, instead of having them lie here to die.
- Consistent queries and error handling:
  - Separate out db queries and re-use similar queries where I can.
  - Also store meal/ingredients/tags etc. names as case-sensitive, which is a bit annoying when 
  you get duplicates.
  - Error handling is also not consistent, and some errors are not dynamic and could be partially misleading
    e.g. try updating a meal with an invalid ingredient.

- Testing
  - Currently I use --run-in-band to avoid issues with testing select queries, this can be
    safely removed once I make full use of transactions.
  - Also, my tests were created eons ago, when I didn't really understand testing very well, so
    although they have definitely helped when adding sequelize then switching to prisma. They could
    be improved upon.
  - Also missing tests in some areas :'(

- User accounts / authentication
  - Uses the main postgres user and lacks authentication for uses, so lacks security.

- Deleted_at (Soft Deletion)
  - Would be fairly useful, especially when utilising accounts/auth

<!-- LEARNING -->
## Learning 
*Note: Dumb stuff I did as a junior developer*
- RawSQL, instead of an ORM
  - As using raw sql is uncommon, there was a lack of help I could find online when facing issues such as queries not 
  returning the correct information or the migration not working (originally the migration error
  was due to import/require compatibility issues, then due to some sql fields being required in
  the migration files, which were not required when creating a postgresql database).
  - My queries in some cases were probably not performant due to over-use of joins.
  - A lot of these issues were fixed by using ndb to debug and *guessing* roughly where the error
  is occurring and stepping through the functions till an issue cropped up.

- Array manipulation
  - I needed to use a lot of array manipulation to get data from the database and to process it
  before sending it to the frontend, so most of the computing is done within the api.
  - In some cases, it was beneficial to use array manipulation instead of using multiple queries 
  to the database, making it quicker to return data, which is a benefit of raw sql compared to an
  ORM.

- Require vs. Import
  - Before this I hadn't used ES6 imports. Imports required being more careful with positioning
  of some elements; notably with configuring the index.js file in the db folder.

- Folder Structure
  - I attempted to separate the routes from the 'business logic' in the domain folder and the 
  database logic, as can be seen by the folder structure.
  - This was fairly difficult in the beginning as initially I was just trying to test out 
  creating the api, so you may notice some db logic doesn't go through domain but straight to
  the route files. However, I still found that having this logic separated made it much easier 
  to find functions and reuse those functions down the line.
  - Note: my file structure is still a bit naff, if I'm being honest.