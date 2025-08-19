const container = document.getElementById("cocktail-container");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");


const fetchCocktailData = (data) => {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${data}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      DisplayCocktail(data);
    })
    .catch((error) => {
      console.error("Error fetching cocktail data:", error);
    });
};

fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    DisplayCocktail(data);
  })
  .catch((error) => {
    console.error("Error fetching cocktail data:", error);
  });

const fetchDetails = (id) => {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      renderDetails(data.drinks[0]);
    })
    .catch((error) => {
      console.error("Error fetching cocktail details:", error);
    });
};


searchButton.addEventListener("click", () => {
  const data = searchInput.value.trim();
  if (data) {
    fetchCocktailData(data);
  }
});


const DisplayCocktail = (cocktail) => {
  container.innerHTML = "";
  if (Array.isArray(cocktail.drinks) && cocktail.drinks.length > 0) {
    cocktail.drinks.slice(0, 8).forEach((drink) => {
      const cocktailCard = document.createElement("div");
      cocktailCard.classList.add("card");

    cocktailCard.innerHTML = `
            <div class="card-content">
              <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
              <p>Name: ${drink.strDrink}</p>
              <p>Category: ${drink.strCategory}</p>
              <p>Instructions: ${drink.strInstructions ? drink.strInstructions.slice(0, 15) : ''}</p>
            </div>
            <div class="card-buttons">
              <button class="add-to-group" id="add-to-group-${drink.idDrink}">Add to group</button>
              <button class="view-details" id="view-details-${drink.idDrink}" data-id="${drink.idDrink}">Details</button>
            </div>
        `;
      const addToGroupButton = cocktailCard.querySelector(`#add-to-group-${drink.idDrink}`);
      addToGroupButton.addEventListener("click", () => addToGroup(drink));

      const detailsButton = cocktailCard.querySelector(`#view-details-${drink.idDrink}`);
      detailsButton.addEventListener("click", (event) => {
        const drinkId = event.target.getAttribute("data-id");
        if (drinkId) {
          fetchDetails(drinkId);
        } else {
          console.error("Drink ID not found for details button.");
        }
      });

      container.appendChild(cocktailCard);
    });
  } else {
    console.log("No drinks found");
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error");
    errorDiv.textContent = "No drinks found. Please try a different search.";
    container.appendChild(errorDiv);
  }
};

const addToGroup = (drink) => {
  const orderList = document.querySelector(".order-list");
  const totalCart = orderList.querySelector("h2");
  const currentCount = parseInt(totalCart.textContent.match(/\d+/)[0], 10);
  const maxGroup = 7;
  if (currentCount < maxGroup) {
    totalCart.textContent = `Total Cart: ${currentCount + 1}`;

    const newItem = document.createElement("div");
    newItem.classList.add("order-item");
    newItem.innerHTML = `
                <p>${currentCount + 1}</p>
                <img src="${drink.strDrinkThumb}" alt="${
      drink.strDrink
    }" width="50">
                <p>${drink.strDrink}</p>
            `;
    orderList.appendChild(newItem);
  } else {
    alert("You cannot add more than 7 items to the group.");
  }
};


const renderDetails = (drink) => {
  const detailsContainer = document.querySelector(".details-container");
  let ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    const measure = drink[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push(`${measure ? measure : ''} ${ingredient}`.trim());
    }
  }
  detailsContainer.innerHTML = `
    <div class="details-content">
      <h2>${drink.strDrink}</h2>
      <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
      <h3>Details:</h3>
      <p><strong>Category:</strong> ${drink.strCategory}</p>
      <p><strong>Alcoholic:</strong> ${drink.strAlcoholic}</p>
      <p><strong>Glass:</strong> ${drink.strGlass}</p>
      <p><strong>Instructions:</strong> ${drink.strInstructions}</p>
      <p><strong>Ingredients:</strong></p>
      <ul>${ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
      <button class="close-details">Close</button>
    </div>
  `;
  detailsContainer.style.display = "block";
};

window.onclick = function (event) {
  const detailsContainer = document.querySelector(".details-container");
  if (event.target === detailsContainer) {
    detailsContainer.style.display = "none";
  }
};
const closeDetails = () => {
  const detailsContainer = document.querySelector(".details-container");
  detailsContainer.style.display = "none";
};
document.addEventListener("click", (event) => {
  if (event.target && event.target.classList.contains("close-details")) {
    closeDetails();
  }
});
