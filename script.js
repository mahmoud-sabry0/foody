const API = "https://www.themealdb.com/api/json/v1/1";
const MAX_ITEMS = 20;

const rowData = document.getElementById("rowData");
const searchContainer = document.getElementById("searchContainer");
const searchByName = document.getElementById("searchByName");
const searchByLetter = document.getElementById("searchByLetter");
const loader = document.getElementById("loader");
const sideNav = document.getElementById("sideNav");
const navToggle = document.getElementById("navToggle");

document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Helpers ----------

// API text is inserted as HTML, so escape it first
function esc(value = "") {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
}

function truncateWords(text = "", count = 20) {
  const words = (text || "").split(/\s+/).filter(Boolean);
  return words.length > count ? words.slice(0, count).join(" ") + "..." : words.join(" ");
}

function showMessage(text) {
  rowData.innerHTML = `<div class="col-12"><p class="status-msg">${esc(text)}</p></div>`;
}

// Only the latest request may render, so slow responses can't overwrite newer ones
let requestId = 0;

async function fetchData(path) {
  const id = ++requestId;
  loader.hidden = false;
  try {
    const response = await fetch(API + path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return id === requestId ? data : null;
  } catch (error) {
    if (id === requestId) {
      console.error(error);
      showMessage("Something went wrong. Please check your connection and try again.");
    }
    return null;
  } finally {
    if (id === requestId) loader.hidden = true;
  }
}

// ---------- Side navigation ----------

function openNav() {
  sideNav.classList.add("open");
  navToggle.querySelector("i").className = "bi bi-x-lg";
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Close menu");
}

function closeNav() {
  sideNav.classList.remove("open");
  navToggle.querySelector("i").className = "bi bi-list";
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
}

navToggle.addEventListener("click", () => {
  sideNav.classList.contains("open") ? closeNav() : openNav();
});

const pages = {
  home: () => getMeals(""),
  search: showSearchInputs,
  categories: getCategories,
  areas: getAreas,
  ingredients: getIngredients,
  contact: showContacts,
};

sideNav.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-page]");
  if (!btn) return;
  closeNav();
  if (btn.dataset.page !== "search") searchContainer.hidden = true;
  pages[btn.dataset.page]();
});

// Close the menu when clicking outside it or pressing Escape
document.addEventListener("click", (e) => {
  if (sideNav.classList.contains("open") && !sideNav.contains(e.target)) closeNav();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeNav();
});

// ---------- Cards (one click handler for everything rendered in rowData) ----------

rowData.addEventListener("click", (e) => {
  const card = e.target.closest("[data-type]");
  if (!card) return;
  const { type, value } = card.dataset;
  searchContainer.hidden = true;
  if (type === "meal") getMealDetails(value);
  else if (type === "category") filterMeals("c", value);
  else if (type === "area") filterMeals("a", value);
  else if (type === "ingredient") filterMeals("i", value);
});

rowData.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-type]")) {
    e.preventDefault();
    e.target.click();
  }
});

function displayMeals(meals) {
  if (!meals || meals.length === 0) {
    showMessage("No meals found.");
    return;
  }
  rowData.innerHTML = meals
    .slice(0, MAX_ITEMS)
    .map(
      (meal) => `
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="meal" data-type="meal" data-value="${esc(meal.idMeal)}" tabindex="0" role="button">
          <img src="${esc(meal.strMealThumb)}" alt="${esc(meal.strMeal)}" loading="lazy" />
          <div class="meal-layer">
            <h3>${esc(meal.strMeal)}</h3>
          </div>
        </div>
      </div>`
    )
    .join("");
}

// ---------- Home & search ----------

async function getMeals(name) {
  const data = await fetchData(`/search.php?s=${encodeURIComponent(name)}`);
  if (data) displayMeals(data.meals);
}

async function getMealsByLetter(letter) {
  const data = await fetchData(`/search.php?f=${encodeURIComponent(letter)}`);
  if (data) displayMeals(data.meals);
}

function showSearchInputs() {
  searchContainer.hidden = false;
  searchByName.value = "";
  searchByLetter.value = "";
  rowData.innerHTML = "";
  searchByName.focus();
}

function debounce(fn, delay = 400) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

searchByName.addEventListener(
  "input",
  debounce(() => {
    searchByLetter.value = "";
    getMeals(searchByName.value.trim());
  })
);

searchByLetter.addEventListener("input", () => {
  searchByName.value = "";
  const letter = searchByLetter.value.trim();
  if (/^[a-z]$/i.test(letter)) getMealsByLetter(letter);
  else if (letter === "") rowData.innerHTML = "";
  else showMessage("Please type a letter (a-z).");
});

// ---------- Categories ----------

async function getCategories() {
  const data = await fetchData("/categories.php");
  if (!data) return;
  rowData.innerHTML = data.categories
    .map(
      (cat) => `
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="meal category" data-type="category" data-value="${esc(cat.strCategory)}" tabindex="0" role="button">
          <img src="${esc(cat.strCategoryThumb)}" alt="${esc(cat.strCategory)}" loading="lazy" />
          <div class="meal-layer">
            <h3>${esc(cat.strCategory)}</h3>
            <p>${esc(truncateWords(cat.strCategoryDescription, 20))}</p>
          </div>
        </div>
      </div>`
    )
    .join("");
}

// ---------- Areas ----------

async function getAreas() {
  const data = await fetchData("/list.php?a=list");
  if (!data) return;
  rowData.innerHTML = data.meals
    .map(
      (area) => `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="list-card" data-type="area" data-value="${esc(area.strArea)}" tabindex="0" role="button">
          <i class="bi bi-house-door-fill"></i>
          <h3>${esc(area.strArea)}</h3>
        </div>
      </div>`
    )
    .join("");
}

// ---------- Ingredients ----------

async function getIngredients() {
  const data = await fetchData("/list.php?i=list");
  if (!data) return;
  rowData.innerHTML = data.meals
    .slice(0, MAX_ITEMS)
    .map((ing) => {
      const name = ing.strIngredient;
      const img = `https://www.themealdb.com/images/ingredients/${encodeURIComponent(name)}-Small.png`;
      return `
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="list-card" data-type="ingredient" data-value="${esc(name)}" tabindex="0" role="button">
          <img src="${esc(img)}" alt="${esc(name)}" loading="lazy" />
          <h3>${esc(name)}</h3>
          <p>${esc(truncateWords(ing.strDescription, 20))}</p>
        </div>
      </div>`;
    })
    .join("");
}

// ---------- Filter (category / area / ingredient) ----------

async function filterMeals(key, value) {
  const data = await fetchData(`/filter.php?${key}=${encodeURIComponent(value)}`);
  if (data) displayMeals(data.meals);
}

// ---------- Meal details ----------

async function getMealDetails(id) {
  const data = await fetchData(`/lookup.php?i=${encodeURIComponent(id)}`);
  if (!data) return;
  if (!data.meals) {
    showMessage("Meal not found.");
    return;
  }
  displayMealDetails(data.meals[0]);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function displayMealDetails(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]?.trim();
    if (ingredient) {
      const measure = meal[`strMeasure${i}`]?.trim() || "";
      ingredients.push(`<li class="alert alert-info">${esc(`${measure} ${ingredient}`.trim())}</li>`);
    }
  }

  const tags = (meal.strTags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => `<li class="alert alert-danger">${esc(t)}</li>`);

  const links = [
    meal.strSource && `<a target="_blank" rel="noopener" href="${esc(meal.strSource)}" class="btn btn-success">Source</a>`,
    meal.strYoutube && `<a target="_blank" rel="noopener" href="${esc(meal.strYoutube)}" class="btn btn-danger">Youtube</a>`,
  ].filter(Boolean);

  rowData.innerHTML = `
    <div class="col-12 col-md-4">
      <img class="w-100 rounded-3" src="${esc(meal.strMealThumb)}" alt="${esc(meal.strMeal)}" />
      <h2 class="details-title">${esc(meal.strMeal)}</h2>
    </div>
    <div class="col-12 col-md-8 details-info">
      <h3>Instructions</h3>
      <p>${esc(meal.strInstructions)}</p>
      <h3><span class="fw-bolder">Area : </span>${esc(meal.strArea)}</h3>
      <h3><span class="fw-bolder">Category : </span>${esc(meal.strCategory)}</h3>
      <h3>Recipes :</h3>
      <ul class="badge-list">${ingredients.join("")}</ul>
      ${tags.length ? `<h3>Tags :</h3><ul class="badge-list">${tags.join("")}</ul>` : ""}
      <div class="d-flex flex-wrap gap-2 mt-2">${links.join("")}</div>
    </div>`;
}

// ---------- Contact ----------

const validators = {
  name: { regex: /^[a-zA-Z؀-ۿ ]{2,}$/, msg: "Special characters and numbers not allowed" },
  email: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, msg: "Email not valid *example@yyy.zzz" },
  phone: { regex: /^\+?\d{10,14}$/, msg: "Enter valid Phone Number" },
  age: { regex: /^(?:[1-9]\d?|1[01]\d|120)$/, msg: "Enter valid age (1 - 120)" },
  password: {
    regex: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
    msg: "Enter valid password *Minimum eight characters, at least one letter and one number:*",
  },
};

function showContacts() {
  requestId++; // cancel any in-flight request
  loader.hidden = true;
  rowData.innerHTML = `
    <div class="col-12">
      <form id="contact" class="mx-auto py-4" style="max-width: 900px" novalidate>
        <div class="row g-4">
          ${contactInput("name", "text", "Enter Your Name")}
          ${contactInput("email", "email", "Enter Your Email")}
          ${contactInput("phone", "tel", "Enter Your Phone")}
          ${contactInput("age", "number", "Enter Your Age")}
          ${contactInput("password", "password", "Enter Your Password")}
          ${contactInput("repassword", "password", "Repassword")}
        </div>
        <div class="text-center mt-4">
          <button type="submit" id="submitBtn" class="btn btn-outline-danger px-4" disabled>Submit</button>
          <div id="formSuccess" class="alert alert-success mt-3" hidden>Thanks! Your message has been sent.</div>
        </div>
      </form>
    </div>`;

  const form = document.getElementById("contact");
  const touched = new Set();

  form.addEventListener("input", (e) => {
    touched.add(e.target.name);
    if (e.target.name === "password" && form.elements.repassword.value) touched.add("repassword");
    document.getElementById("formSuccess").hidden = true;
    validateForm(form, touched);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm(form, touched)) return;
    form.reset();
    touched.clear();
    validateForm(form, touched);
    document.getElementById("formSuccess").hidden = false;
  });
}

function contactInput(name, type, placeholder) {
  const msg =
    name === "repassword" ? "Passwords don't match" : validators[name].msg;
  return `
    <div class="col-12 col-md-6">
      <input name="${name}" type="${type}" class="form-control" placeholder="${placeholder}" />
      <div class="alert alert-danger w-100 mt-2 mb-0" id="${name}Alert" hidden>${msg}</div>
    </div>`;
}

function validateForm(form, touched) {
  let allValid = true;
  for (const name of [...Object.keys(validators), "repassword"]) {
    const value = form.elements[name].value.trim();
    const valid =
      name === "repassword"
        ? value !== "" && value === form.elements.password.value.trim()
        : validators[name].regex.test(value);
    const showError = touched.has(name) && !valid;
    form.elements[name].classList.toggle("is-invalid", showError);
    form.elements[name].classList.toggle("is-valid", touched.has(name) && valid);
    document.getElementById(`${name}Alert`).hidden = !showError;
    if (!valid) allValid = false;
  }
  document.getElementById("submitBtn").disabled = !allValid;
  return allValid;
}

// ---------- Start ----------

getMeals("");
