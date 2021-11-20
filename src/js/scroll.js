import getRefs from './refs';
const refs = getRefs();

const smoothScrollAfterRender = () => {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

export default smoothScrollAfterRender;
