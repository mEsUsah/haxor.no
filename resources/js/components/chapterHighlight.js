export default {
    init(){
        let chapterTargets = document.querySelectorAll("[data-chapter-target]");
        let chapterButtons = document.querySelectorAll("[data-chapter-button]");
        window.addEventListener("scroll", () => {
            const windowheight = window.innerHeight;
            chapterTargets.forEach(element => {
                const distanceFromTopOfWindow = element.getBoundingClientRect().top;
                const chapterId = element.getAttribute("data-chapter-target");
                const chapterButton = document.querySelector(`[data-chapter-button="${chapterId}"]`)
                if(distanceFromTopOfWindow >= 0 && distanceFromTopOfWindow <= windowheight/3 ){
                    if(!chapterButton.classList.contains("active")){
                        chapterButtons.forEach(element => {
                            element.classList.remove("active");
                        });
                        chapterButton.classList.add("active");
                    }
                }
            });
        });
    }
}