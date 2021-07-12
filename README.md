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
        <li><a href="#migrating-the-database">Migrating the database</a></li>
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
[MealPlanner App Github](https://github.com/louannl/meal-planner.git)
[Online sample](meal-planner.louannloizou.co.uk)
Please see notes for the online example in the app github readme.

### Branches
There are three branches at current: main, NonORM, and Sequelize. 
1. Main 
  Self-explanatory, this is the branch I have used to update the API set up to be used online with my frontend at current. Eventually I will merge the Sequelize branch to this branch. 

2. Non-ORM 
  This is practically a snapshot of the code before I started working on the Sequelize version, there are only a few differences to the current main branch (mainly changes needed to setup the api online)

3. Sequelize
   This is the branch I am working on in current, checkout the branch readme 

### Built With
- SQL / PostgreSQL
- Node.js / Express
- Docker
- Axios

<!-- GETTING STARTED -->
## Getting Started
To run this project you will need to install Node.js and NPM, checkout the docs for how to download NPM [Link to NPM Docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm);

### Installation
1. Clone the repo
  ```sh
  git clone https://github.com/louannl/meal-planner-api.git
  ```
2. Install NPM packages (within the folder) - refer to getting started on how to install npm and node before this step:
  ```sh
  npm install
  ```
3. Copy .env.example and rename it to .env. Enter your database details in `.env`. E.g.
  ```
  DATABASE_HOST=localhost
  ```
4. Migrate the Database by running:
  ```sh
  db-migrate up
  ```
5. Run the command to start the API:
  ```sh
  npm run start
  ```

### Postman
The Postman collection is available to import from the JSON file: meal-planner.postman_collection.json
This can be used to test the API without using the frontend application.

<!-- USAGE EXAMPLES -->
## Usage
This is designed to be used with my meal-planner react app, however you can still use this comfortably with Postman or with your own app.

The API lets you create/edit/delete meals which have details such as the day/s the meals are on, custom 'tags' and ingredients. 

You can then fetch information on the meals or even fetch an aggregated ingredient list to make creating your weekly shopping list easier.

<!-- ROADMAP -->
## Bugs and current issues


## Roadmap
- If deleting a meal leaves an ingredient 'orphaned', delete the ingredient from ingredients as well.
- Route handler uses some old db functions which should be replaces with my new ones which are easier to use. *note: I plan to use an ORM, and since this currently doesn't break the API, I wonder if I should leave this as most functions will be replaced eventually.*
- Testing, need some :(

I learnt a lot from not using an ORM. This largely involved having to use a lot of array manipulation to process queries as well as having to understand how queries work in SQL much better. I assume also that setting up the migrations would have been easier too.

On one hand, it is likely that my code in places will run faster than a
ORM due to more precise queries; on the other, this took way too much time to implement without an ORM. 

...So I will be working on branching off the code and implementing a ORM instead, while still retaining the original code.

<!-- LEARNING -->
## Learning 
- ORM
As not using an ORM is not common, there was a lack of help I could find online when facing issues such as queries not returning the correct information or the migration not working (originally due to import/require issues, then due to some required fields which wouldn't be required in sql but are when migrating). A lot of these issues were fixed by using ndb to debug and *guessing* roughly where the error is occurring and stepping through the functions till an issue cropped up.

- Array manipulation
Getting the data I wanted from an SQL type database and not using an ORM meant I had to use a lot of array manipulation to not only run as few queries as necessary to the database in the first place, but also to return the data as I want it to the frontend so less computing is needed on the frontend app.

- Require vs. Import
Before this I hadn't used imports, imports required being more careful with positioning of some elements; notably with configuring the index.js file in the db folder.

- Folder Structure
I attempted to separate the routes from the 'business logic' in the domain folder and the database logic, as can be seen by the folder structure. 

This was fairly difficult in the beginning as initially I was just trying to test out creating the api, so you may notice some db logic doesn't go through domain but straight to the route files. However, I still found that having this logic separated made it much easier to find functions and reuse those functions. 