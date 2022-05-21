let userInput = document.getElementById("prefix2netmask__input");
let assignmentText = document.getElementById("prefix2netmask__address");
let checkButton = document.getElementById("prefix2netmask__checkbutton");
let difficultySelector = document.querySelectorAll('input[name="prefix2netmask__level"]');
let directionSelector = document.querySelectorAll('input[name="prefix2netmask__direction"]');
let alerts = document.getElementById("prefix2netmask__alerts");
let attemptsDisplay = document.getElementById("prefix2netmask__notications--attempts");
let scoreDisplay = document.getElementById("prefix2netmask__notications--score");

let netmaskArray = [
    0,
    128,
    192,
    224,
    240,
    248,
    252,
    254,
    255
];

let prefix;
let attempts = 0;
let score = 0;
let prefixOutput;
let addressOutput;
let netmask;
let userInputReading;
let networkClass = 0;
let conversionDirection = 0;

function generatePrefixAndMask(networkClass){
    if (networkClass == 0){
        networkClass = Math.ceil(Math.random()*3);
    }
    octetOne = Math.round(Math.random() * 255);
    octetTwo = Math.round(Math.random() * 255);
    octetThree = Math.round(Math.random() * 255);
    octetFour = Math.round(Math.random() * 255);
    prefix = Math.round(Math.random() * 6);

    prefixOutput = prefix + (8*networkClass);

    if (prefixOutput >= 24) {
        netmask = "255.255.255." + netmaskArray[prefix];
    } else if (prefixOutput >=16) {
        netmask = "255.255." + netmaskArray[prefix] + ".0";
    } else {
        netmask = "255." + netmaskArray[prefix] + ".0.0";
    }

    if(conversionDirection == 0){
        addressOutput = "IP: " + octetOne + "." + octetTwo + "." + octetThree + "." + octetFour + "/" + prefixOutput;
    } else {
        addressOutput = "IP address: " + octetOne + "." + octetTwo + "." + octetThree + "." + octetFour + "\nNetwork mask: " + netmask;
    }
}

function generateAssignment(networkClass){
    generatePrefixAndMask(networkClass);
    assignmentText.innerText = addressOutput;
}

function gradeAnswer(){
    userInputReading = userInput.value;
    let correctAnswer;
    if(conversionDirection == 0) {
        correctAnswer = netmask;
    } else {
        correctAnswer = prefixOutput;
    }

    if (userInputReading == correctAnswer){
        attempts++;
        score++;
        return true;
    } else {
        attempts++;
        return false;
    }
}

function checkAnswer(){
    if (gradeAnswer()){
        generateAssignment(networkClass);
        displayCorrect();
        userInput.value = "";
    } else {
        displayError();
    }
    attemptsDisplay.innerText = attempts;
    scoreDisplay.innerText = score;
}

function displayCorrect(){
    userInput.classList.add("correct");
    setTimeout(() => {
        userInput.classList.remove("correct");
    }, 150);
}

function displayError(){
    userInput.classList.add("error");
    setTimeout(() => {
        userInput.classList.remove("error");
    }, 1000);
}

generateAssignment(0); // default value


/*-------Events------- */
checkButton.addEventListener('click', ()=>{
    checkAnswer();
});

difficultySelector.forEach((element)=>{
    element.addEventListener("change", () => {
        if (element.checked == true){
            networkClass = element.value;
            generateAssignment(networkClass);
        }
    })
})

directionSelector.forEach((element)=>{
    element.addEventListener("change", () => {
        if (element.checked == true){
            conversionDirection = element.value;
            generateAssignment(networkClass);
        }
    })
})


window.addEventListener('keydown', (event)=>{
    if (event.key == "Enter"){
        checkAnswer();
    }
})
