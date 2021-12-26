export default {
    _lessonTaskDoneButtons  : document.querySelectorAll(".contentBlocks__taskDone--button"),
    _lessonTaskDoneWrapper  : document.querySelectorAll(".contentBlocks__taskDone--wrapper"),
    _lessonID               : "",
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

                if(this._lessonID == ""){ 
                    this._lessonID = lessonID;
                }

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

        // Get all COMPLETED tasks in lesson
        let nrOfTasksCompleted = 0;
        for(const [chapter, tasks] of Object.entries(localstorageLessonStatus[this._lessonID])){
            console.log(chapter, tasks);
            for(const [task, completed] of Object.entries(tasks)){
                if (completed) {
                    nrOfTasksCompleted++;
                }
            }
        }
        console.log(nrOfTasksCompleted);

        // Get amount of task in lesson
        console.log(this._lessonTaskDoneWrapper.length);

        // Print progress
        console.log(nrOfTasksCompleted + " / " + this._lessonTaskDoneWrapper.length);


        // console.log(localstorageLessonStatus[this._lessonID]);
        // console.log(Object.keys(localstorageLessonStatus[this._lessonID][1]).length);

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