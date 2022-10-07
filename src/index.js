import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import FetchService from './js/FetchService';

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const fetchService = new FetchService();
let gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

formRef.addEventListener('submit', onSearchBtn);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearchBtn(evt) {
  evt.preventDefault();
  clearMarkup();
  fetchService.query = evt.currentTarget.elements.searchQuery.value;
  fetchService.resetPage();
  if (fetchService.query.trim() === '') {
    return;
  }
  try {
    const response = await fetchService.onFetchPixabay();
    const data = renderMarkup(response);
    loadMoreBtn.classList.remove('ishidden');
  } catch (error) {
    console.log(error.message);
  }
}

function renderMarkup(images) {
  const markup = images
    .map(
      image =>
        (image = `<a  href="${image.largeImageURL}">
            <div class="thumb">            
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy"  />
            </div>
            <div class="info">
              <p class="info-item">
               <span><b>Likes</b></span><span>${image.likes}</span>  
              </p>
              <p class="info-item">
                <span><b>Views</b></span><span> ${image.views}</span> 
              </p>
              <p class="info-item">
                <span><b>Comments</b></span><span> ${image.comments}</span> 
              </p>
              <p class="info-item">
                <span><b>Downloads</b></span><span>${image.downloads}</span> 
              </p>
            </div>
          </a>
          
          `)
    )
    .join('');
  galleryRef.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
}

async function onLoadMore() {
  try {
    const response = await fetchService.onFetchPixabay();
    if (response.length === 0) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.classList.add('ishidden');
    }
    renderMarkup(response);
  } catch (error) {
    console.log(error.message);
  }
}

function clearMarkup() {
  galleryRef.innerHTML = '';
  loadMoreBtn.classList.add('ishidden');
}
