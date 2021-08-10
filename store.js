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