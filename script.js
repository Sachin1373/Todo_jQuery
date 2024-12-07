$(document).ready(function () {
  const baseAPIUrl = "https://www.themealdb.com/api/json/v1/1/";

  // Fetch categories dynamically
  fetchCategories();
  fetchAreas();

  // Fetch Categories
  function fetchCategories() {
    $.getJSON(`${baseAPIUrl}categories.php`, function (data) {
      const categories = data.categories;
      const categoryDropdown = $("#categoryFilter");
      categories.forEach((category) => {
        categoryDropdown.append(`<option value="${category.strCategory}">${category.strCategory}</option>`);
      });
    });
  }

  // Fetch Areas
  function fetchAreas() {
    $.getJSON(`${baseAPIUrl}list.php?a=list`, function (data) {
      const areas = data.meals;
      const areaDropdown = $("#areaFilter");
      areas.forEach((area) => {
        areaDropdown.append(`<option value="${area.strArea}">${area.strArea}</option>`);
      });
    });
  }

  // Handle Search button click
  $("#searchBtn").click(function () {
    const recipeName = $("#recipeSearch").val().trim();
    const ingredient = $("#ingredientSearch").val().trim();
    const category = $("#categoryFilter").val();
    const area = $("#areaFilter").val();

    if (recipeName) {
      searchByName(recipeName);
    } else if (ingredient) {
      filterByIngredient(ingredient);
    } else if (category) {
      filterByCategory(category);
    } else if (area) {
      filterByArea(area);
    } else {
      alert("Please enter a search term, ingredient, category, or area to proceed.");
    }
  });

  // Search by name
  function searchByName(query) {
    $.getJSON(`${baseAPIUrl}search.php?s=${query}`, function (data) {
      renderRecipes(data.meals || []);
    });
  }

  // Filter by ingredient
  function filterByIngredient(ingredient) {
    $.getJSON(`${baseAPIUrl}filter.php?i=${ingredient}`, function (data) {
      renderRecipes(data.meals || []);
    });
  }

  // Filter by category
  function filterByCategory(category) {
    $.getJSON(`${baseAPIUrl}filter.php?c=${category}`, function (data) {
      renderRecipes(data.meals || []);
    });
  }

  // Filter by area
  function filterByArea(area) {
    $.getJSON(`${baseAPIUrl}filter.php?a=${area}`, function (data) {
      renderRecipes(data.meals || []);
    });
  }

  // Render recipes dynamically into the DOM
  function renderRecipes(recipes) {
    $("#recipeContainer").html("");
    if (!recipes.length) {
      $("#recipeContainer").html('<div class="col-12 text-center">No recipes found. Try again.</div>');
      return;
    }

    recipes.forEach((recipe) => {
      const recipeHTML = `
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm">
          <img src="${recipe.strMealThumb}" class="card-img-top" alt="${recipe.strMeal}" />
          <div class="card-body">
            <h5 class="card-title">${recipe.strMeal}</h5>
            <button class="btn btn-primary btn-sm" onclick="showRecipeDetails('${recipe.idMeal}')">View Details</button>
          </div>
        </div>
      </div>`;
      $("#recipeContainer").append(recipeHTML);
    });
  }
});

// Modal: Show Recipe Details
function showRecipeDetails(mealId) {
  const apiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
  $.getJSON(apiUrl, function (data) {
    const recipe = data.meals[0];
    const modalContent = `
      <h3>${recipe.strMeal}</h3>
      <img src="${recipe.strMealThumb}" class="img-fluid mb-3" />
      <p><strong>Category:</strong> ${recipe.strCategory}</p>
      <p><strong>Area:</strong> ${recipe.strArea}</p>
      <p><strong>Instructions:</strong> ${recipe.strInstructions}</p>
      <a href="${recipe.strSource}" target="_blank" class="btn btn-success mt-2">View Full Recipe Source</a>
    `;
    $("#recipeDetails").html(modalContent);
    const myModal = new bootstrap.Modal(document.getElementById("recipeModal"));
    myModal.show();
  });
}
