export default {
    _hamburger  : document.querySelector("[data-menu-button]"),
    _menu       : document.querySelector("[data-menu-content]"),
    _header     : document.querySelector("[data-header]"),
	init() {
        let lastScrollTop = 0;
        let hamburgerButton = document.querySelector("[data-menu-button]");
        console.log(hamburgerButton);

        window.addEventListener("scroll", function(){ // or window.addEventListener("scroll"....
            //let activeMenu = this._hamburger.classList.contains("is-active");
            let hamburgerButtonActive = hamburgerButton.classList.contains("is-active");
            console.log(hamburgerButtonActive);
        
            let st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
            if (!hamburgerButtonActive && st > lastScrollTop){
                // downscroll code
                document.querySelector("[data-header]").classList.remove("active")
            } else {
                // upscroll code
                document.querySelector("[data-header]").classList.add("active");
            }
            lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
        }, false);


        if(hamburgerButton && this._menu){
            hamburgerButton.addEventListener("click", () => {
                hamburgerButton.classList.toggle("is-active");
            })
        }
    }
}