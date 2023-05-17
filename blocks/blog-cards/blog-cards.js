import { lookupBlogData } from '../../scripts/scripts.js';
import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

async function fetchCategoryData(){
  const resp = await fetch('/categories.json');  
  
  if (!resp.ok) {
    block.remove();
    return;
  }
  const categories = await resp.json();
  const childCategories = categories.data.filter((c) => c['Path'] === window.location.pathname || c['Parent Path'] === window.location.pathname);
  if (!childCategories.length) {
    block.remove();
    return;
  }
  
  return childCategories;
}

export default async function decorate(block) {
  const categoryList = [];
  const childCategories = await fetchCategoryData();
  childCategories.forEach(element => categoryList.push(element.Category)); 
  const ul = document.createElement('ul');  
  const blogList = await lookupBlogData(categoryList);
  let category, categorypath, categorycolor;
  blogList.forEach((element, index) => {    
    const li = document.createElement('li');
    let picMedia = [{ media: '(min-width: 600px)', width: '450' }, { width: '317' }];
    const pic = createOptimizedPicture(element.image, '', false, picMedia);
    const postDate = new Date(0);
    postDate.setUTCSeconds(element.date);
    const postDateStr = postDate.toLocaleString('default', { month: 'long' })+' '+postDate.getDate()+', '+postDate.getFullYear();
    childCategories.forEach(item => {
      if(item.Category === element.category){
        category = item.Category;
        categorypath = item.Path;
        categorycolor = item.Color;      
      }
    });   
    const postcard = `<div class ="blogs-card-image">  <a title="${element.title}" href="${element.path}">${pic.outerHTML}</a>   
    <a aria-current="page" class="blogs-card-category ${categorycolor}" href="${categorypath}" data-acsb-clickable="true" data-acsb-navigable="true" data-acsb-now-navigable="true">${category}</a>
    </div> 
    <a href="${element.path}">
    <div class="blogs-card-body" >   
      <h3>${element.title}</h3>
      <p><span class="card-date">${postDateStr+ ' · '+element.author}</span></p>      
    </div></a>`;
    li.innerHTML = postcard;   
  ul.append(li);
});
block.textContent = '';
block.append(ul);
}
