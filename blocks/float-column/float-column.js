import { decorateResponsiveImages } from '../../scripts/scripts.js';
const isPicture = (block) =>{
    return block.querySelector('picture') !== null;
}

export default function decorate(block) {
    // get all float-column blocks
    let float_cols = document.querySelectorAll(".float-column")
    
    float_cols.forEach((col) =>{
        // for each block, decorate image and text according to their positions
        let floatItem = col.querySelectorAll('div[data-valign="middle"]');
        floatItem.forEach(function (value, i){
            if(isPicture(value)){
                const direction = (i % 2 === 0 )? "left":"right";
                value.classList.add(`float-column-image-${direction}`);
                // let imageClass = value.querySelector('img').classList;
                // console.log(imageClass);
                decorateResponsiveImages(value);
            } else {
                value.classList.add("text");
            }
            if(i % 2 === 1){
                if(isPicture(value)){
                    const parentElement = value.parentNode;
                    if(isPicture(value)){
                        parentElement.insertBefore(floatItem[i], floatItem[i-1])
                    }
                }
                const parentElement = floatItem[i-1].parentNode;
                let newDiv = document.createElement("div");
                newDiv.classList.add("separator");
                parentElement.append(newDiv);
            }

        })
    })
}

// const slides = [...$slidesContainer.children];
//   slides.forEach(($slide) => {
//     $slide.classList.add('slide');

//     const imgDiv = $slide.children[0];
//     imgDiv.classList.add('img-div');
//     const textDiv = $slide.children[1];
//     textDiv.classList.add('text-div');

//     decorateResponsiveImages(imgDiv);
  