import axios from 'axios';

class imagesAPI {
  #query;
  #page;
  #perPage;
  #totalHits;
  #totalPages;

  constructor() {
    this.#query = '';
    this.#page = 1;
    this.#perPage = 40;
    this.#totalHits = 0;
    this.#totalPages = 1;
  }

  async getImages() {
    const KEY = '24385209-6a81cc27bd8e526ba32a03073';

    const axiosConfig = {
      // image search
      baseURL: 'https://pixabay.com/api/',
      // pixabay options
      params: {
        key: `${KEY}`,
        q: `${this.#query}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',

        page: this.page,
        per_page: this.perPage,
      },
    };

    // `https://pixabay.com/api/?key=${KEY}&q=yellow+flowers&image_type=photo`
    const { data } = await axios(axiosConfig);
    return data;
  }

  get query() {
    return this.#query;
  }

  set query(newQuery) {
    this.#query = newQuery;
  }

  get page() {
    return this.#page;
  }

  set page(newPage) {
    this.#page = newPage;
  }

  get perPage() {
    return this.#perPage;
  }

  set perPage(newPerPage) {
    this.#perPage = newPerPage;
  }

  get totalHits() {
    return this.#totalHits;
  }

  set totalHits(newTotalHits) {
    this.#totalHits = newTotalHits;
  }

  get totalPages() {
    return this.#totalPages;
  }

  set totalPages(newTotalPages) {
    this.#totalPages = newTotalPages;
  }
}

export default imagesAPI;
