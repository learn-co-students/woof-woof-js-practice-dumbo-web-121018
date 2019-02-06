const dogsURL = "http://localhost:3000/pups/"

async function makeDogGood(e) {
  const doggoId = e.toElement.id.replace('good', '');
  const dogVal = document.getElementById('isGoodText').innerText
  console.log(dogVal)
  let dogBool;

  if (dogVal === "false") {
    dogBool = true
  } else {
    dogBool = false
  }

  fetch(dogsURL + doggoId, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isGoodDog: dogBool
    })
  }).then(function(response){
    response.json().then(function(todo){
      const goodDisplay = document.getElementById("isGoodText")
      goodDisplay.innerText = `${todo.isGoodDog}`
      console.log(dogBool)
    })
  })

}


async function showADoggo(e) {
  const doggoId = e.toElement.id.replace("d", "")
  const dogInfo = document.getElementById('dog-info')
  const getDoggo = await fetch(dogsURL + doggoId)
  const doggo = await getDoggo.json()

  dogInfo.innerHTML = `
    <img src=${doggo.image}><br>
    <h2>${doggo.name}</h2><br>
    <h4>Is this a good dog?</h4><br>
    <p id="isGoodText">${doggo.isGoodDog}</p>
    <button id='good${doggo.id}'>Good Dog!</button>
  `
  const goodDog = document.getElementById(`good${doggo.id}`)
  goodDog.addEventListener('click', e => {
    makeDogGood(e)
  })
}

function showDoggos(doggos) {
  const dogBar = document.getElementById("dog-bar")
  doggos.forEach(doggo => {
    const dogSpan = document.createElement("span")
    dogSpan.innerText = `${doggo.name}`
    dogSpan.id = `d${doggo.id}`
    dogSpan.className = 'dog-span'
    dogBar.appendChild(dogSpan)
    dogSpan.addEventListener('click', (e) => {
      showADoggo(e)
    })
  })
}

async function fetchDoggos() {
  const doggoResponse = await fetch(dogsURL)
  const doggos = await doggoResponse.json()
  showDoggos(doggos)
  onlyGoodDoggos(doggos)
}

function hideBadDogs(e, doggos) {
  const filterButton = document.getElementById(e.target.id)
  const buttonText = filterButton.innerText;
  const onOrOff = buttonText.substr(buttonText.length - 3)

  if (onOrOff === "OFF") {
    filterButton.innerText = `Filter good dogs: ON`;

    doggos.forEach(doggo => {
      if (doggo.isGoodDog === false) {
        document.getElementById(`d${doggo.id}`).style.display = "none"
      }
    })

  } else {
    filterButton.innerText = `Filter good dogs: OFF`;

    doggos.forEach(doggo => {
      document.getElementById(`d${doggo.id}`).style.display = "inherit"
    })


  }
}

function onlyGoodDoggos(doggies) {
  document.getElementById("good-dog-filter").addEventListener('click', e => {
    const doggos = doggies
    hideBadDogs(e,doggos)
  })
}



document.addEventListener("DOMContentLoaded", () => {
  fetchDoggos()
})
