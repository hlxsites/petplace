window.dataLayer = window.dataLayer || [];

// document.onreadystatechange = () => {
//   if (document.readyState === 'complete') {
//     console.log('ready')
//     handleGlobalVariables()
//     handleSearch()
//   }
// };

// GLOBAL VARIABLES
// TODO : if meta category not present, create user story (avinash)
const handleGlobalVariables = () => {
  const contentGroup = document.querySelector('meta[name="category"]');
  window.dataLayer.push({
    content_group: contentGroup ? contentGroup.content : '',
  });
  // e.g: ‘home’, ‘account’, ‘menu’
};

// SEARCH
const handleSearch = () => {
  const searchBtn = document.getElementById('search-posts-btn');
  const searchInput = document.getElementById('search-posts-input');

  // const buttons = document.getElementsByClassName('search-button');
  // const headerBtns = document.getElementsByClassName('search-input');
  // console.log('buttons', headerBtns[0]);

  searchBtn.addEventListener('click', () => {
    window.dataLayer.push({
      event: 'search',
      search_term: searchInput.value,
    });
  });
};

// SIGNUP
const signupCategory = 'newsletter';
window.dataLayer.push({
  event: 'sign_up',
  signup_category: signupCategory, // Example: 'newsletter'
});

export const handleDataLayerApproach = () => {
  handleGlobalVariables();
  handleSearch();
};

// window.addEventListener(
//   "load",
//   function () {
//     console.log("ready");
//     handleSearch();
//   },
//   false
// );
