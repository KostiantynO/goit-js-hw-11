import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const initModal = galleryLinks => {
  const modalMarkup = galleryLinks;

  const modalOptions = {
    captionsData: 'alt',
    animationSpeed: 210,
    fadeSpeed: 210,
  };

  return new SimpleLightbox(modalMarkup, modalOptions);
};

export default initModal;
