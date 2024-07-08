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
    let currentUrl = window.location.href;
    let json = `{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Comprehensive Guide to Cat Health and Pet Care",
        "description": "Learn how to maintain your cat's health with our comprehensive guide on pet care. Get tips on nutrition, grooming, vaccinations, and more.",
        "author": {
          "@type": "Person",
          "name": "Your Name"
        },
        "datePublished": "2023-10-01",
        "publisher": {
          "@type": "Organization",
          "name": ${ description},
          "logo": {
            "@type": "ImageObject",
            "url": "http://www.yourorganization.com/logo.jpg"
          }
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
    var keywords = "cat health"; 

    var htmlString = await generateContentWithAzureRestApi(keywords);

   // articleImage.src = await generateImage(keywords); // Replace with your image path
   //articleImage.alt = 'Image Description'; // Replace with image description
   
   

    var articleContent = document.createElement('div');
    //var htmlString = await generateContentWithAzureRestApi(keywords); // Replace with your content

    //articleContent.innerHTML = "<div>"+htmlString+"</div>";
    articleContent.innerText = getPlaceholder("content");
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
