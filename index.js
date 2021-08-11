const schedule = {
  "sun": [],
  "mon": [],
  "tue": [],
  "wed": [],
  "thu": [],
  "fri": [],
  "sat": []
}
// global constants
let dayBar;
let taskForm;
let dlContainer;
let ddContainer;
let dataInput;
let dataList;
let dropDown;
//event listeners

document.addEventListener('DOMContentLoaded', () => {
  makeTodayCard()
  document.querySelector('#btn-ex').addEventListener('click', getExercises)
  document.querySelector('#btn-bp').addEventListener('click', getExercises)
  document.querySelector('#btn-mg').addEventListener('click', getExercises)
  document.querySelector('input.drop-down').addEventListener('change', getExercise)
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
  getExercises('')
})

//fetches
function getExercises(e){
  return fetch(`https://exercisedb.p.rapidapi.com/exercises`, {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": "975aac47bbmshce4e51ae3a1f0e0p1d7a52jsn9be6aa842dbe",
      "x-rapidapi-host": "exercisedb.p.rapidapi.com"
    }
  })
  .then(resp => resp.json())
  .then(exercises => {
    if(!e || e.target.value === 'name'){
      buildExerciseDL(exercises, 'name')
    }else{
      const key = e.target.value //bodyPart or Target
      buildCategoryDD(exercises, key)
    }
  }) 
}
function getExercise(e){
  const name = e.target.value
  fetch(`https://exercisedb.p.rapidapi.com/exercises/name/${name}`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "975aac47bbmshce4e51ae3a1f0e0p1d7a52jsn9be6aa842dbe",
		"x-rapidapi-host": "exercisedb.p.rapidapi.com"
	}
})
.then(resp => resp.json())
.then(exercises => {
  document.querySelector('input.drop-down').value = ""
  handleExSelect(exercises[0])
})
.catch(error => alert("Exercise not found, please choose another"))
}
function getDays(e){
    fetch('http://localhost:3000/days')
    .then(resp => resp.json())
    .then(days => practice(days))
}
function postExerciseData(obj){
  return fetch(`http://localhost:3000/exercises/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(obj)
  })
}
function getExerciseData(){
  return fetch('http://localhost:3000/exercises')
  .then(resp => resp.json())
}


//render functions
function makeTodayCard(){
  let date = new Date()
  let today = new Intl.DateTimeFormat('en-US', { weekday: 'long'}).format(date)
  let section = document.querySelector('#day-card')
  let dayCard = document.createElement('div')
  let header = document.createElement('h2')
  dayCard.class = "day";
  header.textContent = `Today is ${today}!`
  section.appendChild(dayCard)
  dayCard.append(header)
}
//update today card to pull details from related day with checkboxes
//add task list removal & celebration to day card

function buildExerciseDL(exercises, key){
  let value;
  event ? value = event.target.value : value = 'name'
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
  const reducedExercises = exercises.reduce((result, exercise) => {
    if(!result.includes(exercise[key])){
      result.push(exercise[key])
    }
    return result
  }, [])
  addOption(dropDown, 'Select', '')
  reducedExercises.forEach(exercise => {
    addOption(dropDown, exercise, exercise)
  })
  
}

function addOption(list, innerText, value){
  let option = document.createElement('option')
  option.innerText = innerText
  option.value = value
  list.appendChild(option)
}

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

function handleForm(e){
  e.preventDefault()
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
  checkboxes.forEach((checkbox) => {
    const day = checkbox.value
    exerciseObj.days[day] = true
  })
  addExercise(exerciseObj)
  resetForm()
}



function addExercise(exerciseObj){
  for(const day in exerciseObj.days){
    let exNum = 0
    const dayCard = document.querySelector(`#d-${day}`)
    const firstChar = document.querySelector(`#d-${day} p`).innerText[0]
    if(parseInt(firstChar) >= 0){
      exNum = parseInt(firstChar)
    }
    if(exerciseObj.days[day] === true){
      const dayCard = document.querySelector(`#d-${day}`)
      const p = document.querySelector(`#d-${day} p`)
      if(exNum === 0){
        const btn = document.createElement('button')
        btn.className = "btns"
        btn.innerText = "View"
        dayCard.appendChild(btn)
        p.innerText = `${++exNum} exercise`
      }else if(exNum >= 1){
        p.innerText = `${++exNum} exercises`
      }else{ console.log('error: ',exNum)}
      updateDayCard(exerciseObj, day)
    }
  }   
}

function updateDayCard(exerciseObj, day){
  const viewBtn = document.querySelector(`#d-${day} button`)
  viewBtn.addEventListener('click', (location) => expandDetails(dayCard))
  postExerciseData(exerciseObj)
  .then(() => getExerciseData())
  .then(exerciseData => {
    Object.keys(schedule).forEach(day => {
      const workouts = exerciseData.filter(data => {
        return data.days[day]
      })
      schedule[day] = workouts
    })

  })
  console.log('schedule:', schedule)
}

//helper functions
function resetForm(){
  const confirmInputs = document.querySelectorAll('#confirm-card td.right')
  const inputs = document.querySelectorAll('input')
  for(let i = 1; i < 5; i++){
    let input = inputs[i]
    input.value = ""
  }
  for(let i = 5; i < 12; i++){
    let checkbox = inputs[i]
    checkbox.checked = false;
  }
  let userName = inputs[inputs.length - 2]
  userName.value = ""
  document.querySelector('#goal-oth').value = ""
  confirmInputs.forEach(td => {
    td.textContent = ""
  })
  toggleHidden(document.querySelector('#confirm-card'))
}

function clearInnerHTML(){

}

function expandDetails(day){
  const detailsCard = document.querySelector('#expanded')
  toggleHidden(detailsCard)
  // const detailsDiv = document.createElement('div')
  // detailsDiv.classList += "details"
  // detailsDiv.hidden = true
  // const ul = document.createElement('ul')
  // const exerciseName = document.createElement('h3')
  // exerciseName.innerText = `Exercise: ${exercise}`
  // dayCard.appendChild(detailsDiv)
  // detailsDiv.append(exerciseName, ul)

  // const detailsArr = [target, equipment, dis, dur, reps, weight, other]

  // detailsArr.forEach(item => {
  //   if(item !== ""){
  //     const itemLi = document.createElement('li')
  //     switch(true){
  //       case (item === target):
  //       itemLi.innerText = `Target Muscle: ${target}`
  //       ul.appendChild(itemLi)
  //       break;
  //       case (item === equipment):
  //       itemLi.innerText = `Equipment: ${equipment}`
  //       ul.appendChild(itemLi)
  //       break;
  //       case (item === dis):
  //       itemLi.innerText = `Distance: ${dis}`
  //       ul.appendChild(itemLi)
  //       break;
  //       case (item === dur):
  //       itemLi.innerText = `Duration: ${dur}`
  //       ul.appendChild(itemLi)
  //       break;
  //       case (item === reps):
  //       itemLi.innerText = `Reps: ${reps}`
  //       ul.appendChild(itemLi)
  //       break;
  //       case (item === weight):
  //       itemLi.innerText = `Weight: ${weight}`
  //       ul.appendChild(itemLi)
  //       break;
  //       case (item === other):
  //       itemLi.innerText = `Other goals: ${other}`
  //       ul.appendChild(itemLi)
  //       break;
  //     }
  //   }
  // })
}

function toggleHidden(location){
  // console.log('location check: ', location)
  location.hidden = !location.hidden
}





// function buildDropDown(e){
//   const key = e.target.value //parts, muscle, or names
//   const ddList = document.querySelector('#workout-list')
//   const container = document.querySelector('#workoutDD-container')
//   container.innerHTML = ""
//   ddList.innerHTML = ""
//   ddList.name = key
//   getStrengthExercises()
//   .then(exercises => {
//     const values = exercises.reduce((result, exercise) => {
//       if(!result.includes(exercise[key])){
//         result.push(exercise[key])
//       }
//       return result
//     }, [])

//     addOption(ddList, "Select", "")
//     for(const value of values){
//       addOption(ddList, value, value)
     
//     }
//   })
// }



// function handleWorkoutChange(e){
//   const {name, value} = e.target
//   console.log('name', name, 'value', value)
//   getStrengthExercises(`${name}/${encodeURIComponent(value)}`)
//   .then(exercises => {
//     if(name === 'name'){
//       addToForm(value)
//     }else{
//       buildExerciseDD(exercises)
//     }
//   })
//   .catch(error => alert("Exercise not found"))
// }

// function buildExerciseDD(exercises){
//   const container = document.querySelector('#workoutDD-container')
//   container.innerHTML = ""
//   const dropDown = document.createElement('select')
//   dropDown.className = "drop-down"
//   dropDown.addEventListener('change', (e) => addToForm(e.target.value))
//   container.appendChild(dropDown)
//   addOption(dropDown, 'Select', '')
//   exercises.forEach(exercise => {
//     const {name} = exercise
//     addOption(dropDown, name, name)
//   })
// }

// 

// function addToForm(val){
//   getStrengthExercises(`name/${val}`)
//   .then(exercises => {
//     const exercise = exercises[0]
//     // const [exercise] = exercises
//     console.log(exercise)
//   } )
// }


// function getStrengthExercises(search){
//   const path = search ? `/${search}` : ''
//   return fetch(`https://exercisedb.p.rapidapi.com/exercises${path}`, {
// 	"method": "GET",
// 	"headers": {
// 		"x-rapidapi-key": "975aac47bbmshce4e51ae3a1f0e0p1d7a52jsn9be6aa842dbe",
// 		"x-rapidapi-host": "exercisedb.p.rapidapi.com"
// 	}
// })
// .then(resp => resp.json())
// .then(exercises => exercises)
// }


//************************************* */


// function buildTaskList(taskList){
//   let li = document.createElement('li')
//   let btn = document.createElement('button')
//   btn.addEventListener('click', handleDelete)
//   btn.textContent = ' X'
//   li.textContent = `${taskList}  `;
//   li.appendChild(btn)
//   document.querySelector('#tasks').appendChild(li)
// }

// function allTasksRemoved(){
//   let imgDiv = document.createElement('div')
//   let img = document.createElement('img')
//   imgDiv.appendChild(img)
//   document.querySelector('div#list').appendChild(imgDiv)
//   img.id = 'celebrate_image'
//   img.src = 'https://salesgravy.com/wp-content/uploads/2021/01/How-to-celebrate-success-in-the-pandemic.png'
// }

// {
//   "users":[
//     {
//       "userName": "sample1",
//       "id": 1,
//       "exercise": "exercise1",
//       "bodyPart": "full body", 
//       "target": "all", 
//       "equipment": "body weight",
//       "goals":{
//         "dis": "n/a",
//         "dur": "20 min", 
//         "reps": "5",
//         "weight": "n/a", 
//         "other": "focus on breathing technique"
//         },
//       "days": {
//         "sun": true,
//         "mon": false,
//         "tue": false,
//         "wed": true,
//         "thu": false,
//         "fri": true,
//         "sat": false
//       }
//     }
//   ]
// }