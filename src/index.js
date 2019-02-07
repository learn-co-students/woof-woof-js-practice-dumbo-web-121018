const fetchDogs = () => {
  fetch("http://localhost:3000/pups")
  .then(res => res.json())
  .then(puppies => {
    spanDoggo(puppies)
    filterDogsBar(puppies)
  })
}

let foundPuppy;

const spanDoggo = puppies => {
  const dogBar = document.querySelector("#dog-bar")
  const dogSpan = document.querySelectorAll("span");
  puppies.forEach(puppy => {
    dogBar.innerHTML += `<span id="${puppy.id} " class="dogBtn">${puppy.name}</span>`
  })
  dogBar.addEventListener("click", event => {
    const dogInfo = document.querySelector("#dog-info");
    if(event.target.classList.contains("dogBtn")) {
      puppies.forEach(puppy => {
        if(puppy.id == event.target.id) {
          dogInfo.innerHTML = `
          <img src=${puppy.image}>
          <h2>${puppy.name}</h2>
          <button id="${puppy.id}" class="btn">${puppy.isGoodDog}</button>
          `
          foundPuppy = puppy;
        }
      })
      goodBoi(foundPuppy)
    }
  })
}

const goodBoi = foundPuppy => {
  const dogInfo = document.querySelector("#dog-info");
  dogInfo.addEventListener("click", event => {
    if(event.target.classList.contains("btn")) {
      updateGoodBoi(parseInt(event.target.id), foundPuppy)
    }
  })
}

const updateGoodBoi = (event, foundPuppy) => {
  fetch(`http://localhost:3000/pups/${event}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({isGoodDog: trueOrFalse(foundPuppy.isGoodDog)})
  })
  .then(res => res.json())
  .then(puppy => toggleBtn(puppy))
}

const trueOrFalse = goodBoi => {
  if(goodBoi) {
    return false;
  } else {
    return true;
  }
}

const toggleBtn = puppy => {
  console.log(puppy)
  const button = document.querySelector(".btn")
  button.innerText = !trueOrFalse(puppy.isGoodDog)
}

const filterDogsBar = puppies => {
  const filterDogs = document.querySelector("#good-dog-filter");
  const dogBar = document.querySelector("#dog-bar");

  filterDogs.addEventListener("click", () => {
    dogBar.innerHTML = "";
    puppies.forEach(puppy => {
      if(puppy.isGoodDog === true) {
        // puppy.style.display = "none";
        dogBar.innerHTML += `<span id="${puppy.id} " class="dogBtn">${puppy.name}</span>`      }
    })
  })
}


fetchDogs()
