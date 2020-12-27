export default {
    _accordianButtons  : document.querySelectorAll("[data-button-accordian]"),
    _accordianTargets   : document.querySelectorAll("[data-target-accordian]"),
	init() {
        if(this._accordianButtons && this._accordianTargets){
            this._accordianButtons.forEach((element) => {
                element.addEventListener("click", () => {
                    const targetValue = element.getAttribute("data-button-accordian");
                    const toggleTarget = document.querySelector("[data-target-accordian='" + targetValue + "']")
                    
                    const copyOfTarget = toggleTarget.cloneNode(true);
                    copyOfTarget.setAttribute("style", "max-height:unset");
                    toggleTarget.parentNode.appendChild(copyOfTarget);
                    const height = copyOfTarget.offsetHeight;
                    copyOfTarget.parentNode.removeChild(copyOfTarget);
                    if(toggleTarget.classList.contains("is-active")){
                        toggleTarget.setAttribute("style", "max-height:0");
                        toggleTarget.classList.remove("is-active");
                        element.classList.remove("is-active");
                    } else {
                        toggleTarget.setAttribute("style", "max-height:" + height + "px");
                        toggleTarget.classList.add("is-active");
                        element.classList.add("is-active");
                    }
                })
            })
        }
    }
}