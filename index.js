document.addEventListener('DOMContentLoaded', () => {
  makeTodayCard()
  document.querySelector('#add-task').addEventListener('submit', handleTaskSubmit)
  document.querySelector('#dropdown').addEventListener('change', handleSelect)
})

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

function handleSelect(e){
  let category = e.target.value
  let workouts = document.querySelector('#workouts')
  let goals = document.querySelector('#goals') //table
  let dis = document.getElementById('row-dis')
  let dur = document.getElementById('row-dur')
  let rep = document.getElementById('row-rep')
  let wei = document.getElementById('row-wei')
  console.log(category, dis, dur, rep, wei)

    //change workout list
  buildWorkoutDD(category)
  
  if(category === 'strength'){
    dis.classList = 'hide'
    dur.classList = ''
    wei.classList = ''
    rep.classList = ''
  }else if(category === 'sports'){
    rep.classList = 'hide'
    wei.classList = 'hide'
    dis.classList = 'hide'
    dur.classList = ''
  }else if(category === 'cardio'){
    wei.classList = 'hide'
    dis.classList = ''
    dur.classList = ''
    rep.classList = ''
  } 
}

function buildWorkoutDD(category){

}

function handleTaskSubmit(){

}



function buildTaskList(taskList){
  let li = document.createElement('li')
  let btn = document.createElement('button')
  btn.addEventListener('click', handleDelete)
  btn.textContent = ' X'
  li.textContent = `${taskList}  `;
  li.appendChild(btn)
  document.querySelector('#tasks').appendChild(li)
}

function allTasksRemoved(){
  let imgDiv = document.createElement('div')
  let img = document.createElement('img')
  imgDiv.appendChild(img)
  document.querySelector('div#list').appendChild(imgDiv)
  img.id = 'celebrate_image'
  img.src = 'https://salesgravy.com/wp-content/uploads/2021/01/How-to-celebrate-success-in-the-pandemic.png'
}

function getStrengthExercises(){
  fetch("https://exercisedb.p.rapidapi.com/exercises", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "975aac47bbmshce4e51ae3a1f0e0p1d7a52jsn9be6aa842dbe",
		"x-rapidapi-host": "exercisedb.p.rapidapi.com"
	}
})
.then(resp => resp.json())
.then(exercises => {
  console.log(exercises)
  // for(exercise of exercises){
  //   createDropdown(exercise)
  // }
})
.catch(err => {
	console.error(err);
});
}

function createDropdown(exercise){
  // let ul = document.querySelector('#exercises')
  // let li = document.createElement('li')
  // let subLi = document.createElement('li')
  // li.id = `exercise-${exercise.id}`
  // li.textContent = exercise.name
  // subLi.textContent = exercise.id
  // ul.appendChild(li)
  // li.appendChild(subLi)
}

