import { getMetadata } from '../../scripts/lib-franklin.js';
import {generateContentWithAzureRestApi, generateImage, generateJsonLd} from '../../scripts/fetchContent.js';
import  {getPlaceholder} from '../../scripts/scripts.js'

function insertJsonLd(jsonLdString, name) {
    let script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = jsonLdString;
    script.dataset.name = name;
    document.head.appendChild(script);
}

function createJsonLd(){
    let websitename = getPlaceholder("websiteName");
    let title = document.title;
    let description = getMetadata("description");
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
        "headline": ${ title},
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
    
 // var htmlString = await generateContentWithAzureRestApi(keywords);
   //var url = await generateImage(keywords); 
   
     var jsonLdString = createJsonLd();
     insertJsonLd(jsonLdString , "jsonLd");
   
}
