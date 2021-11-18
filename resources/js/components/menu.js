export default {
	init() {
        let lastScrollTop = 0;
        let hamburgerButton = document.querySelector("[data-menu-button]");
        let sidebar = document.querySelector(".article__content--sidebar");
        const header = document.querySelector("[data-header]");
        const menu = document.querySelector("[data-menu-content]");

        window.addEventListener("scroll", function(){ // or window.addEventListener("scroll"....
            //let activeMenu = this._hamburger.classList.contains("is-active");
            let hamburgerButtonActive = hamburgerButton.classList.contains("is-active");

            let st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
            if (!hamburgerButtonActive && window.pageYOffset > 100 && st > lastScrollTop){
                // downscroll code
                header.classList.remove("active")
                if(sidebar){
                    sidebar.classList.remove("menuOpen");
                }
            } else {
                // upscroll code
                header.classList.add("active");
                if(sidebar){
                    sidebar.classList.add("menuOpen");
                }
            }
            lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
        }, false);


        if(hamburgerButton && menu){
            hamburgerButton.addEventListener("click", () => {
                hamburgerButton.classList.toggle("is-active");
            })
        }
    }
}