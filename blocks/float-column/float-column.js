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
  