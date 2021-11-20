import './sass/main.scss';
import axios from 'axios';
import { Notify } from 'notiflix';
import { Loading } from 'notiflix';

import debounce from 'lodash/debounce';
import imagesAPI from './js/api-service';
import UI from './js/ui-service';
import getRefs from './js/refs';
import initModal from './js/modal';
import smoothScrollAfterRender from './js/scroll';

const refs = getRefs();
const DEBOUNCE_DELAY = 300;
const DEBOUNCE_SETTINGS = { leading: true, trailing: false };

const imageAPI = new imagesAPI();

const fetchAndRenderImages = async () => {
  try {
    const response = await imageAPI.getImages();
    imageAPI.totalHits = response.totalHits;
    imageAPI.totalPages = imageAPI.totalHits / imageAPI.perPage;

    if (response.hits.length < 1) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      return;
    }

    UI.renderGallery(response.hits);
    UI.show(refs.loadMoreBtn);

    if (imageAPI.page > 1) {
      smoothScrollAfterRender();
    }

    imageAPI.page += 1;
  } catch (error) {
    console.error(error);
  } finally {
    UI.enable(refs.searchBtn);
  }
};

const onSubmitGetImages = async e => {
  e.preventDefault();
  UI.disable(refs.searchBtn);
  UI.clearUI();
  imageAPI.query = e.target.elements.searchQuery.value.trim();
  imageAPI.page = 1;

  await fetchAndRenderImages();

  if (imageAPI.totalHits > 0) {
    Notify.success(`Hooray! We found ${imageAPI.totalHits} images.`);
  }

  try {
    if (refs.modal) {
      refs.modal.destroy();
    }

    refs.modal = initModal('.gallery a');
  } catch (error) {
    console.error(error);
  }
};

const showAlertPopup = () => {
  Notify.failure("We're sorry, but you've reached the end of search results.");
};

const onLoadMore = async e => {
  UI.hide(refs.loadMoreBtn);

  // Check the end of the collection to display an alert
  if (imageAPI.page >= imageAPI.totalPages) {
    return showAlertPopup();
  }

  await fetchAndRenderImages();

  try {
    refs.modal.refresh();
  } catch (error) {
    console.error(error);
  }
};

refs.searchForm.addEventListener(
  'submit',
  debounce(onSubmitGetImages, DEBOUNCE_DELAY, DEBOUNCE_SETTINGS),
);

refs.loadMoreBtn.addEventListener(
  'click',
  debounce(onLoadMore, DEBOUNCE_DELAY, DEBOUNCE_SETTINGS),
);

const onImageClick = async e => {
  e.preventDefault();
};

refs.gallery.addEventListener('click', onImageClick);
