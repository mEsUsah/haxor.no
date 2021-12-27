export default {
    _lessonTaskDoneButtons  : document.querySelectorAll(".contentBlocks__taskDone--button"),
    _lessonTaskDoneWrapper  : document.querySelectorAll(".contentBlocks__taskDone--wrapper"),
    _lessonProgress         : document.querySelector("[data-lesson-progress]"),
    _lessonID               : "",
    _nrOfTasksInLesson      : 0,
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
                
                // Update nr tasks
                this._nrOfTasksInLesson++;
            })
        }

        function updateLessonProgress(lessonID, nrOfTasksInLesson, progressBar){
            // Get all COMPLETED tasks in lesson
            let nrOfTasksCompleted = 0;
            for(const [chapter, tasks] of Object.entries(localstorageLessonStatus[lessonID])){
                //console.log(chapter, tasks);
                for(const [task, completed] of Object.entries(tasks)){
                    if (completed) {
                        nrOfTasksCompleted++;
                    }
                }
            }

            // Sett lesson progress bar
            progressBar.style.height = ((nrOfTasksCompleted / nrOfTasksInLesson) * 100) + "%";
        }
        updateLessonProgress(this._lessonID, this._nrOfTasksInLesson, this._lessonProgress);
        


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

                    // Update lesson progress bar
                    updateLessonProgress(this._lessonID, this._nrOfTasksInLesson, this._lessonProgress);
                })
            })
        }
    }
}