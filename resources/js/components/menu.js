export default {
    _hamburger  : document.querySelector("[data-menu-button]"),
    _menu       : document.querySelector("[data-menu-content]"),
    _header     : document.querySelector("[data-header]"),
	init() {
        var lastScrollTop = 0;
        
        // element should be replaced with the actual target element on which you have applied scroll, use window in case of no target element.
        window.addEventListener("scroll", function(){ // or window.addEventListener("scroll"....
        var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
        if (st > lastScrollTop){
            // downscroll code
            document.querySelector("[data-header]").classList.remove("active")

            
        } else {
            // upscroll code
            document.querySelector("[data-header]").classList.add("active");

        }
        lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
        }, false);

        if(this._hamburger && this._menu){
            this._hamburger.addEventListener("click", () => {
                this._hamburger.classList.toggle("is-active");
            })
        }
    }
}