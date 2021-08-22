let schedule = {
  "sun": [],
  "mon": [],
  "tue": [],
  "wed": [],
  "thu": [],
  "fri": [],
  "sat": []
}
// global constants
const configHeader = apiKey
let dayBar;
let taskForm;
let dlContainer;
let ddContainer;
let dataInput;
let dataList;
let dropDown;

//event listeners
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#btn-ex').addEventListener('click', getExercisesAPI)
  document.querySelector('#btn-bp').addEventListener('click', getExercisesAPI)
  document.querySelector('#btn-mg').addEventListener('click', getExercisesAPI)
  document.querySelector('input.drop-down').addEventListener('change', getExerciseAPI)
  document.querySelector('#add-task').addEventListener('submit', handleForm)
  document.querySelector('#close').addEventListener('click', (location) => {
    toggleHidden(document.querySelector('#expanded'))
  })
  dayBar = document.querySelector('#day-bar')
  taskForm = document.querySelector('#add-task')
  dlContainer = document.querySelector('#datalist-container')
  ddContainer = document.querySelector('#dropdown-container')
  dataInput = document.querySelector('input.drop-down')
  dataList = document.querySelector('#names')
  dropDown = document.querySelector('#narrowedDD')
  getExercisesAPI()
  getExerciseData()
})

//fetches
/*GET request to pull all exercises from exerciseDB
if called on page load or on search by name event: build datalist
if called on search by target/bodyPart event: build dropdown of specifics
hide/unhide neccesary lists */
function getExercisesAPI(e){
  return fetch(`https://exercisedb.p.rapidapi.com/exercises`, {
    "method": "GET",
    "headers": configHeader
  })
  .then(resp => resp.json())
  .then(exercises => {
    if(!e){
      buildExerciseDL(exercises, 'name')
      document.querySelector('#all-search').hidden = true
    }else if(e.target.value === 'name'){
      document.querySelector('#all-search').hidden = false
      dataList.hidden = false;
      buildExerciseDL(exercises, 'name')
      // dataList.hidden = true
    }else{
            document.querySelector('#all-search').hidden = false
      const key = e.target.value //bodyPart or Target
      buildCategoryDD(exercises, key)
    }
  }) 
}
/*fetch single exercise to populate hidden form and alert if not found */
function getExerciseAPI(e){
  const name = e.target.value
  fetch(`https://exercisedb.p.rapidapi.com/exercises/name/${name}`, {
	"method": "GET",
	"headers": configHeader
})
.then(resp => resp.json())
.then(exercises => {
  document.querySelector('input.drop-down').value = ""
  handleExSelect(exercises[0])
})
.catch(error => alert("Exercise not found, please choose another"))
}
/*POST data from user's form on submit to db.json */
function postExerciseData(obj){
  return fetch(`http://localhost:3000/exercises/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(obj)
  })
  .then(getExerciseData)
}

/* 
fetch on page load to populate each day & TODAY with exercises
also fetch all user's exercises immediately after POST to update DOM*/
function getExerciseData(){
  return fetch('http://localhost:3000/exercises')
  .then(resp => resp.json())
  .then(exerciseData => {
    /*iterate through days (keys in sched) 
    create workouts variable with filtered exercises associated with (true/false values on each day)
    return newly populated schedule where each day/key has a value of an array of exercise objects*/
    Object.keys(schedule).forEach(key => {
      const workouts = exerciseData.filter(exercise => {
        return exercise.days[key]
      })
      console.log('key: ', key, 'workouts var: ', workouts)
      schedule[key] = workouts
    })
    return schedule
    
  })
  .then(handleDayCard)
  .then(makeTodayCard)
}


//render functions

/*Add current day to card
 sets up day format & invokes function to add detailed view of exercise(s)*/
function makeTodayCard(){
  const date = new Date()
  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long'}).format(date)
  const section = document.querySelector('#day-card')
  const div = document.createElement('div')
  const header = document.createElement('h2')
  const p = document.createElement('p')
  const dayAbrev = today.slice(0, 3).toLowerCase()
  const dayCard = document.getElementById(`d-${dayAbrev}`)
  section.innerHTML = ""
  p.style.textAlign = 'left'
  p.innerText = 'Exercise details for today:'
  div.id = "today-details"
  header.textContent = `Today is ${today}!`
  section.append(header, p, div)
  populateDetails(div, dayAbrev)
}

/* 
invoked on DOM loaded, search by exercise name click & on dropdown selected
build & unhide datalist, takes 2 args: exercises from API & key: Name, bp or target
 set conditional so DL changes with click compares value of event (if click event) to key
 iterates through API objects to show exercise names or narrowed list of exercise names*/
function buildExerciseDL(exercises, key){
  let value;
  event ? value = event.target.value : null;
  dlContainer.innerHTML = ""
  dataList.innerHTML = ""
  dlContainer.className = "drop-down"
  dataInput.value = ""
  dataList.id="names"
  dlContainer.append(dataInput, dataList)
  addOption(dataList, 'Select', '')
  //if no key... key is name
  if(key === 'name'){
    dropDown.innerHTML = ""
    dropDown.className = "hide"
    exercises.forEach(exercise => {
      const {name} = exercise
      addOption(dataList, name, name)
    })
  }else{
    exercises.forEach(exercise => {
      const {name} = exercise
      if(exercise[key] === value){
        addOption(dataList, name, name)
      } 
    })
  } 
}


/* invoked on click event only to search by key, key assigned by click event
 reset lists & dropdowns 
 invoke build datalist once dd selected with new key (from click event value) */
function buildCategoryDD(exercises, key){
  dataList.innerHTML = ""
  dataInput.value = ""
  dlContainer.className = "hide"
  ddContainer.className = ""
  dropDown.innerHTML = ""
  dropDown.className = "drop-down"
  dropDown.addEventListener('change', () => {
    buildExerciseDL(exercises, key)
  })
  /*checks for all possible keys and removes duplicates, displaying each key once*/
  const reducedExercises = exercises.reduce((result, exercise) => {
    if(!result.includes(exercise[key])){
      result.push(exercise[key])
    }
    return result
  }, [])
  /* adds options after iterating through the reduced key list */
  addOption(dropDown, 'Select', '')
  reducedExercises.forEach(exercise => {
    addOption(dropDown, exercise, exercise)
  })
  
}

/*add option to datalist or dropdown list based on dropdown selection(narrowed) 
or search by name
 takes args of the list name to populate, the text and value to be used for fetching single ex*/
function addOption(list, innerText, value){
  let option = document.createElement('option')
  option.innerText = innerText
  option.value = value
  list.appendChild(option)
}


/*invoked in single exercise fetch upon click event in datalist (exercise selection)
populates form with exercise details from API*/
function handleExSelect(exercise){
  const {name, bodyPart, equipment, target} = exercise
  document.querySelector('#confirm-card').hidden = false
  const confirmForm = document.querySelector('#confirm-select')
  //autopopulate form with selected exercise
  document.querySelector('#nameInput').innerText = name
  document.querySelector('#bpInput').innerText = bodyPart
  document.querySelector('#targetInput').innerText = target
  document.querySelector('#equipInput').innerText = equipment
}


/* invoked on submit click event
take data from populated form & creates json object
send new exercise object to be posted to db.json & reset form */
function handleForm(e){
  // e.preventDefault()
  const exerciseObj = {
    exercise: document.querySelector('#nameInput').innerText,
    bodyPart: document.querySelector('#bpInput').innerText, 
    target: document.querySelector('#targetInput').innerText, 
    equipment: document.querySelector('#equipInput').innerText,
    goals:{
      dis: document.querySelector('#goal-dis').value,
      dur: document.querySelector('#goal-dur').value, 
      reps: document.querySelector('#goal-reps').value,
      weight: document.querySelector('#goal-weight').value, 
      other: document.querySelector('#goal-oth').value, 
      },
    days: {
      sun: false,
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false
    }
  }
  const checkboxes = document.querySelectorAll('input[name="day"]:checked')
  const days = []
  //iterate through checkbox nodes with checks, save the day as a key with val = true
  checkboxes.forEach((checkbox) => {
    const day = checkbox.value
    exerciseObj.days[day] = true
  })

  postExerciseData(exerciseObj)
  resetForm()
}


/* invoked upon fetching data from db.json (after schedule is populated)
iterate through days of week (schedule object, days are key, 
  values arr of exercise objects assigned to each day)
set num of exercises to length of value array from schedule*/
function handleDayCard(){
  Object.keys(schedule).forEach(key => {
    const dayCard = document.querySelector(`#d-${key}`)
    const p = document.querySelector(`#d-${key} p`)
    let exNum = schedule[key].length
    if(exNum === 1 && !dayCard.innerHTML.includes('</button>')){
      p.innerText = `${exNum} exercise`
      makeViewButtons(dayCard)
    }else if(exNum === 1){
      p.innerText = `${exNum} exercise`
    }else if(exNum > 1 && !dayCard.innerHTML.includes('</button>')){
      p.innerText = `${exNum} exercises`
      makeViewButtons(dayCard)
    }else if(exNum > 1 && dayCard.innerHTML.includes('</button>')){
      p.innerText = `${exNum} exercises`
    }
  })  
}

//helper functions
function resetForm(){
  const confirmInputs = document.querySelectorAll('#confirm-card td.right')
  const inputs = document.querySelectorAll('input')
  
  for(let i = 8; i < 12; i++){
    let input = inputs[i]
    input.value = ""
  }
  for(let i = 1; i < 8; i++){
    let checkbox = inputs[i]
    checkbox.checked = false;
  }

  document.querySelector('#goal-oth').value = ""
  confirmInputs.forEach(td => {
    td.textContent = ""
  })
  document.querySelector('#confirm-card').hidden = true
}

function makeViewButtons(dayCard){
  const viewBtn = document.createElement('button')
  viewBtn.className = "btns"
  viewBtn.innerText = "View"
  viewBtn.addEventListener('click', (location) => expandDetails(dayCard))
  dayCard.appendChild(viewBtn)
}

function expandDetails(dayCard){
  const fullDayName = event.target.previousSibling.previousSibling.previousSibling.previousSibling.innerText
  const detailsCard = document.querySelector('#expanded')
  const detailsDiv = document.querySelector('#ex-info')
  const header = document.querySelector('#expanded h2')
  const day = dayCard.id.slice(2)
  header.innerText = `${fullDayName}'s Exercise Details: `
  detailsCard.hidden = false
  populateDetails(detailsDiv, day)
}

function populateDetails(location, day){
  const dayArr = schedule[day]
  location.innerHTML = ""
  console.log('fxn: popDetails dayArr: ', dayArr)
  dayArr.forEach(exerciseObj => {
    const {exercise, bodyPart, target, equipment, goals} = exerciseObj
    const {dis, dur, reps, weight, other} = goals
    const details = [bodyPart, target, equipment, dis, dur, reps, weight, other]
    const ul = document.createElement('ul')
    const h4 = document.createElement('h4')
    h4.innerText = titleize(exercise)
    location.append(h4, ul)
    details.forEach(item => {
      if(item !== ''){
        const li = document.createElement('li')
        li.innerText = item
        li.id = `li-${item}`
        ul.appendChild(li)

        switch(item){
          case bodyPart: 
          if(item !== ''){
            li.innerText = `Body part: ${bodyPart}`
          };
          break;
          case target:
            if(item !== ''){
              li.innerText = `Target muscle: ${target}`
            }; 
          break;
          case equipment: 
          if(item !== ''){
            li.innerText = `Equipment: ${equipment}`
          };
          
          break;
          case dis: 
          if(item !== ''){
            li.innerText = `Distance: ${dis}`
          };
          break;
          case dur: 
          if(item !== ''){
            li.innerText = `Duration: ${dur}`
          };
          break;
          case reps: 
          if(item !== ''){
            li.innerText = `Reps: ${reps}`
          };
          break;
          case weight: 
          if(item !== ''){
            li.innerText = `Weight: ${weight}`
          };
          break;
          case other: 
          if(item !== ''){
            li.innerText = `Other: ${other}`
          };
          break;

        }
      }
    })
   
  })
}

function createLi(ele){
  
}

function toggleHidden(location){
  // console.log('location check: ', location)
  location.hidden = !location.hidden
}

function upper(word){
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function titleize(str){
  strArr = str.split(" ")
  return strArr.map(word => upper(word)).join(" ")
}



// run server: json-server --watch db.json