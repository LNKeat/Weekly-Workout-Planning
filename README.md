# Weekly-Workout-Planner
Flatiron school, phase 1 project:  a SPA designed to set and track workout goals on a weekly basis. 

## Inspiration
This is an application I created to practice my newly earned javascript skills (paired with my VERY outdated and currently being updated HTML/CSS) to create an application to plan workouts.  
The goal was to be able to easily store workouts into a weekly calendar at the beginning of each week and be able to easily add & view exercises on a specific day.  

 ## Tech/framework used
 Vanilla Javascript

 ## Features
 ### Selecting a workout from API
 - user should be able to select a workout by scrolling through the list by workout names or typing in a workout name to narrow the list
 - user should be able to narrow the workout by body part or target muscles
  - upon selecting one of these a new dropdown appears to select the specific body region or target muscle once one of those are selected the main dropdown only shows exercise names that target the selected region or muscle
 - user can add any exercise to as many week days as they would like
 - user can add custom goals to any exercise
  -ie: distance to run, repeatitions or duration on an exercise, weight and other goals that may require very specific custom input
 - once the user submits the form these exercise automatically populate into the weekly calendar and the today card (if exercise were added for that day)
 - user can view the details for any day of the week by clicking on the "view" button associated with a specific day to reveal a pop-up window with exercise details

 ## Installation
### json server
 ```
 npm install -g json
 ```


 ## Development Set up
 Clone the repository into your local environment
 Request an API key: 
 1) Request a free API key directly from rapidapi.com by signing up or logging in to your own account:   https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb/
 2) Contact Laura directly to borrow one that expires in 24 hours.  
 -LNKEAT@gmail.com

 In the index.js file, at the top with the global variables, replace the value of configAPI with your API key string
 ```
 'API-key-string'
 ```
Start up your json server with
```
json-server --watch db.json
```
Open the index.html file in your browser

## Contributing
Fork it (https://github.com/LNKeat/Weekly-Workout-Planning)
Create your feature branch (git checkout -b feature/fooBar)
Commit your changes (git commit -am 'Add some fooBar')
Push to the branch (git push origin feature/fooBar)
Create a new Pull Request

## License
MIT License
Copyright (c) 2021 Laura Keat



