const azureApiKey = "keyfe475";  // Replace with your actual Azure OpenAI API key
const azureEndpoint = "https://pr-review-bot.openai.azure.com";  // Replace with your Azure OpenAI endpoint

export async function generateContentWithAzureRestApi(keywords) {

    // Set up the request URL and headers
    const url = `${azureEndpoint}/openai/deployments/experience-studio/chat/completions?api-version=2024-04-01-preview`;
    

// Define the keywords list variable (replace with actual keywords)
 

// Construct the prompt string with the keywordsList placeholder
let prompt = `For the keywords ${keywords} i need to get an output in form of a json which has following key values pairs
Key :content
Value: Some content relevant to the given keywords

key: title
value: Title which can be given to the generated content

key:metaTag
Value: html meta tags that can be used for the generated content

Key:jsonLD
value: json ld which can be inject in the html doc for the generated content`;

console.log(prompt);



    const headers = {
        "Content-Type": "application/json",
        "api-key": azureApiKey
    };

    // Set up the request payload
    const data = {
        messages: [
            {
                role: "system",
                content: [
                    {
                        type: "text",
                        text: "You are an AI assistant that helps people find information."
                    }
                ]
            },
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `For the keywords ${keywords} i need to get an output in form of a json which has following key values pairs
                        key :content
                        value: Some content relevant to the given keywords formmated as HTML div
                        
                        key: title
                        value: Title which can be given to the generated content
                        
                        key:metaTag
                        value: html meta tags that can be used for the generated content
                        
                        key:jsonLD
                        value: json ld which can be injected in the html doc for the generated content`
                    }
                ]
            }
        ],
        max_tokens: 1000,  // Adjust the token count as needed
        temperature: 0.7
    };

    // Make the request to the Azure OpenAI API
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        // Check if the request was successful
        if (response.ok) {
            const responseBody = await response.json();
            console.log(responseBody);
            const htmlString = responseBody.choices[0].message.content.trim();
           
            let startIndex = htmlString.indexOf('{');
            let endIndex = htmlString.lastIndexOf('}') + 1;
            
            // Extract the JSON substring
            let jsonSubstring = htmlString.substring(startIndex, endIndex);
            return jsonSubstring;

            // Regular expression pattern to extract content within <div> tags

            // let pattern = /<div>([\s\S]*?)(<\/div>|$)/;
            // // Using match() method to find the content within <div> tags
            // let matches = htmlString.match(pattern);

            // // Output the matched content
            // if (matches) {
            //     let divContent = matches[1].trim();  // Get the content captured by the first group and trim leading/trailing whitespace
            //     console.log(divContent);
            //     return divContent;
            // } else {
            //     console.log("No <div> content found.");
            // }
            return content;
        } else {
            return `Error: ${response.status} - ${response.statusText}`;
        }
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

// Function to generate image using Azure OpenAI API
export async function generateImage(keywords) {
    try {

        const data = { prompt: keywords, size: "1024x1024", n: 1, style: "vivid", quality: "standard" };
        const url = `${azureEndpoint}/openai/deployments/experience-studio-iamges/images/generations?api-version=2024-04-01-preview`;
        const headers = {
            "Content-Type": "application/json",
            "api-key": azureApiKey
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        const responseBody = await response.json();
        // Extract image URL from API response
        const imageUrl = responseBody.data[0].url;
        return imageUrl;

        //   // Fetch the image from the URL
        //   const imageResponse = await axios.get(imageUrl, {
        //     responseType: 'arraybuffer' // Ensure response is treated as binary
        //   });

        //   // Write the image to a local file
        //   fs.writeFileSync('image.jpg', imageResponse.data, 'binary');
        //   console.log('Image successfully downloaded: image.jpg');
    } catch (error) {

    }
}
export async function generateJsonLd(innerHtml) {
    const description = await fetchJsonLDFromAI(innerHtml);
    let jsonLdData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": window.location.href
        },
        "headline": document.title,
        "description": description,
        "articleBody": innerHtml,
        "datePublished": new Date().toISOString()
    };

    return JSON.stringify(jsonLdData, null, 2);
}

// Function to fetch content from Azure OpenAI
async function fetchJsonLDFromAI(htmlContent) {

    const inputdata = {
        messages: [
            {
                role: "system",
                content: [
                    {
                        type: "text",
                        text: "You are an AI assistant that helps people find information."
                    }
                ]
            },
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `Generate json ld description based on the following html content : ${htmlContent}`
                    }
                ]
            }
        ],
        max_tokens: 200,  // Adjust the token count as needed
        temperature: 0.7
    };
    const url = `${azureEndpoint}/openai/deployments/experience-studio/chat/completions?api-version=2024-04-01-preview`;

    const headers = {
        "Content-Type": "application/json",
        "api-key": azureApiKey
    };
    
    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(inputdata)
    });


if (!response.ok) {
    throw new Error('Failed to fetch content from Azure OpenAI');
}

const data = await response.json();
return data.choices[0].text.trim();
}





