let balls = 0;
let runs = 0;

const ballDisplay = document.getElementById("balls");
const runDisplay = document.getElementById("runs");
const hitBtn = document.getElementById("hitBtn");
const resetBtn = document.getElementById("resetBtn");

const scores = [0, 1, 2, 3, 4, 6];

hitBtn.addEventListener("click", () => {

    if (balls < 6) {

        let randomRun = scores[Math.floor(Math.random() * scores.length)];

        runs += randomRun;
        balls++;

        ballDisplay.textContent = balls;
        runDisplay.textContent = runs;

        if (balls >= 6) {
            hitBtn.disabled = true;
            alert("Over Finished!\nTotal Runs: " + runs);
        }
    }

});

resetBtn.addEventListener("click", () => {

    balls = 0;
    runs = 0;

    ballDisplay.textContent = balls;
    runDisplay.textContent = runs;

    hitBtn.disabled = false;

});