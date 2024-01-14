import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';


const api = axios.create({
  baseURL: 'https://pixabay.com/api/',
  params: {
    key: "41686068-f8a1ddec694d7ca7a5960473b",
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  }
});

const messageWarning = () => iziToast.warning({
  position: 'topRight',
  message:
    'Please, fill in the field!',
});

const messageError = () => iziToast.error({
            position: 'topRight',
            message:
              'Sorry, there are no images matching your search query. Please try again!',
          });

const gallery = document.querySelector(".gallery");
const searchForm = document.querySelector(".search-form");
const loading = document.querySelector(".loading");
const btnLoad = document.querySelector(".btn-load")

function renderHits(hits = []) {
  const renderImg = hits.reduce((html, {largeImageURL, webformatURL, tags, likes, views, comments, downloads}) => {
      return (
        html +
        `<li class="gallery-item">
    <a href=${largeImageURL}> 
      <img class="gallery-img" src =${webformatURL} alt=${tags}/>
    </a>
    <div class="gallery-text-box">
      <p>Likes: <span class="text-value">${likes}</span></p>
      <p>views: <span class="text-value">${views}</span></p>
      <p>comments: <span class="text-value">${comments}</span></p>
      <p>downloads: <span class="text-value">${downloads}</span></p>
  </div>
  </li>`
      );
    }, '');  
    
  gallery.insertAdjacentHTML("beforeend", renderImg);
  lightbox.refresh();
}

const lightbox = new SimpleLightbox('.gallery a', {
  nav: true,
  captionDelay: 250,
  captionsData: 'alt',
  close: true,
  enableKeyboard: true,
  docClose: true,
});


const getHits = async (params) => {
  try {  
    const response = await api.get("", { params });
    return response.data;
  } catch(error) {
    console.error(error);
  } 
}



const createGetHitsRequest = (q) => {
  let page = 1;
  let isLastPage = false;
  const per_page = 40;

  return async () => {
    try {
      if (isLastPage) return;
      const { hits, totalHits } = await getHits({ page, per_page, q });
      if (page >= Math.ceil( totalHits / per_page)) {
        isLastPage = true;
      }
      
      page++;

      if (isLastPage) {btnLoad.style.display = "none"}
      if (hits.length == 0) {
        messageError();
        return;
      }
      return hits;
    } catch(error) {
      console.error(error);
    }
  };
}

let doFetch = null;

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (doFetch != null) {
    btnLoad.removeEventListener("click", doFetch);
    doFetch = null;
  }
 
  const data = new FormData(event.currentTarget);
  const search = data.get("search");
  if (!search) {
    messageWarning()
    return;
  }
  gallery.innerHTML = "";
  btnLoad.style.display = "block";
  const fetchHits = createGetHitsRequest(search);
  event.currentTarget.reset();
  doFetch = async () => {
    const articles = await makePromiseWithSpinner({
      promise: fetchHits,
      spinner: loading,
    })

    renderHits(articles);
  }

  await makePromiseWithSpinner({
    promise: doFetch,
    spinner: loading,
  });
  btnLoad.addEventListener('click', doFetch);
});


const makePromiseWithSpinner = async ({ promise, spinner, className = 'is-hidden' }) => {
  spinner.classList.remove(className);
  btnLoad.classList.add(className);

  const response = await promise();

  spinner.classList.add(className);
  btnLoad.classList.remove(className);

  return response;
};
