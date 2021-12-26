export default {
    _lessonTaskDoneButtons  : document.querySelectorAll(".contentBlocks__taskDone--button"),
    _lessonTaskDoneWrapper  : document.querySelectorAll(".contentBlocks__taskDone--wrapper"),
	init() {
        let localstorageLessonStatus = JSON.parse(localStorage.getItem("lessonStatus"));
        if(localstorageLessonStatus === null){
            localstorageLessonStatus = {};
        }

        if(this._lessonTaskDoneWrapper){
            this._lessonTaskDoneWrapper.forEach((element) => {
                const lessonID =  element.getAttribute("data-lesson-id");
                const chapterID = element.getAttribute("data-lesson-ch");
                const taskID =    element.getAttribute("data-lesson-t");

                // Prapare lesson status object for data.
                if(localstorageLessonStatus[lessonID] == null){
                    localstorageLessonStatus[lessonID] = {};
                }
                if(localstorageLessonStatus[lessonID][chapterID] == null){
                    localstorageLessonStatus[lessonID][chapterID] = {};
                }

                // Add complete class to each completed task
                if(localstorageLessonStatus[lessonID][chapterID][taskID] == true){
                    element.classList.add("complete");
                } 
            })
        }
        if(this._lessonTaskDoneButtons){
            this._lessonTaskDoneButtons.forEach((element) => {
                element.addEventListener("click", () => {
                    const lessonID =  element.parentNode.getAttribute("data-lesson-id");
                    const chapterID = element.parentNode.getAttribute("data-lesson-ch");
                    const taskID =    element.parentNode.getAttribute("data-lesson-t");

                    // Add complete class to parent node
                    element.parentNode.classList.add("complete");
                
                    // Update lesson status object and localstorage
                    localstorageLessonStatus[lessonID][chapterID][taskID] = true;                    
                    localStorage.setItem("lessonStatus", JSON.stringify(localstorageLessonStatus));
                })
            })
        }
    }
}