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

/*

1. меньше 40 карточек показывать.
2. показывать все картинки - вывести их.
3. load more btn должна прятаться, а потом появляться снова

*/

const refs = getRefs();
const DEBOUNCE_DELAY = 300;
const DEBOUNCE_SETTINGS = { leading: true, trailing: false };
const notifyOptions = {
  timeout: 5000,
};

const imageAPI = new imagesAPI();

const notifyStatus = imagesCount => {
  if (imagesCount < 1) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      notifyOptions,
    );
  }

  const { totalHits, page } = imageAPI;
  if (totalHits > 0 && page === 1) {
    Notify.success(`Hooray! We found ${totalHits} images.`, notifyOptions);
  }
};

const fetchAndRenderImages = async () => {
  try {
    const { hits, totalHits } = await imageAPI.getImages();

    imageAPI.totalHits = totalHits;
    imageAPI.totalPages = Math.ceil(imageAPI.totalHits / imageAPI.perPage);
    imageAPI.currentlyLoaded = imageAPI.perPage * imageAPI.page;

    notifyStatus(hits.length);

    await UI.renderGallery(hits);
    smoothScrollAfterRender(imageAPI.page);

    console.log(
      'total: ',
      imageAPI.totalHits,
      'loaded :',
      imageAPI.currentlyLoaded,
    );

    if (imageAPI.totalHits > imageAPI.currentlyLoaded) {
      const waitImgComplete = [...document.images]
        .filter(img => !img.complete)
        .map(img => new Promise(res => (img.onload = img.onerror = res)));

      await Promise.all(waitImgComplete);
      UI.show(refs.loadMoreBtn);

      // Promise.all(
      //   Array.from(document.images)
      //     .filter(img => !img.complete)
      //     .map(
      //       img =>
      //         new Promise(resolve => {
      //           img.onload = img.onerror = resolve;
      //         }),
      //     ),
      // ).then(() => {
      //   console.log('images finished loading');
      // });
    }

    if (imageAPI.totalHits <= imageAPI.currentlyLoaded) {
      return showPopupEndOfResults();
    }

    imageAPI.page += 1;
  } catch (error) {
    console.error(error);
  } finally {
    UI.enable(refs.searchBtn);
  }
};

const showPopupEndOfResults = () => {
  Notify.info(
    "We're sorry, but you've reached the end of search results.",
    notifyOptions,
  );
};

const onSubmitGetImages = async e => {
  e.preventDefault();
  UI.disable(refs.searchBtn);
  UI.hide(refs.loadMoreBtn);
  UI.clearUI();

  imageAPI.query = e.target.elements.searchQuery.value.trim();
  imageAPI.page = 1;

  await fetchAndRenderImages();

  try {
    if (refs.modal) {
      refs.modal.destroy();
    }

    refs.modal = initModal('.gallery a');
  } catch (error) {
    console.error(error);
  }
};

const onLoadMore = async e => {
  UI.hide(refs.loadMoreBtn);

  await fetchAndRenderImages();

  try {
    refs.modal.refresh();
  } catch (error) {
    console.error(error);
  }
};

const onImageClick = async e => {
  e.preventDefault();
};

refs.searchForm.addEventListener(
  'submit',
  debounce(onSubmitGetImages, DEBOUNCE_DELAY, DEBOUNCE_SETTINGS),
);
refs.loadMoreBtn.addEventListener(
  'click',
  debounce(onLoadMore, DEBOUNCE_DELAY, DEBOUNCE_SETTINGS),
);
refs.gallery.addEventListener('click', onImageClick);
