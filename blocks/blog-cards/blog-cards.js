import { lookupBlogData } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const ul = document.createElement('ul');
  const category = [...block.children][0].textContent.trim();
  const blogList = await lookupBlogData(category);
  blogList.forEach((element, index) => {
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const image = document.createElement('img');
    const h3 = document.createElement('h3');
    const blogMetaData = document.createElement('span');
    anchor.setAttribute('href', `${window.hlx.codeBasePath}`+element.path);
    anchor.setAttribute('title', element.title);
    li.appendChild(anchor);
    image.src = `${window.hlx.codeBasePath}`+element.image;
    const div = document.createElement('div');
    image.classList.add('blogs-card-image');
    div.classList.add('blogs-card-body');
    anchor.appendChild(image);
    h3.textContent = element.title;
    const lastModified = new Date(0);
    lastModified.setUTCSeconds(element.date);console.log(lastModified);
    blogMetaData.textContent = lastModified.toLocaleString('default', { month: 'long' })+' '+lastModified.getDate()+', '+lastModified.getFullYear() + '. '+element.author;
    div.appendChild(h3);
    div.appendChild(blogMetaData);
    anchor.append(div);
    ul.append(li);
});
block.textContent = '';
block.append(ul);
}
