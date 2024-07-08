import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import {generateContentWithAzureRestApi, generateImage, generateJsonLd} from '../../scripts/fetchContent.js';
import  {getPlaceholder} from '../../scripts/scripts.js'

function insertJsonLd(jsonLdString, div, name) {
    let script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = jsonLdString;
    script.dataset.name = name;
    div.appendChild(script);
}

function createJsonLd(){
    let websitename = getPlaceholder("websiteName");
    let description = getPlaceholder("description");
    let today = new Date();

// Format the date as YYYY-MM-DD
let year = today.getFullYear();
let month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0, so we add 1
let day = String(today.getDate()).padStart(2, '0');

// Formatted date string
let formattedDate = `${year}-${month}-${day}`;

    let currentUrl = window.location.href;
    let json = `{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Comprehensive Guide to Cat Health and Pet Care",
        "description": ${ description},
        "datePublished": ${ formattedDate},
        "publisher": {
          "@type": "Organization",
          "name": ${ websitename},
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": ${ currentUrl}
        }
      }`;
      
        return json;
    }

export default async function decorate(block) {
    

    var articleDiv = document.createElement('div');
    articleDiv.classList.add('article');

    var articleTitle = document.createElement('h1');
    articleTitle.textContent = getPlaceholder("title");

    var articleImage = document.createElement('img');
    articleImage.classList.add('article-image');

    var keywords = "cat health, pet care"; 

   // var htmlString = await generateContentWithAzureRestApi(keywords);
   //var url = await generateImage(keywords); 

   // articleImage.src = await generateImage(keywords); // Replace with your image path
   //articleImage.alt = 'Image Description'; // Replace with image description
   
   

    var articleContent = document.createElement('div');
    //var htmlString = await generateContentWithAzureRestApi(keywords); // Replace with your content

    //articleContent.innerHTML = "<div>"+htmlString+"</div>";
     let htmlstr = getPlaceholder("content");
    htmlstr = htmlstr.replace(/\\n/g, '<br>');
    articleContent.innerHTML = htmlstr;
    articleImage.src = getPlaceholder("imageurl");
    articleImage.alt = getPlaceholder("description");
    articleDiv.appendChild(articleTitle);
    articleDiv.appendChild(articleImage);
    articleDiv.appendChild(articleContent);

    block.textContent = '';
    block.appendChild(articleDiv);
    // var jsonLdString = await generateJsonLd(htmlString);
    var jsonLdString = createJsonLd();
     insertJsonLd(jsonLdString, articleDiv , "jsonLd");
   
}
