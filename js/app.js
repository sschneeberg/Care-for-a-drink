//Plan:
//user clicks go DONE
//get value, make call to drinks API -- Fetch DONE
//display an image, hiding the search bar DONE
//set interval to update img src to next one by incrementing index to active --  need global index to increments DONE
//on click stop, clear interval, clear image div, reset index to 0, clear text value DONE


//functions:

function fetchSlides(keyword) {
    //using TheCocktailDb: https://www.thecocktaildb.com/api.php?ref=apilist.fun for practice/educational purposes only
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${keyword}`)
        .then(response => response.json())
        .then(drinkData => {
            let drink = drinkData.drinks[0];
            const url = drink.strDrinkThumb;
            const title = drink.strDrink;
            const ingredients = getList(drink, 'Ingredient');
            const measurements = getList(drink, 'Measure');
            const recipe = drink.strInstructions;
            newDrink = createImgElement(url, title);
            document.body.appendChild(newDrink);
            drinkRecipe = createRecipeElement(ingredients, measurements, recipe);
            /* BOOTSTRAP COLLAPSE TRIGGER
            <p>
            <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
              Button with data-target
            </button>
            </p> */
            collapseButton = createNewElement('button', 'MORE');
            collapseButton.setAttribute('id', 'recipe');
            collapseButton.setAttribute('type', 'button');
            collapseButton.setAttribute('data-toggle', 'collapse');
            collapseButton.setAttribute('data-target', '#collapseRecipe');
            collapseButton.setAttribute('aria-expanded', 'false');
            collapseButton.setAttribute('aria-controls', 'collapseRecipe');
            stopButton = createNewElement('button', 'CLOSE');
            stopButton.id = 'stop';
            document.body.appendChild(stopButton);
            document.body.appendChild(collapseButton);
            document.body.appendChild(drinkRecipe);
            changePhoto = setInterval(updateImgSrc, 3000, drinkData);
            //stop:
            document.getElementById('stop').addEventListener('click', clearDisplay);
        })
        .catch(error => {
            console.log(error);
            const display = createErrorElement();
            document.body.appendChild(display);
            stopButton = createNewElement('button', 'CLOSE');
            stopButton.id = 'stop';
            display.appendChild(stopButton);
            //stop:
            document.getElementById('stop').addEventListener('click', clearDisplay)

        })
}

//create new element
function createNewElement(tagName, text) {
    const newElement = document.createElement(tagName);
    newElement.textContent = text;
    return newElement;
}

//create img element
function createImgElement(url, title) {
    const container = createNewElement('div');
    container.classList.add('displayContainer');
    const newImg = createNewElement('img');
    newImg.setAttribute('src', url);
    container.appendChild(newImg);
    const drinkTitle = createNewElement('h5', title);
    container.appendChild(drinkTitle);
    return container;
}

function createRecipeElement(ingredients, measurements, recipe) {
    /* BOOTSTRAP COLLAPSE CONTENT
    <div class="collapse" id="collapseExample">
      <div class="card card-body">
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
      </div>
    </div>
    */
    collapse = createNewElement('div');
    collapse.classList.add('collapse');
    collapse.setAttribute('id', 'collapseRecipe');
    card = createNewElement('div');
    card.classList.add('card');
    card.classList.add('card-body');
    ingredientList = createNewElement('ul');
    for (i = 0; i < ingredients.length; i++) {
        if (ingredients[i] != measurements[i]) {
            if (measurements[i] === null) {
                ingredient = createNewElement('li', `${ingredients[i]}`);
            } else {
                ingredient = createNewElement('li', `${measurements[i]} of ${ingredients[i]}`);
            }
            ingredientList.appendChild(ingredient);
        }
    }
    recipeText = createNewElement('p', recipe);
    recipeText.classList.add('recipeText');
    card.appendChild(ingredientList);
    card.appendChild(recipeText);
    collapse.appendChild(card);
    return collapse
}

//update img element
function updateImgSrc(drinkObj) {
    //grab next drink by increasing
    index = index + 1;
    //check if its the last one
    if (index === drinkObj.drinks.length) {
        index = 0; //loop to start
    }
    const drinkImg = document.querySelector('img');
    let drink = drinkObj.drinks[index];
    let url = drink.strDrinkThumb;
    //drinkImg.style.opacity = 0;
    //setTimeout(function() {
    drinkImg.setAttribute('src', url);
    drinkImg.classList.add('slide-in');
    setTimeout(function() {
        drinkImg.classList.remove('slide-in');
    }, 500);
    //drinkImg.style.opacity = 1;
    // }, 500);
    let drinkTitle = document.querySelector('h5');
    drinkTitle.innerText = drink.strDrink;
    updateRecipe(drink);
}

function updateRecipe(drink) {
    const ingredients = getList(drink, 'Ingredient');
    const measurements = getList(drink, 'Measure');
    const recipe = drink.strInstructions;
    recipeText = document.querySelector('.recipeText')
    recipeText.innerText = recipe;
    list = document.querySelector('ul');
    card = document.querySelector('.card-body');
    card.removeChild(list);
    ingredientList = createNewElement('ul');
    for (i = 0; i < ingredients.length; i++) {
        if (ingredients[i] != measurements[i]) {
            if (measurements[i] === null) {
                ingredient = createNewElement('li', `${ingredients[i]}`);
            } else {
                ingredient = createNewElement('li', `${measurements[i]} of ${ingredients[i]}`);
            }
            ingredientList.appendChild(ingredient);
        }
    }
    card.insertBefore(ingredientList, recipeText);


    //got updated info, now change the DOM
}

//clear screen
function clearDisplay() {
    clearInterval(changePhoto);
    const imgDisplay = document.querySelector('.displayContainer');
    document.body.removeChild(imgDisplay);
    const stopButton = document.querySelector('#stop');
    document.body.removeChild(stopButton);
    const recipeButton = document.querySelector('#recipe');
    document.body.removeChild(recipeButton);
    const collapse = document.querySelector('.collapse');
    document.body.removeChild(collapse);
    document.querySelector('input').value = '';
    index = 0;
}

//error screen
function createErrorElement() {
    //remove current container if up
    //create new one
    const container = createNewElement('div');
    container.classList.add('displayContainer');
    const error = createNewElement('h3', '0 RESULTS FOUND');
    const msg = createNewElement('p', 'No drinks match your search criteria, please try another keyword.');
    container.appendChild(error);
    container.appendChild(msg);
    return container

}

//get lsit of ingredients and measurements
function getList(drink, listname) {
    let list = [];
    for (i = 1; i < 16; i++) {
        //no drink has more than 15 things listed
        list.push(drink[`str${listname}${i}`]);
    }
    return list;
}

//globals:

let index = 0;
let changePhoto = null;

//actions:

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
        let keyword = document.querySelector('input').value;
        keyword = keyword.toLowerCase();
        fetchSlides(keyword);
    })
})