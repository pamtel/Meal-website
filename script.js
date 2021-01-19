let searchInput = document.getElementById("searchInput");
let submit = document.getElementById("submit");
let random = document.getElementById("random");
let header = document.getElementById("header");
let mealPhotos = document.getElementById("mealPhotos");
let singleMeal = document.getElementById("singleMeal");


// 1. Where is the event coming from?
// 2. What is event.preventDefault(); preventing?
// 3. Use a good variable name for your "allow" variable
submit.addEventListener("click", mealInfo);
function mealInfo(event){
    // event.preventDefault() method cancels the event and the default action will not occur 
    event.preventDefault();
    singleMeal.innerHTML = "";
    const allow = searchInput.value;
    // console.log(allow);
    // trim() method removes whitespaces from both sides of a string
    if(allow.trim()){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${allow}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            header.innerHTML = `<h2>Search result for '${allow}':</h2>`;
            if(data.meals === null){
                header.innerHTML = `<p>There are no results. Try again</p>`;
            }else{
                let object = data.meals.map((info) => {
                    // console.log(info);
    
                    return `<div class="meal">
                    <img src="${info.strMealThumb}" alt="${info.strMeal}"/>
                    <div class="content" data-meal="${info.idMeal}">
                    <h3>${info.strMeal}</h3>
                    </div>
                    </div>`
                })
                // append
                console.log(object.join(""));
                mealPhotos.innerHTML = object.join("");
            }
        });
        // to clear the input afterwards
        searchInput.value = "";
    }else{
        alert("Please enter a search term")  
    }
}

// maeal ID
submit.addEventListener("click", mealInfo);
mealPhotos.addEventListener("click", (e) => {
    const mealDetails = e.path.find((allow) => {
        if(allow.classList){
            return allow.classList.contains("content")
        }else{
            return false;
        }
    });
    if(mealDetails){
        const mealID = mealDetails.getAttribute("data-meal")
        getMealId(mealID);
    }
});
function getMealId(mealID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
        const dish = data.meals[0];
        addMealToDOM(dish)
    });
}
// loop through the meal ingredients
function addMealToDOM(dish) {
    const ingredients = [];
    for(let i = 1; i <= 20; i++) {
        if(dish[`strIngredient${i}`]){
            ingredients.push(
                `${dish[`strIngredient${i}`]}-${dish[`strMeasure${i}`]}`
            );
        } else {
            break;
        }
    }
    singleMeal.innerHTML = `
    <div class="single-meal">
        <h1>${dish.strMeal}</h1>
        <img src="${dish.strMealThumb}" alt="${dish.strMeal}"/>
        <div class="single-meal-info">
            <p>${dish.strCategory}</p>
            <p>${dish.strArea}</p>
        </div>
        <div class="main">
            <p>${dish.strInstructions}</p>
            <h2>Ingredients</h2>
        <ul>
            ${ingredients.map((allIngredients) => `<li>${allIngredients}</li>`).join("")}
        </ul>
        </div>
    </div>`
}

// random meal
random.addEventListener("click", randomMeal);
function randomMeal(){
    mealPhotos.innerHTML = "";
    header.innerHTML = "";
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then((res) => res.json())
    .then(data => {
        const dish = data.meals[0];
        addMealToDOM(dish)
    })
}