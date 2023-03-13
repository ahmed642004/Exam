let questsion = document.querySelector(".question");
let countSpan = document.querySelector(".count span");
let spans = document.querySelector(".spans");
let button = document.querySelector(".submit");
let answer = document.querySelector(".answers");
let result = document.querySelector("#popup-container");
let grade = document.querySelector(".grade");
let popup = document.getElementById("popup");
let info = document.querySelector(".info");
let countdown = document.querySelector(".count-down")
let questionNum = 0;
let rightAnswers = 0;
let countdownInterval;
function getdata() {
  let xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let quesObj = JSON.parse(this.responseText);
      bullets(quesObj.length);
      getquest(quesObj[questionNum], quesObj.length);
      timer(160,quesObj.length)
      button.onclick = function () {
        
        
        let rightAnswer = quesObj[questionNum].right_answer;
        questionNum++;
        checkAnswer(rightAnswer, quesObj.length);
        questsion.innerHTML = "";
        answer.innerHTML = "";
        getquest(quesObj[questionNum], quesObj.length);
        handleBullets();
        clearInterval(countdownInterval)
        timer()
        showResult(quesObj.length);
      };
    }
  };

  xhr.open("GET", "ques.json");
  xhr.send();
}
function bullets(num) {
  countSpan.innerHTML = num;
  for (i = 0; i < num; i++) {
    let spanss = document.createElement("span");
    if (i == 0) {
      spanss.className = "active";
    }
    spans.appendChild(spanss);
  }
}
function getquest(obj, objlength) {
  if (questionNum < objlength) {
    let heading = document.createElement("h2");
    let text = document.createTextNode(obj["title"]);
    heading.appendChild(text);
    questsion.appendChild(heading);
    for (i = 1; i < 5; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";
      let input = document.createElement("input");
      input.type = "radio";
      input.name = "question";
      input.id = `answer_${i}`;
      input.dataset.answer = obj[`answer_${i}`];
      if (i === 1) {
        input.checked = true;
      }
      let thelabel = document.createElement("label");
      thelabel.htmlFor = `answer_${i}`;
      let labelText = document.createTextNode(obj[`answer_${i}`]);
      thelabel.appendChild(labelText);
      mainDiv.appendChild(input);
      mainDiv.appendChild(thelabel);
      answer.appendChild(mainDiv);
    }
  }
}
function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let choosenAnswer;
  for (i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === choosenAnswer) {
    rightAnswers++;
  }
}
function handleBullets() {
  let bulletSpans = document.querySelectorAll(".spans span");
  let bulletsArray = Array.from(bulletSpans);
  bulletsArray.forEach((span, index) => {
    if (questionNum === index) {
      span.className = "active";
    }
  });
}
function showResult(count) {
  if (questionNum === count) {
    button.remove();
    questsion.remove();
    answer.remove();
    info.remove();
    showPopup();
    let TheResult;
    let theGrade;
    if (rightAnswers > count / 2 && rightAnswers < count) {
      TheResult = document.createElement("span");
      TheResult.className = "grade";
      let resultText = document.createTextNode("Good!");
      TheResult.appendChild(resultText);
      popup.appendChild(TheResult);
      theGrade = document.createElement("span");
      theGrade.className = "mark";
      let gradeText = document.createTextNode(
        `You Got ${rightAnswers} Out Of ${count}`
      );
      theGrade.appendChild(gradeText);
      popup.appendChild(theGrade);
    } else if (rightAnswers === count) {
      TheResult = document.createElement("span");
      TheResult.className = "grade";
      let resultText = document.createTextNode("Perfect!");
      TheResult.appendChild(resultText);
      popup.appendChild(TheResult);
      theGrade = document.createElement("span");
      theGrade.className = "mark";
      let gradeText = document.createTextNode(
        `You Got ${rightAnswers} Out Of ${count}`
      );
      theGrade.appendChild(gradeText);
      popup.appendChild(theGrade);
    } else {
      TheResult = document.createElement("span");
      TheResult.className = "grade";
      let resultText = document.createTextNode("Failed!");
      TheResult.appendChild(resultText);
      popup.appendChild(TheResult);
      theGrade = document.createElement("span");
      theGrade.className = "mark";
      let gradeText = document.createTextNode(
        `You Got ${rightAnswers} Out Of ${count}`
      );
      theGrade.appendChild(gradeText);
      popup.appendChild(theGrade);
    }
  }
}
function showPopup() {
  let popup = document.getElementById("popup");
  let overlay = document.querySelector(".overlay");
  popup.classList.add("popup-show");
  overlay.style.display = "block";
}
document.addEventListener("click", function (e) {
  if (e.target === document.querySelector(".overlay")) {
    hidden();
  }
});
function hidden() {
  let popup = document.getElementById("popup");
  let overlay = document.querySelector(".overlay");
  popup.classList.remove("popup-show");
  overlay.style.display = "none";
}
function timer(duration, objlength) {
  if (questionNum < objlength) {
    let minutes , seconds
    countdownInterval = setInterval(function (){
      minutes = parseInt(duration / 60)
      seconds = parseInt(duration % 60)
      minutes = minutes < 10 ? `0${minutes}` :minutes
      seconds = seconds < 10 ? `0${seconds}` :seconds
      countdown.innerHTML = `${minutes}:${seconds}`
      if(--duration < 0){
        clearInterval(countdownInterval)
        button.click()
      }
    },1000)
  }
}
getdata();
