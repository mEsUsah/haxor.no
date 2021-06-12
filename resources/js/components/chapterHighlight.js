export default {
    init(){
        let chapterTargets = document.querySelectorAll("[data-chapter-target]");
        let chapterButtons = document.querySelectorAll("[data-chapter-button]");
        let chapterButtonsMenu = document.querySelectorAll("[data-chapter-button-menu]");
        window.addEventListener("scroll", () => {
            const windowheight = window.innerHeight;
            chapterTargets.forEach(element => {
                const distanceFromTopOfWindow = element.getBoundingClientRect().top;
                const chapterId = element.getAttribute("data-chapter-target");
                const chapterButton = document.querySelector(`[data-chapter-button="${chapterId}"]`)
                const chapterButtonMenu = document.querySelector(`[data-chapter-button-menu="${chapterId}"]`)
                if(distanceFromTopOfWindow >= 0 && distanceFromTopOfWindow <= windowheight/3 ){
                    if(!chapterButton.classList.contains("active")){
                        chapterButtons.forEach(element => {
                            element.classList.remove("active");
                        });
                        chapterButtonsMenu.forEach(element => {
                            element.classList.remove("active");
                        });
                        chapterButton.classList.add("active");
                        chapterButtonMenu.classList.add("active");
                    }
                }
            });
        });
        let siteMenu = document.querySelector(".menu__wrapper");
        let siteHamburgerButton = document.querySelector("[data-menu-button]");
        chapterButtonsMenu.forEach(button => {
            button.addEventListener("click", () => {
                siteMenu.classList.remove("is-active");
                siteMenu.style = "max-height:0";
                siteHamburgerButton.classList.remove("is-active");
            });
        })
    }
}