function DetectSwipe(element, callback) {

    const touchElement = element;
    let swipeDirection;
    let startX;
    let startY;
    let distX;
    let distY;
    let elapsedTime;
    let startTime;
    const distThreshold = 50;
    const angleThreshold = 30 * Math.PI / 180;
    const timeThreshold = 500;
    const handleSwipe = callback || function(swipeDirection){console.log('');};
  
  
    touchElement.addEventListener('touchstart', function(e){
        const touchObj = e.changedTouches[0];
        swipeDirection = 'none';
        distX = 0;
        distY = 0;
        startX = touchObj.pageX;
        startY = touchObj.pageY;
        startTime = new Date().getTime();
    }, false)
  
    touchElement.addEventListener('touchmove', function(e){
      const touchObj = e.changedTouches[0];
      distX = touchObj.pageX - startX; 
      distY = touchObj.pageY - startY;
      elapsedTime = new Date().getTime() - startTime;
      if (elapsedTime <= timeThreshold){ 
          if (Math.abs(distX) >= distThreshold && (Math.abs(distY)/Math.abs(distX)) <= Math.tan(angleThreshold)){
            e.preventDefault();
          }
      }
    }, false);
  
    touchElement.addEventListener('touchend', function(e){
        const touchObj = e.changedTouches[0];
        distX = touchObj.pageX - startX; 
        distY = touchObj.pageY - startY;
        elapsedTime = new Date().getTime() - startTime;
        if (elapsedTime <= timeThreshold){ 
            if (Math.abs(distX) >= distThreshold && (Math.abs(distY)/Math.abs(distX)) <= Math.tan(angleThreshold)){
                swipeDirection = (distX < 0)? 'left' : 'right'; 
            }
            else if (Math.abs(distY) >= distThreshold && (Math.abs(distX)/Math.abs(distY)) <= Math.tan(angleThreshold)){ 
                swipeDirection = (distY < 0)? 'up' : 'down'; 
            }
        }
        handleSwipe(swipeDirection);
    }, false)
}

export const ImageCarousel = {
    intiateSlider: function(selectors) {
        const {self, sliderEl, slideEl, sliderPrev, sliderNext, sliderNavigator } = selectors;
        const components = document.querySelectorAll(self);
        components.forEach(component => {
            const slider = component.querySelector(sliderEl);
            if (slider) {
                const initialSlides = Array.from(slider.querySelectorAll(slideEl));
                const prevButton = component.querySelector(sliderPrev);
                const nextButton = component.querySelector(sliderNext);
                const navigators = component.querySelectorAll(sliderNavigator);
                const initialSlideCount = initialSlides.length;
                const slidesToShow = initialSlideCount >= 3 ? 3 : initialSlideCount;
                const slideAction = (swipeDirection) => {
                    if(swipeDirection == 'left') {
                        nextButton.click();
                    } else if (swipeDirection == 'right') {
                        prevButton.click();
                    }
                }

                //clone and prepend slides
                for (let i = initialSlideCount; i > (initialSlideCount - slidesToShow); i--) {
                    const slideIndex = i - 1;
                    const slideClone = initialSlides[slideIndex].cloneNode(true);
                    slideClone.setAttribute("data-slide-index", slideIndex - initialSlideCount);
                    slideClone.classList.add('slide-cloned');
                    slideClone.setAttribute('aria-label', `slide ${i}`);
                    slider.prepend(slideClone);
                }
                //clone and append slides
                for (let i = 0; i < slidesToShow; i++) {
                    const slideIndex = i;
                    const slideClone = initialSlides[slideIndex].cloneNode(true);
                    slideClone.setAttribute("data-slide-index", slideIndex + initialSlideCount);
                    slideClone.classList.add('slide-cloned');
                    slideClone.setAttribute('aria-label', `slide ${i+1}`);
                    slider.append(slideClone);
                }
                const slides = Array.from(document.querySelectorAll(selectors.slideEl));
                slider.style.width = slides.length * 100 + '%';
                let currentIndex = slidesToShow;
                this.updateActiveSlide(component, currentIndex, slides, slider, initialSlideCount,initialSlideCount);
                nextButton.addEventListener('click', () => {
                    if(currentIndex >= slides.length - slidesToShow) {
                        return;
                    }
                    slider.style.transition = "transform 1s ease-in-out";
                    currentIndex++;
                    this.updateActiveSlide(component, currentIndex, slides, slider, initialSlideCount);
                });
                prevButton.addEventListener('click', () => {
                    if (currentIndex <= slidesToShow - 1) {
                        return;
                    }
                    slider.style.transition = "transform 1s ease-in-out";
                    currentIndex--;
                    this.updateActiveSlide(component, currentIndex, slides, slider, initialSlideCount);
                });
                navigators.forEach(button => {
                    button.addEventListener('click', (event)=> {
                        const targetIndex = event.target.getAttribute('data-slide-to-index');
                        console.log('currentIndex: ', currentIndex, ', targetIndex:', parseInt(targetIndex) + slidesToShow)
                        currentIndex = parseInt(targetIndex) + slidesToShow;
                        this.updateActiveSlide(component, currentIndex, slides, slider, initialSlideCount);
                    })
                });
                slider.addEventListener('transitionend', () => {
                    if(currentIndex == slides.length - slidesToShow){
                        slider.style.transition = "none";
                        currentIndex = slides.length - currentIndex;
                        console.log('transitionend', currentIndex)
                        this.updateActiveSlide(component, currentIndex, slides, slider, initialSlideCount);
                    }
                    if(currentIndex == slidesToShow - 1){
                        slider.style.transition = "none";
                        currentIndex = slides.length - slidesToShow - 1;
                        console.log('transitionend', currentIndex)
                        this.updateActiveSlide(component, currentIndex, slides, slider, initialSlideCount);
                    }      
                });
                DetectSwipe(slider, slideAction);
            }
        });
    },
    updateActiveSlide: function(component, currentIndex, slideArray, slider, initialSlideCount){
        const slideDistance = (1/slideArray.length) * 100 ;
        //const currentPageEl = component.querySelector(this.selectors.currentPage);
        for (let i = 0; i < slideArray.length; i++) {
            if (i != currentIndex) {
                slideArray[i].setAttribute('aria-hidden', 'true');
                slideArray[i].classList.remove('slide-active');
            } else {
                slideArray[i].removeAttribute('aria-hidden');
                slideArray[i].classList.add('slide-active');
            }
        }
        const dataIndex = parseInt(slideArray[currentIndex].getAttribute("data-slide-index"));
        //currentPageEl.innerText = dataIndex < 0 ? (dataIndex + initialSlideCount + 1) : (dataIndex >= initialSlideCount ? dataIndex - initialSlideCount + 1: dataIndex+1);
        //console.log('current:', currentPageEl.innerText);
        slider.style.transform = 'translateX(' + (-slideDistance * currentIndex) + '%)';
    },
    init: function(arg) {
        this.intiateSlider(arg.selectors);
    }

};
