function getDogs(){
  return fetch('http://localhost:3000/pups')
  .then(res => res.json());
}

function getOneDog(id){
  return fetch(`http://localhost:3000/pups/${id}`)
  .then(res => res.json());
}

function patchOneDog(dogObject){
  return fetch(`http://localhost:3000/pups/${dogObject.id}`,{
    method: 'PATCH',
    body: JSON.stringify(dogObject),
    headers: {
        "Content-Type": "application/json",
      }
  })
}

function iterateAllDogs(allDogs, dogBar){
  // console.log(allDogs.map(dogHTML).join(''))
  dogBar.innerHTML = allDogs.map(dogBtnHTML).join('')
}

function selectGoodDogs(allDogs,dogBar){
  goodDoggos = allDogs.filter(helpSelectGoodDogs)
  dogBar.innerHTML = goodDoggos.map(dogBtnHTML).join('')
}

function helpSelectGoodDogs(dog){
  if (dog.isGoodDog === true){
    return true
  }
  else{
    return false
  }
}

function dogBtnHTML(dog){
  return `
    <span class="doggo-btn" data-dog-id='${dog.id}'>${dog.name}</span>
  `
}

function delegateDogBarBtn(dogBar){
  dogBar.addEventListener('click', showMoreDogInfo )
}

function showMoreDogInfo (event){
  if (event.target.classList.contains('doggo-btn')){
    dogInfo = document.getElementById('dog-info')
    currentDogId = event.target.dataset.dogId
    getOneDog(currentDogId).then(data => dogInfoHTML(data, dogInfo))

  }

}

function delegateGoodBadBtn(dogInfo){
  dogInfo.addEventListener('click', toggleGoodBadBtn)
}

function toggleGoodBadBtn(event){
  if (event.target.nodeName === "BUTTON"){
    if (event.target.innerText === "Bad Dog!"){
      event.target.innerText = "Good Dog!"
      currentDogId = parseInt(event.target.parentNode.className)
      dogObject = {
        id: currentDogId,
        isGoodDog: true
      }
      patchOneDog(dogObject).then(res => res.json()).then(data => console.log(data))

    }
    else{
      event.target.innerText = "Bad Dog!"
      currentDogId = parseInt(event.target.parentNode.className)
      dogObject = {
        id: currentDogId,
        isGoodDog: false
      }
      patchOneDog(dogObject).then(res => res.json()).then(data => console.log(data))
    }

  }
}

function delegateDogFilter(filterDiv, allDogs, dogBar){
  filterDiv.addEventListener('click', ()=> {
    if (event.target.id === "good-dog-filter"){
      if(event.target.innerText === "Filter good dogs: OFF"){
        selectGoodDogs(allDogs, dogBar)
        event.target.innerText = "Filter good dogs: ON"
      }
      else{
        iterateAllDogs(allDogs, dogBar)
        event.target.innerText = "Filter good dogs: OFF"
      }
    }
  })
}


function dogInfoHTML(dog){
  let isGoodDoggo = "Bad Dog!"
  if (dog.isGoodDog === true){
    isGoodDoggo = "Good Dog!"
  }
  dogInfo.className = dog.id
  dogInfo.innerHTML =  `
 <img src=${dog.image}>
 <h2>${dog.name}</h2>
 <button>${isGoodDoggo}</button>
  `
}


document.addEventListener('DOMContentLoaded', async() => {
  const allDogs = await getDogs()
  const dogBar = document.getElementById('dog-bar')
  const dogInfo = document.getElementById('dog-info')
  const filterDiv = document.getElementById('filter-div')
  iterateAllDogs(allDogs, dogBar)
  delegateDogBarBtn(dogBar)
  delegateGoodBadBtn(dogInfo)
  delegateDogFilter(filterDiv, allDogs, dogBar)
  selectGoodDogs(allDogs,dogBar)

  console.log(allDogs)


})
