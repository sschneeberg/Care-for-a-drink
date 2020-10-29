//Plan:
//user clicks go DONE
//get value, make call to drinks API -- Fetch DONE
//display an image, hiding the search bar DONE
//set interval to update img src to next one by incrementing index to active --  need global index to increments DONE
//on click stop, clear interval, clear image div, reset index to 0, clear text value DONE


//functions:

function fetchSlides(keyword) {
    //using TheCocktailDb: https://www.thecocktaildb.com/api.php?ref=apilist.fun for practice/educational purposes only
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${keyword}`)
        .then(response => response.json())
        .then(drinkData => {
            let drink = drinkData.drinks[0];
            const url = drink.strDrinkThumb;
            const title = drink.strDrink;
            newElem = createImgElement(url, title);
            document.body.appendChild(newElem);
            stopButton = createNewElement('button', 'CLOSE');
            stopButton.id = 'stop';
            document.body.appendChild(stopButton);
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

//update img element
function updateImgSrc(drinkObj) {
    //grab next drink by increasing
    index = index + 1;
    //check if its the last one
    if (index === drinkObj.drinks.length) {
        index = 0; //loop to start
    }
    const drinkImg = document.querySelector('img');
    let url = drinkObj.drinks[index].strDrinkThumb;
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
    drinkTitle.innerText = drinkObj.drinks[index].strDrink;
}

//clear screen
function clearDisplay() {
    clearInterval(changePhoto);
    const imgDisplay = document.querySelector('.displayContainer');
    document.body.removeChild(imgDisplay);
    const stopButton = document.querySelector('#stop');
    document.body.removeChild(stopButton);
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