const searcherInput = document.querySelector(".searcher__input");
const searcherOptions = document.querySelector(".searcher__options");
const savedOptions = document.querySelector(".saved-options");

// дебаунс
const debounce = (fn, ms) => {
  let timeout;
  return function () {
    const fnCall = () => {
      fn.apply(this, arguments);
    };
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, ms);
  };
};

// эвентлистенер для поиска
searcherInput.addEventListener("keyup", () => {
  let searchValue = searcherInput.value;
  getDataGit(searchValue);
});

// фетчер гитхаба
async function getDataGit(input) {
  deleteOptions();

  let response = await fetch(
    `https://api.github.com/search/repositories?q=${input}&page=1&per_page=5`
  );
  let data = await response.json();

  data.items.forEach((element) => {
    createOptions(element);
  });
}

// создатель опций
function createOptions(el) {
  let elData = [el.name, el.owner.login, el.stargazers_count];

  let option = document.createElement("li");
  option.classList.add("option");
  option.innerHTML = el.name;
  option.setAttribute("data-repInfo", `${elData}`);

  // сохраняет опции, навешивается на каждую опцию
  option.addEventListener("click", (e) => {
    // подготовливает интерфейс для нового запроса
    searcherInput.value = "";
    let optionsToDelete = [...searcherOptions.children];
    optionsToDelete.forEach((el) => {
      el.remove();
    });

    let newItem = document.createElement("li");
    newItem.classList.add("saved-options__item");

    let newItemName = document.createElement("p");
    newItemName.innerHTML = "Name: " + elData[0];
    newItemName.classList.add("saved-options__info");

    let newItemOwner = document.createElement("p");
    newItemOwner.innerHTML = "Owner: " + elData[1];
    newItemOwner.classList.add("saved-options__info");

    let newItemStars = document.createElement("p");
    newItemStars.innerHTML = "Stars: " + elData[2];
    newItemStars.classList.add("saved-options__info");

    let deleteImg = document.createElement("img");
    deleteImg.src = "img/Vector 8.png";
    deleteImg.alt = "Удалить";
    deleteImg.classList.add("saved-options__delete");
    deleteImg.addEventListener("click", (e) => {
      let parent = deleteImg.closest(".saved-options__item");
      parent.remove();
    });

    savedOptions.appendChild(newItem);
    newItem.appendChild(newItemName);
    newItem.appendChild(newItemOwner);
    newItem.appendChild(newItemStars);
    newItem.appendChild(deleteImg);
  });

  searcherOptions.appendChild(option);
}

// удаляет сохранённые опции
function deleteOptions() {
  let currentOptions = searcherOptions.querySelectorAll("li");
  currentOptions.forEach((el) => {
    el.remove();
  });
}

// обёртка дебаунсер
getDataGit = debounce(getDataGit, 500);
