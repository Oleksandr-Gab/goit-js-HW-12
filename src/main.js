import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector(".gallery");
const searchForm = document.querySelector(".search-form");
const loading = document.querySelector(".loading");

loading.style.display = 'none';

const searchParamsDefaults = {
    key: '41686068-f8a1ddec694d7ca7a5960473b',
    q: '',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };
  
  const lightbox = new SimpleLightbox('.gallery a', {
    nav: true,
    captionDelay: 250,
    captionsData: 'alt',
    close: true,
    enableKeyboard: true,
    docClose: true,
  });

  const searchImg = (params) => {
    return fetch(`https://pixabay.com/api/?${params}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(({ hits }) => {
        if (hits.length > 0) {
          const renderImg = hits.reduce((html, hit) => {
            return (
              html +
              `<li class="gallery-item">
          <a href=${hit.largeImageURL}> 
            <img class="gallery-img" src =${hit.webformatURL} alt=${hit.tags}/>
          </a>
          <div class="gallery-text-box">
            <p>Likes: <span class="text-value">${hit.likes}</span></p>
            <p>views: <span class="text-value">${hit.views}</span></p>
            <p>comments: <span class="text-value">${hit.comments}</span></p>
            <p>downloads: <span class="text-value">${hit.downloads}</span></p>
        </div>
        </li>`
            );
          }, '');
  
          gallery.innerHTML = renderImg;
  
          lightbox.refresh();
        } else {
          iziToast.error({
            position: 'topRight',
            message:
              'Sorry, there are no images matching your search query. Please try again!',
          });
        }
      })
      .catch(error => {
        console.log(error.message);
      })
      .finally(() => {
        loading.style.display = 'none';
      });
  }
  
  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    gallery.innerHTML = '';
    searchParamsDefaults.q = event.target.elements.search.value.trim();
    if (!searchParamsDefaults.q) {
      iziToast.warning({
        position: 'topRight',
        message:
          'Please, fill in the field!',
      });
      return;
    }
    loading.style.display = 'block';
    const searchParams = new URLSearchParams(searchParamsDefaults);
    searchImg(searchParams);
    event.currentTarget.reset();
  });