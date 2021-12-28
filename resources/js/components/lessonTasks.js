export default {
    _lessonTaskDoneButtons  : document.querySelectorAll(".contentBlocks__task--button"),
    _lessonTaskDoneWrapper  : document.querySelectorAll(".contentBlocks__task--wrapper"),
    _lessonProgress         : document.querySelector("[data-lesson-progress]"),
    _chapters               : document.querySelectorAll("[data-chapter-target]"),
    _lessonModuleId         : document.querySelectorAll("[data-lesson-module-id]"),
    _lessonModuleTasks      : document.querySelectorAll("[data-lesson-module-tasks]"),
    _lessonID               : "",
    _nrOfTasksInLesson      : 0,
	init() {
        // Grt lessonStatus object from localstorage
        let localstorageLessonStatus = JSON.parse(localStorage.getItem("lessonStatus"));
        if(localstorageLessonStatus === null){
            localstorageLessonStatus = {};
        }

        function getLessonTasksCompleted(lessonID){
            // Get all COMPLETED tasks in lesson
            let nrOfTasksCompleted = 0;
            for(const [chapter, tasks] of Object.entries(localstorageLessonStatus[lessonID])){
                for(const [task, completed] of Object.entries(tasks)){
                    if (completed) {
                        nrOfTasksCompleted++;
                    }
                }
            }
            return nrOfTasksCompleted;
        }

        // Code to be executed in lesson module listing
        if(this._lessonModuleId.length && this._lessonModuleTasks.length){
            this._lessonModuleId.forEach((lesson) => {
                const lessonID =    lesson.getAttribute("data-lesson-module-id");
                const lessonTasks = lesson.getAttribute("data-lesson-module-tasks");
                if(localstorageLessonStatus[lessonID]){
                    const nrOfTasksCompleted = getLessonTasksCompleted(lessonID);
                    const lessonProgressPercentage = (nrOfTasksCompleted / lessonTasks) * 100;
                    // Sett lesson progress bar
                    lesson.style.height = lessonProgressPercentage + "%";
                }
            })
        }

        // Code to be executed inside a lesson module
        if(this._lessonProgress){
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
                const nrOfTasksCompleted = getLessonTasksCompleted(lessonID);
                // Sett lesson progress bar
                progressBar.style.height = ((nrOfTasksCompleted / nrOfTasksInLesson) * 100) + "%";
            }
    
            function updateChapterProgress(lessonID,chapterID){
                // Get all COMPLETED tasks in chapter
                let nrOfTasksCompleted = 0;
                for(const [task, completed] of Object.entries(localstorageLessonStatus[lessonID][chapterID])){
                    if (completed) {
                        nrOfTasksCompleted++;
                    }
                }
    
                // Get number of tasks in chapter
                const querystring = "[data-lesson-id='" + lessonID + "'][data-lesson-ch='" + chapterID + "']";
                let numberOfTasksInChapter = document.querySelectorAll(querystring).length;
                
                // Set chapter progress bar
                const chapterProgressbar = document.querySelector("[data-chapter-target='" + chapterID + "'] .chapter__progress--bar");
                const chapterProgress = (nrOfTasksCompleted / numberOfTasksInChapter) * 100 + "%";
                chapterProgressbar.style.height = chapterProgress;
            }
        
            // Update lesson progress bar when page loads
            updateLessonProgress(this._lessonID, this._nrOfTasksInLesson, this._lessonProgress);
    
            // Upadate lesson chapter progress bar when page loads
            if(this._chapters){
                this._chapters.forEach((chapter, key) => {
                    const chapterID = chapter.getAttribute("data-chapter-target");
                    if (chapterID > 0){ //skip chapter 0 (Intro)
                        updateChapterProgress(this._lessonID, chapterID);
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
    
                        // Update lesson progress bar
                        updateLessonProgress(this._lessonID, this._nrOfTasksInLesson, this._lessonProgress);
                        updateChapterProgress(lessonID, chapterID);
                    })
                })
            }
        }
    }
}