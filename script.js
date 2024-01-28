let loader = $("#lod");
$("#icon").on("click", function () {
  $(".nav-tab").animate({ width: "toggle", paddingInline: "toggle" }, 1000);
});
function getmeals() {
  $(".nav-tab").animate({ width: "toggle", paddingInline: "toggle" }, 1000);
  $("#searchContainer").hide();
  function showData(list) {
    let eatings = "";

    for (let index = 0; index < list.meals.length; index++) {
      const element = list.meals[index];

      let mainData = `
        <div class="col-md-3">
            <div
            onclick="getMealDetails('${element.idMeal}')"
            class="meal position-relative overflow-hidden rounded-2 cursor-pointer"
            >
            <img
                class="w-100"
                src="${element.strMealThumb}"
                alt=""
                srcset=""
            />
            <div
                class="meal-layer position-absolute d-flex align-items-center text-black p-2"
            >
                <h3>${element.strMeal}</h3>
            </div>
            </div>
        </div>
      `;

      eatings = eatings + mainData;
    }

    document.getElementById("meals").innerHTML = eatings;
    console.log("halo");
  }

  async function getAPI(result) {
    loader.show();
    let getAPI = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=n`
    );
    const data = await getAPI.json();
    showData(data);
    loader.hide();
    console.log(data);
  }
  getAPI();
}
getmeals();

function getCategories() {
  $(".nav-tab").animate({ width: "toggle", paddingInline: "toggle" }, 1000);
  $("#searchContainer").hide();
  function showData(list) {
    let eatings = "";

    for (let index = 0; index < list.categories.length; index++) {
      const element = list.categories[index];

      let mainData = `
        <div class="col-md-3">
        <div
          onclick="getMealDetails('52977')"
          class="meal position-relative overflow-hidden rounded-2 cursor-pointer"
        >
        <img class="w-100" src="${element.strCategoryThumb}" alt="" srcset="">
          <div
            class="meal-layer position-absolute  align-items-center text-black p-2"
          >
            <h3>${element.strCategory}</h3>
            <p>${element.strCategoryDescription}</p>
          </div>
        </div>
      </div>
        `;

      eatings = eatings + mainData;
    }

    document.getElementById("meals").innerHTML = eatings;
    console.log("halo");
  }

  async function getAPI(result) {
    loader.show();
    let getAPI = await fetch(
      `https://www.themealdb.com/api/json/v1/1/categories.php`
    );
    const data = await getAPI.json();
    showData(data);
    loader.hide();
    console.log(data);
  }
  getAPI();
}

function getArea() {
  function showData(list) {
    $(".nav-tab").animate({ width: "toggle", paddingInline: "toggle" }, 1000);
    $("#searchContainer").hide();
    let eatings = "";

    for (let index = 0; index < list.meals.length; index++) {
      const element = list.meals[index];

      let mainData = `
        <div class="col-md-3">
            <div class="area rounded-2 text-center cursor-pointer">
                <i class="bi bi-houses-fill"></i>
                <h3>${element.strArea}e</h3>
            </div>
        </div>
            
         `;

      eatings = eatings + mainData;
    }

    document.getElementById("meals").innerHTML = eatings;
    console.log("halo");
  }

  async function getAPI(result) {
    let getAPI = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
    );
    const data = await getAPI.json();
    showData(data);
    console.log(data);
  }
  getAPI();
}
/////////////
function getIngredientsMeals() {
  function showData(list) {
    $(".nav-tab").animate({ width: "toggle", paddingInline: "toggle" }, 1000);
    $("#searchContainer").hide();
    let eatings = "";

    for (let index = 0; index < list.meals.length; index++) {
      const element = list.meals[index];

      let mainData = `
        <div class="col-md-3">
        <div  class="rounded-2 text-center cursor-pointer">
                <i class="bi bi-aspect-ratio-fill"></i>
                <h3>${element.strArea}</h3>
                <p>${element.strIngredientsDescription}</p>
        </div>
  </div>
              
           `;

      eatings = eatings + mainData;
    }

    document.getElementById("meals").innerHTML = eatings;
    console.log("halo");
  }

  async function getAPI(result) {
    let getAPI = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast`
    );
    const data = await getAPI.json();
    showData(data);
    console.log(data);
  }
  getAPI();
}
////////

function showSearchInputs() {
  $(".nav-tab").animate({ width: "toggle", paddingInline: "toggle" }, 1000);
  
  $("#searchContainer").show();
  document.getElementById("meals").innerHTML = "";
}

const search = document.getElementById("search-by-nme");
searh.addEventListener("keyup", function (e) {
  let value = e.target.value;
  getmealssearch(value);
});

/////////////
function getIngredients() {
  function showData(list) {
    $(".nav-tab").animate({ width: "toggle", paddingInline: "toggle" }, 1000);
    $("#searchContainer").hide();
    let eatings = "";

    for (let index = 0; index < list.meals.length; index++) {
      const element = list.meals[index];

      let mainData = `
          <div class="col-md-3">
              <div class="area rounded-2 text-center cursor-pointer">
                  <i class="bi bi-houses-fill"></i>
                  <h3>${element.strIngredient}</h3>
                  <p>${element.strDescription} <p/>
              </div>
          </div>
              
           `;

      eatings = eatings + mainData;
    }

    document.getElementById("meals").innerHTML = eatings;
    console.log("halo");
  }

  async function getAPI(result) {
    let getAPI = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
    );
    const data = await getAPI.json();
    showData(data);
    console.log(data);
  }
  getAPI();
}

//////
function getmealssearch(value) {
  function showData(list) {
    // $(".nav-tab").animate({ width: "toggle", paddingInline: "toggle" }, 1000);
    let eatings = "";

    for (let index = 0; index < list.meals.length; index++) {
      const element = list.meals[index];

      let mainData = `
         
      <div class="col-md-3">
      <div
        onclick="getMealDetails('${element.idMeal}')"
        class="meal position-relative overflow-hidden rounded-2 cursor-pointer"
      >
      <img class="w-100" src="${element.strMealThumb}" alt="" srcset="">
        <div
          class="meal-layer position-absolute  align-items-center text-black p-2"
        >
          <h3>${element.strMeal}</h3>
          
        </div>
      </div>
    </div>
           `;

      eatings = eatings + mainData;
    }

    document.getElementById("meals").innerHTML = eatings;
    console.log("halo");
  }

  async function getAPI(result) {
    let getAPI = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`
    );
    const data = await getAPI.json();
    showData(data);
    console.log(data);
  }
  getAPI();
}
/////////
function getMealDetails(value) {
  function showData(list) {
    // $(".nav-tab").animate({ width: "toggle", paddingInline: "toggle" }, 1000);
    let eatings = "";

    for (let index = 0; index < list.meals.length; index++) {
      const element = list.meals[index];

      let mainData = `
      <div class="container">
      <div class="row py-5 g-4 " id="rowData">
<div class="col-md-4" id="Sushi">
          <img class="w-100 rounded-3" src="${element.strMealThumb}" alt="">
              <h2>${element.strMeal}</h2>
      </div>
      <div class="col-md-8">
          <h3>Instructions</h3>
          
          <p>${element.strInstructions}
</p>
          <h3><span class="fw-bolder">Area : </span>${element.strArea}</h3>
          <h3><span class="fw-bolder">Category : </span>${element.strCategory}</h3>
          <h3>Recipes :</h3>
          <ul class="list-unstyled d-flex g-3 flex-wrap">
              <li class="alert alert-info m-2 p-1">${element.strIngredient1}</li>
              <li class="alert alert-info m-2 p-1">${element.strIngredient2}</li>
              <li class="alert alert-info m-2 p-1">${element.strIngredient3}</li>
              <li class="alert alert-info m-2 p-1">${element.strIngredient4}</li>
              <li class="alert alert-info m-2 p-1">${element.strIngredient5}</li>
              <li class="alert alert-info m-2 p-1">${element.strIngredient6}</li>
              <li class="alert alert-info m-2 p-1">${element.strIngredient7}</li>
          </ul>

          <h3>Tags :</h3>
          <ul class="list-unstyled d-flex g-3 flex-wrap">
              
          </ul>

          <a target="_blank" href="" class="btn btn-success">Source</a>
          <a target="_blank" href="" class="btn btn-danger">Youtube</a>
      </div></div>
  </div>
     
           `;

      eatings = eatings + mainData;
    }

    document.getElementById("meals").innerHTML = eatings;
    console.log("halo");
  }

  async function getAPI(result) {
    let getAPI = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${value}`
    );
    const data = await getAPI.json();
    showData(data);
    console.log(data);
  }
  getAPI();
}
