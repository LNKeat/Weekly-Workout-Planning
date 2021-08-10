



//event listeners
document.addEventListener('DOMContentLoaded', () => {
  makeTodayCard()
  document.querySelector('#btn-ex').addEventListener('click', getExercises)
  document.querySelector('#btn-bp').addEventListener('click', getExercises)
  document.querySelector('#btn-mg').addEventListener('click', getExercises)
  document.querySelector('input.drop-down').addEventListener('change', getExercise)
  document.querySelector('#add-task').addEventListener('submit', handleForm)
  getExercises('')
})

//global constants
// const dayBar = document.querySelector('#day-bar')
// const taskForm = document.querySelector('#add-task')
// const dlContainer = document.querySelector('#datalist-container')
// const ddContainer = document.querySelector('#dropdown-container')
// const dataInput = document.querySelector('input.drop-down')
// const dataList = document.querySelector('#names')
// const dropDown = document.querySelector('#narrowedDD')


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


function buildExerciseDL(exercises, key){
  const dropdown = document.querySelector('#narrowedDD')
  const dlContainer = document.querySelector('#datalist-container')
  const dataInput = document.querySelector('input.drop-down')
  const dataList = document.querySelector('#names')
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
  // console.log(e)
  const exerciseObj = {
    userName: document.querySelector('#userName').value,
    exerciseInput: document.querySelector('#nameInput').innerText,
    bodyPart: document.querySelector('#bpInput').innerText, 
    targetMuscle: document.querySelector('#targetInput').innerText, 
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
  getExercises()
}

function addExercise(exerciseObj){
  //set daily exNum to increment with exercises added
  //have exercise Obj persist
  //add elistener to daycard buttons to view details
  //update today card to pull details from related day with checkboxes
  //add task list removal & celebration to day card
  let exNum = 2;
  for(const day in exerciseObj.days){
    if(exerciseObj.days[day] === true){
      const dayCard = document.querySelector(`#d-${day}`)
      const p = document.createElement('p')
      const btn = document.createElement('button')
      btn.className = "btns"
      btn.innerText = "View"
      exNum === 1 ? p.innerText = "1 exercise" : p.innerText = `${exNum} exercises`
      dayCard.append(p, btn)
    } 
  }   
}

function resetForm(){
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

