export default {
    _modalOpenButtons  : document.querySelectorAll("[data-open-modal]"),
    _modalColoseButtons  : document.querySelectorAll("[data-close-modal]"),
    _modalTargets   : document.querySelectorAll("[data-target-modal]"),
    _modalShadow    : document.querySelector("[data-modal-shadow]"),
	init() {
        if(this._modalOpenButtons && this._modalColoseButtons && this._modalTargets){
            this._modalOpenButtons.forEach((element) => {
                element.addEventListener("click", () => {
                    const targetValue = element.getAttribute("data-open-modal");
                    const toggleTarget = document.querySelector("[data-target-modal='" + targetValue + "']")
                    
                    if(!toggleTarget.classList.contains("active")){
                        toggleTarget.classList.add("active");
                    }
                    if (!this._modalShadow.classList.contains("active")){
                        this._modalShadow.classList.add("active");
                    }
                })
            });

            this._modalColoseButtons.forEach((element) => {
                element.addEventListener("click", () => {
                    const targetValue = element.getAttribute("data-close-modal");
                    const toggleTarget = document.querySelector("[data-target-modal='" + targetValue + "']")
                    
                    if(toggleTarget.classList.contains("active")){
                        toggleTarget.classList.remove("active");
                    }
                    if (this._modalShadow.classList.contains("active")){
                        this._modalShadow.classList.remove("active");
                    }
                })
            });
        }
        if(this._modalShadow){
            this._modalShadow.addEventListener("click", () => {
                this._modalTargets.forEach((element) => {
                    if(element.classList.contains("active")){
                        element.classList.remove("active");
                    }
                });
                this._modalShadow.classList.remove("active");
            });
        }
    }
}