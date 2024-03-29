import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResultPages.innerHTML = ''
};

export const highlisghtSelected = id => {
    document.querySelectorAll('.results__link').forEach(result => {
        result.classList.remove('results__link--active');
    });

    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
}

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((accumulator, current) => {
            if (accumulator + current.length <= limit) {
                newTitle.push(current);
            }
            return accumulator + current.length;
        }, 0);

        // Return the result
        return `${newTitle.join(' ')} ...`;
    }

    return title;
};

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;

    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

// type 'prev' or 'next'
const createButton = (page, type) => `
   <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
       <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
       <svg class="search__icon">
           <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
       </svg>
   </button>
`;

const renderButtons = (page, numResults, resultsPerPage) => {
    const pages = Math.ceil(numResults / resultsPerPage);
    let button;

    if (pages > 1) {
        if (page === 1) {
            // Only display page + 1
            button = createButton(page, 'next');
        } else if (page < pages) {
            // Display page - 1 and page + 1
            button = createButton(page, 'prev') + createButton(page, 'next');
        } else if (page === pages){
            // Display page -1
            button = createButton(page, 'prev');
        }
    }

    if (button) elements.searchResultPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
    // Render results of current page
    const start = (page - 1) * resultsPerPage;
    const end = page * resultsPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    // Render pagination buttons
    renderButtons(page, recipes.length, resultsPerPage);
};