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
        floatItem.forEach(function (item, index){
            if(isPicture(item)){
                const direction = (index % 2 === 0 )? "left":"right";
                item.classList.add(`float-column-image-${direction}`);
                decorateResponsiveImages(item);
            } else {
                item.classList.add("text");
            }
            if(index % 2 === 1){
                if(isPicture(item)){
                    const parentElement = item.parentNode;
                    if(isPicture(item)){
                        parentElement.insertBefore(floatItem[index], floatItem[index-1])
                    }
                }
                const parentElement = floatItem[index-1].parentNode;
                let newDiv = document.createElement("div");
                newDiv.classList.add("separator");
                parentElement.append(newDiv);
            }

        })
    })
}
  