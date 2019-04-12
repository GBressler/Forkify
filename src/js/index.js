// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';

/* Global state
*-Search obj
*- Current recipe obj
*-Shopping List obj
*-Liked recipes
*/
const state = {
  
};
window.state = state;

/***SEARCH CONTROLLER****/
const controlSearch = async () => {
  //1 Get query from view
  const query = searchView.getInput(); //To Do
  console.log(query);

  if (query) {
    //2  New search obj and add to state
    state.search = new Search(query);

    //3  Prep UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    try {
       //4 Search for recipes
    await state.search.getResults();

    //5  Render results on UI
    clearLoader();
    searchView.renderResults(state.search.result);
    } catch (err) {
       alert('Something went wrong with the search...');
       clearLoader();
    }
  }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
      const goToPage = parseInt(btn.dataset.goto, 10);
      searchView.clearResults();
      searchView.renderResults(state.search.result, goToPage);
      console.log(goToPage);
    }
});


const search = new Search('pizza');
console.log(search);



/***RECIPE CONTROLLER****/
const controlRecipe = async () => {
  //Get ID from URL
  const id = window.location.hash.replace('#', '');
  console.log(id);
  
  if (id) {
    //Prep UI for Changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    //Create new recipe obj
    state.recipe = new Recipe(id);
    try {
      //Get recipe data & parse Ingredients
      await state.recipe.getRecipe();
      console.log(state.recipe.ingredients);
      state.recipe.parseIngredients();

    //Calculate serv & time
    state.recipe.calcTime();
    state.recipe.calcServings();
    //render recipe
    clearLoader();
    recipeView.renderRecipe(state.recipe);
    } catch (error) {
      alert('There was an processing error!');
    }
    
  }

};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/***LIST CONTROLLER****/
const controlList = () => {
  //Create a new list IF there isn't one already
  if (!state.list) state.list = new List();

  //Add each ingredient to the list & UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
} 

/***LIKES CONTROLLER****/

const controlLike = () => {
  if(!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  //User has NOT liked current recipe
  if (!state.likes.isLiked(currentID)) {
    //
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    //Toggle the like button

    //Add like to  UI list
    console.log(state.likes);
  } else {
    //Remove like from the state
    state.likes.deleteLike(currentID);
    //Toggle the like button

    //Add like to  UI list
    console.log(state.likes);
  }
};

//Handling delete and update list item events
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  //Handle the delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    //Delete from state
    state.list.deleteItem(id);

    //Delete fromn UI
    listView.deleteItem(id);
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    //Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    //Increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    controlLike();
  }
  console.log(state.recipe);
});

window.l = new List();