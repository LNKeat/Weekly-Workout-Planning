//global constants
const dayBar = document.querySelector('#day-bar')
const taskForm = document.querySelector('#add-task')


//event listeners
document.addEventListener('DOMContentLoaded', () => {
  makeTodayCard()
  document.querySelector('#btn-ex').addEventListener('click', getExercises)
  document.querySelector('#btn-bp').addEventListener('click', getExercises)
  document.querySelector('#btn-mg').addEventListener('click', getExercises)
  getExercises('')
})

//render funcitons
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
//FETCH get exercise names ---> make datalist or dropdown
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

function buildExerciseDL(exercises, key){
  const dropdown = document.querySelector('#narrowedDD')
  const dlContainer = document.querySelector('#datalist-container')
  const dataInput = document.querySelector('input.drop-down')
  const dataList = document.querySelector('#names')
  let value;
  event ? value = event.target.value : value = 'name'
  dataInput.addEventListener('change', getExercise)
  dlContainer.innerHTML = ""
  dataList.innerHTML = ""
  dlContainer.className = "drop-down"
  dataInput.value = ""
  dataList.id="names"
  dlContainer.append(dataInput, dataList)
  addOption(dataList, 'Select', '')
  //if no key... key is name
  if(key === 'name'){
    dropdown.innerHTML = ""
    dropdown.className = "hide"
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
  const dlContainer = document.querySelector('#datalist-container')
  const ddContainer = document.querySelector('#dropdown-container')
  const dropDown = document.querySelector('#narrowedDD')
  const dataInput = document.querySelector('input.drop-down')
  const dataList = document.querySelector('#names')
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

function handleExSelect(exercise){
  console.log(exercise)
  //createform to add exercise info manually
  //autopopulate form with selected exercise
  //add "accept exercise & set goals"
  //pass to handle entire form
}


 

function addOption(list, innerText, value){
  let option = document.createElement('option')
  option.innerText = innerText
  option.value = value
  list.appendChild(option)
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



// function handleTaskSubmit(e){
//   const formObject = {
//     userName: "",
//     exerciseInput: "",
//     bodyPart: "",
//     equipment: "", 
//     id:  0,
//     exName: "", 
//     targetMuscle: "", 
//     goals:{
//       dis: "3 miles",
//       dur: "< 32 min", 
//       reps: "",
//       weight: "", 
//       other: "", 
//       },
//     days: {},
//     }
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

