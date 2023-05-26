export default async function decorate(block) {
  block.innerHTML = '<h2>Popular Posts</h2>';

  const res = await fetch('/');
  const html = await res.text();

  // Create a temporary element to extract the content within the <main> tag
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;

  // Get the content within the <main> tag
  const slideShow = tempElement.querySelector('.slideshow');

  const PopularPostsData = [...slideShow.children].map((child) => ({
    img: child.querySelector('picture').outerHTML,
    url: child.querySelector('a').href,
    title: child.querySelector('h1').textContent,
  }));
  PopularPostsData.splice(3, PopularPostsData.length);

  console.log(PopularPostsData);

  const cardWrapper = document.createElement('div');
  cardWrapper.classList.add('popular-cards-wrapper');

  PopularPostsData.forEach((post) => {
    const foo = `
        <a href=" ${post.url}">
            <div class="img-div">${post.img}</div>
            <div class="title-div"><h3>${post.title}</h3></div>
          </a>`;

    cardWrapper.innerHTML += foo;
  });

  block.append(cardWrapper);
}
