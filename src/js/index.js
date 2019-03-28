// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView'
import { elements } from './views/base';

/* Global state
*-Search obj
*- Current recipe obj
*-Shopping List obj
*-Liked recipes
*/
const state = {
  
};

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
    //4 Search for recipes
    await state.search.getResults();

    //5  Render results on UI
    searchView.renderResults(state.search.result);
  }
  
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

const search = new Search('pizza');
console.log(search);
