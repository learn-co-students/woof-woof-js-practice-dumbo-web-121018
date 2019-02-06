document.addEventListener("DOMContentLoaded", function(){
  const dogBar = document.getElementById("dog-bar")
  const dogInfo = document.getElementById("dog-info")
  const goodDogFilter = document.getElementById("good-dog-filter")

  const addOneDogToBar = dog => {
    const string = `<span class="one-dog" data-id="${dog.id}">${dog.name}</span>`
    dogBar.innerHTML += string
  }

  const populateDogBar = someDogs => {
    someDogs.forEach(addOneDogToBar)
  }

  const fetchAllTheDogs = () => {
    fetch("http://localhost:3000/pups")
    .then(res => res.json())
    .then(data => populateDogBar(data))
  }

  const showDogOnPage = dog => {
    let buttonText;
    if (dog.isGoodDog == "true") {
      buttonText = "Bad Dog!"
    } else {
      buttonText = "Good Dog!"
    }
    string = `
    <img src=${dog.image}>
    <h2>${dog.name}</h2>
    <button data-id="${dog.id}" data-alignment="${dog.isGoodDog}" class="good-bad-button">${buttonText}</button>
    `
    dogInfo.innerHTML = string
  }

  const fetchDogFromBarClick = dogId => {
    fetch(`http://localhost:3000/pups/${dogId}`)
    .then(res => res.json())
    .then(data => showDogOnPage(data))
  }

  const dogBarCallback = event => {
    if (event.target.classList.contains("one-dog")) {
      fetchDogFromBarClick(event.target.dataset.id)
    }
  }

  const addEventToDogBar = () => {
    dogBar.addEventListener("click", dogBarCallback)
  }

  const fetchUpdateGoodBad = buttonInfo => {
    let bodyObject;
    if (buttonInfo.dataset.alignment == "true") {
      bodyObject = {isGoodDog: "false"}
    } else {
      bodyObject = {isGoodDog: "true"}
    }
    fetch(`http://localhost:3000/pups/${buttonInfo.dataset.id}`, {
      method: "PATCH",
      body: JSON.stringify(bodyObject),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => res.json())
    .then(data => showDogOnPage(data))
  }

  const goodBadCallback = event => {
    if (event.target.classList.contains("good-bad-button")) {
      fetchUpdateGoodBad(event.target)
    }
  }

  const addEventToDogInfo = () => {
    dogInfo.addEventListener("click", goodBadCallback)
  }

  const goodDogFilterCallback = event => {
    dogBar.innerHTML = ""
    if (event.target.innerText === "Filter good dogs: OFF") {
      event.target.innerText = "Filter good dogs: ON"
      fetch("http://localhost:3000/pups")
      .then(res => res.json())
      .then(data => {
        let filteredData = data.filter(dog => (dog.isGoodDog == true) || (dog.isGoodDog == "true"))
        populateDogBar(filteredData)
      })
    } else {
      event.target.innerText = "Filter good dogs: OFF"
      fetchAllTheDogs();
    }
  }

  const addEventToGoodButton = () => {
    goodDogFilter.addEventListener("click", goodDogFilterCallback)
  }

  fetchAllTheDogs();
  addEventToDogBar();
  addEventToDogInfo();
  addEventToGoodButton();
  //end of DOMContentLoaded
})
