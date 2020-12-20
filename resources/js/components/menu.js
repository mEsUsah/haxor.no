export default {
    _hamburger : document.querySelector("[data-menu-button]"),
    _menu       : document.querySelector("[data-menu-content]"),
	init() {
        console.log("running");
        if(this._hamburger && this._menu){
            this._hamburger.addEventListener("click", () => {
                alert("yes!");
            })
        }
    }
}