// Global app controller

//
import axios from 'axios';

async function getResults(query) {
  const proxy = 'https://cors-anywhere.herokuapp.com/';
  const key = '983511c6e69e4d75b55b0a603a2dc705';
  try {
    const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${query}`);
    const recipes = res.data.recipes
    console.log(recipes);
  } catch (error) {
    alert("There seems to be an error");
  }
}

getResults('pizza');