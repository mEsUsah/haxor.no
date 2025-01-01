import Siema from 'siema';

export default {
    _siemaWrappers: null,
    init(){
        this._siemaWrappers = document.querySelectorAll(".siema__wrapper");
        this._siemaImagesPortrait = document.querySelectorAll(".siema__image--portrait");
        this._siemaImagesLandscape = document.querySelector(".siema__image--landscape");


        if (!this._siemaWrappers) {
            return;
        }

        for (const wrapper of this._siemaWrappers) {
            const siema = new Siema({
                selector    : wrapper.querySelector('.siema'),
                duration    : 200,
                easing      : 'ease-out',
                perPage     : 1,
                startIndex  : 0,
                draggable   : true,
                multipleDrag: true,
                threshold   : 20,
                loop        : true,
                rtl         : false,
                onInit      : () => {},
                onChange    : () => {
                    const dots    = wrapper.querySelectorAll("[data-siema-dot]");
                    const current = siema.currentSlide;
                    
                    dots.forEach((element) => {
                        element.classList.remove(siema.activeClass);
                    });

                    const queryString = "[data-siema-dot='" + current + "']";
                    const activeDot   = wrapper.querySelector(queryString);

                    activeDot.classList.add(siema.activeClass);
                },
            });
            siema.activeClass = "siema__dot--active";
    
            const rightArrow = wrapper.querySelector("[data-siema-right]");
            const leftArrow  = wrapper.querySelector("[data-siema-left]");

            if (leftArrow && rightArrow){
                rightArrow.addEventListener("click", () =>{
                    siema.next();
                });
                leftArrow.addEventListener("click", () =>{
                    siema.prev();
                });
            }
            
            const dots  = wrapper.querySelector("[data-siema-dots]");
            const nodes = wrapper.querySelector('.siema').childNodes[0].childElementCount - 2;
            
            if (dots && nodes > 1){
                for (let i = 0; i < nodes; i++) {
                    const dot = document.createElement("div");
                    
                    dot.setAttribute("data-siema-dot", i);
                    dot.classList.add("siema__dot");

                    if (i === 0) {
                        dot.classList.add(siema.activeClass);
                    }

                    dot.addEventListener('click', () => siema.goTo(i));
                    dots.appendChild(dot);
                }
            }

            if(this._siemaImagesPortrait){
                resizeImages(this._siemaImagesPortrait);
                window.addEventListener('resize', () => {
                    resizeImages(this._siemaImagesPortrait);
                });
            }

            function resizeImages(portraits){
                if(portraits){
                    for (const image of portraits) {
                        const ratio = 1248 / 700;

                        // remove the inline styles to allow calculation
                        image.style.height = 0;
                        image.style.width = null;

                        // set the height and width
                        image.style.height = image.width / ratio + "px";
                        image.style.width = "auto";
                    }
                }
            }

        } 
    },
}