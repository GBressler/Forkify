import axios from 'axios';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const key = '983511c6e69e4d75b55b0a603a2dc705';
    try {
      const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
      console.log(res);
      this.result = res.data.recipes;
      console.log(this.result);
    } catch (error) {
      alert("There seems to be an error");
    }
  }
}



