export default {
    _lessonTaskDoneButtons  : document.querySelectorAll("[data-lesson-task-done]"),
    _lessonTaskAnswerButtons: document.querySelectorAll("[data-lesson-task-answer-button]"),
    _lessonTaskDoneWrapper  : document.querySelectorAll(".contentBlocks__task--wrapper"),
    _lessonProgress         : document.querySelector("[data-lesson-progress]"),
    _chapters               : document.querySelectorAll("[data-chapter-target]"),
    _lessonModuleId         : document.querySelectorAll("[data-lesson-module-id]"),
    _lessonModuleTasks      : document.querySelectorAll("[data-lesson-module-tasks]"),
    _lessonID               : "",
    _nrOfTasksInLesson      : 0,
	init() {
        // Get site language
        const siteLanguage = document.querySelector("[data-site-language]").getAttribute("data-site-language");
        let taskCompleteText = "";
        if(siteLanguage == "nb") {
            taskCompleteText = "Fullført";
        }
        if(siteLanguage == "en") {
            taskCompleteText = "Completed";
        }
        
        // Get lessonStatus object from localstorage
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

        function updateButtonText(element){
            let sendInAnswerButton = element.querySelector("[data-lesson-task-answer-button]");
            let taskDoneButton = element.querySelector("[data-lesson-task-done]");
            if(sendInAnswerButton){
                sendInAnswerButton.innerHTML = taskCompleteText;
            }
            if(taskDoneButton){
                taskDoneButton.innerHTML = taskCompleteText;
            }
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
                        updateButtonText(element);
                    }
    
                    // Update nr tasks
                    this._nrOfTasksInLesson++;
                })
            }

            let nrOfTasksInLesson = this._nrOfTasksInLesson; 
            let progressBar = this._lessonProgress;


            
    
            function updateLessonProgress(lessonID,  ){
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
    
            // Lesson task done buttons
            if(this._lessonTaskDoneButtons){
                this._lessonTaskDoneButtons.forEach((element) => {
                    element.addEventListener("click", () => {
                        const lessonID =  element.parentNode.getAttribute("data-lesson-id");
                        const chapterID = element.parentNode.getAttribute("data-lesson-ch");
                        const taskID =    element.parentNode.getAttribute("data-lesson-t");
                        
                        if(!element.parentNode.classList.contains("complete")){
                            element.parentNode.classList.add("complete");
                            updateButtonText(element.parentNode);
                        
                            // Update lesson status object and localstorage
                            localstorageLessonStatus[lessonID][chapterID][taskID] = true;                    
                            localStorage.setItem("lessonStatus", JSON.stringify(localstorageLessonStatus));
        
                            // Update lesson progress bar
                            updateLessonProgress(lessonID);
                            updateChapterProgress(lessonID, chapterID);
                        }
                    })
                })
            }
            // Lesson task answer buttons
            if(this._lessonTaskAnswerButtons){
                this._lessonTaskAnswerButtons.forEach((element) => {
                    element.addEventListener("click", () => {
                        const taskWrapper =     element.parentNode.parentNode;
                        const lessonID =        taskWrapper.getAttribute("data-lesson-id");
                        const chapterID =       taskWrapper.getAttribute("data-lesson-ch");
                        const taskID =          taskWrapper.getAttribute("data-lesson-t");
                        const controllerUrl =   taskWrapper.querySelector("form").getAttribute("baseUrl") + "actions/haxor/lessons/check-answer";
                        const taskAnswer = taskWrapper.querySelector("[data-lesson-task-answer]").value;

                        const ajaxUrl = encodeURI(controllerUrl + "?le=" + lessonID + "&ch=" + chapterID + "&t=" + taskID + "&a=" + taskAnswer);

                        if(!taskWrapper.classList.contains("complete")){
                            const xhttp = new XMLHttpRequest();
                            xhttp.onload = function() {
                                if(this.status == 200 && this.responseText == "correct"){
                                    // Add complete class to parent node
                                    taskWrapper.classList.add("complete");
                                    updateButtonText(taskWrapper);
                                
                                    // Update lesson status object and localstorage
                                    localstorageLessonStatus[lessonID][chapterID][taskID] = true;                    
                                    localStorage.setItem("lessonStatus", JSON.stringify(localstorageLessonStatus));
                
                                    // Update lesson progress bar
                                    updateLessonProgress(lessonID);
                                    updateChapterProgress(lessonID, chapterID);
                                } else {
                                    element.classList.add("wrong");
                                    setTimeout(() => element.classList.remove("wrong"), 1000);
                                }
                            }
                            xhttp.open("GET", ajaxUrl);
                            xhttp.send();
                        }
                    })
                })
            }
        }
    }
}