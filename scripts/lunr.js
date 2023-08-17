
let idx = null;

export async function createAnIndex() {
 if (idx) {
  return idx;
 }

 const articles = await fetch('/article/query-index.json')
  .then((response) => response.json())
  .then((sheet) => sheet.article)
  .then((data) => data.data);

 idx = lunr(function () {
  this.ref('author');
  this.ref('category');
  this.ref('category name');
  this.ref('category slug');
  this.ref('date');
  this.ref('description');
  this.ref('image');
  this.ref('imageAlt');
  this.ref('lastModified');
  this.ref('path');
  this.ref('tags');
  this.ref('title');
  this.ref('type');

  articles.forEach(function (article) {
   this.add(JSON.stringify(article));
  }, this);
 });

 var idx2 = lunr(function () {
  this.ref('author');

  this.add({'author':'Xinyi'});
 });


 console.log(idx.search("dog"));
 console.log(idx2.search("Xinyi"));

 return idx;
}