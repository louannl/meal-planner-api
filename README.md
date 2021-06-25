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
    <li><a href="#issues-and-roadmap">Issues and Roadmap</a></li>
    <li><a href="#learning">Learning</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

### Built With
- SQL / PostgreSQL
- Node.js / Express
- Axios

<!-- GETTING STARTED -->
## Getting Started
To run this project you will need to install npm 
* npm
  ```sh
  npm install npm@latest -g
  ``

### Migrating the database
Ensure the .env file is completed with your database details, there 
is an example env file on the github repo - .env.example.
Next run: 
```
$ db-migrate up
```

### Installation
2. Clone the repo
   ```sh
   git clone https://github.com/louannl/meal-planner.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Copy .env.example and rename it to .env. Enter the database details in `.env`. E.g.
   ```sh
    DATABASE_HOST=localhost
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
## Issues and Roadmap
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