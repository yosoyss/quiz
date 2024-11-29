document.addEventListener("DOMContentLoaded", async function () {
    let currentQuestionIndex = 0, questions;
    let intervalID;
    let nextButton = document.querySelector('#next-button');
    let skip = 0;
    let corrected = 0;
    let wrong = 0;
    let categoryId;

    const categories = [
        { id: 9, name: "G.K.", icon: "fas fa-brain", color: "#f17275" },
        { id: 21, name: "Sports", icon: "fas fa-football-ball" },
        { id: 22, name: "Geography", icon: "fas fa-globe" },
        { id: 11, name: "Film", icon: "fas fa-film" },
        { id: 17, name: "Science: Computers", icon: "fas fa-laptop" },
        { id: 18, name: "Gadgets", icon: "fas fa-cogs" },
        { id: 23, name: "History", icon: "fas fa-landmark" },
        { id: 24, name: "Art", icon: "fas fa-palette" },
        { id: 25, name: "Animals", icon: "fas fa-paw" },
        { id: 27, name: "Vehicles", icon: "fas fa-car" },
        { id: 28, name: "Video Games", icon: "fas fa-gamepad" },
        { id: 29, name: "Music", icon: "fas fa-music" },
        { id: 30, name: "Books", icon: "fas fa-book" },
        { id: 31, name: "Theatre", icon: "fas fa-theater-masks" },
        { id: 32, name: "Comics", icon: "fas fa-book-open" },
        { id: 33, name: "Japanese Anime & Manga", icon: "fas fa-dragon" },
        { id: 34, name: "Nature", icon: "fas fa-leaf" },
        { id: 35, name: "Computers", icon: "fas fa-laptop" },
        { id: 36, name: "Science: Computers", icon: "fas fa-laptop" }
    ];

    const categoryContainer = document.querySelector('.categories');
    const loader = document.getElementById('loader');

    categories.forEach(category => {
        const categoryHTML = `
            <div class="box">
                <div class="icon" data-id="${category.id}">
                    <i class="${category.icon}"></i>
                </div>
                <div class="box-data">
                    <h4>${category.name}</h4>
                </div>
            </div>
        `;

        categoryContainer.innerHTML += categoryHTML; // Append the HTML for each category
    });

    // Attach event listener to all category boxes
    document.querySelectorAll('.box').forEach(box => {
        box.addEventListener('click', async function () {
            categoryId = this.querySelector('.icon').getAttribute('data-id');
            await quiz(categoryId); // Pass the category ID to the quiz function
        });
    });

    // Add event listener to the Next button
    nextButton.addEventListener("click", () => {
        clearInterval(intervalID); // Stop the countdown for the current question
        moveToNextQuestion(); // Move to the next question
    });

    // Show the loader
    function showLoader() {
        loader.style.display = 'flex';
    }

    // Hide the loader
    function hideLoader() {
        loader.style.display = 'none';
    }

    function decodeHtmlEntities(text) {
        const textArea = document.createElement("textarea");
        textArea.innerHTML = text;
        return textArea.value;
    }

    const quiz = async (categoryId) => {
        try {

            currentQuestionIndex = 0;
            skip = 0;
            corrected = 0;
            wrong = 0;

            showLoader();
            // Simulate loading
            // await new Promise(resolve => setTimeout(resolve, 1000));


            // Fetch 10 quiz questions
            const response = await fetch(`https://opentdb.com/api.php?amount=10&category=${categoryId}`);
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            const data = await response.json();
            questions = data.results;

            //next button
            nextButton.disabled = true;


            // Hide the category selection screen
            document.querySelector('.home').style.display = 'none';

            // Show the quiz section
            document.querySelector('.quiz').style.display = 'flex';
            currentQuestionIndex = 0;

            // Display the first question
            displayQuestion(currentQuestionIndex);
            nextButton.style.display = "block";
        } catch (error) {

            console.error("Error fetching quiz data:", error);
        } finally {
            hideLoader();
        }
    };

    // Display a question and its options
    const displayQuestion = (index) => {
        const question = questions[index];
        const questionText = decodeHtmlEntities(question.question);
        const correct = decodeHtmlEntities(question.correct_answer);
        const incorrect = question.incorrect_answers.map(decodeHtmlEntities);
        // Shuffle options
        const options = [...incorrect, correct];
        options.sort(() => Math.random() - 0.5);

        // Update the question text
        document.getElementById("question").innerHTML = questionText;

        // Display options
        const optionsContainer = document.getElementById("options");
        optionsContainer.innerHTML = ""; // Clear previous options

        options.forEach(option => {
            const button = document.createElement("button");
            button.textContent = decodeHtmlEntities(option);

            // Add click event to check the answer
            button.addEventListener("click", () => {
                // Mark the selected button
                document.querySelectorAll(".option-button").forEach(btn => {
                    btn.disabled = true; // Disable all buttons
                    btn.classList.remove("active");
                });
                button.classList.add("active"); // Highlight selected button

                // Enable Next button
                nextButton.disabled = false;

                if (option === correct) {
                    corrected++;
                } else {
                    wrong++;
                }
            });

            optionsContainer.appendChild(button);
        });

        // Start the countdown timer
        countdown();
        progress();

        const qindex = currentQuestionIndex;
        document.querySelector(".remaning").innerHTML = `${qindex + 1} / 10`;
    };

    // Handle moving to the next question
    const moveToNextQuestion = () => {

        currentQuestionIndex++;

        //next button
        nextButton.disabled = true;

        if (currentQuestionIndex < questions.length) {
            displayQuestion(currentQuestionIndex);

        } else {
            // End of the quiz
            document.querySelector(".result").style.display = "flex";
            document.querySelector(".quiz").style.display = "none";
            document.getElementById("options").innerHTML = "";
            nextButton.style.display = "none"; // Hide the Next button
            document.querySelector('#skip').innerHTML = `<b>Skipped</b> : ${skip}`;
            document.querySelector(".countdown").innerHTML = ""; // Clear the timer
            document.querySelector('#correct').innerHTML = `<b>Correct :</b> ${corrected}`;
            document.querySelector('#wrong').innerHTML = `<b>Wrong :</b> ${wrong}`;


            // Professionally worded messages based on the score
            const messageContainer = document.querySelector("#final-message");
            if (corrected === 10) {
                messageContainer.innerHTML = "🌟 Outstanding! You achieved a perfect score of 10/10. Your performance demonstrates exceptional knowledge and precision.";
            } else if (corrected >= 7) {
                messageContainer.innerHTML = "✅ Well Done! You scored 7 or more out of 10. Great effort—keep building on your strengths!";
            } else if (corrected >= 4) {
                messageContainer.innerHTML = "📈 Good Try! You scored between 4 and 6. You're on the right track, and with a bit more practice, you'll excel.";
            } else {
                messageContainer.innerHTML = "🔄 Keep Practicing. You scored below 4. Don't be discouraged use this as an opportunity to learn and improve.";
            }
        }
    };

    const progress = () => {
        const progressBar = document.querySelector(".progress");
        let width = ((currentQuestionIndex + 1) / 10) * 100;
        progressBar.style.width = width + "%";
    }


    const countdown = () => {
        var timer = 10;
        var timeText = document.querySelector(".countdown");
        timeText.innerHTML = timer; // Initialize timer display
        timeText.style.color = "#000000";

        intervalID = setInterval(() => {
            timer--;
            timeText.innerHTML = timer;

            if (timer <= 3) {
                timeText.style.color = "#ff0000";
            } else {
                timeText.style.color = "#000000";
            }

            if (timer <= 0) {
                clearInterval(intervalID);

                //if question skippped then increse value
                skip++;
                // console.log("skipped");
                if (currentQuestionIndex < questions.length) {
                    moveToNextQuestion();
                }
            }
        }, 1000)

        clearInterval()
    };


    document.querySelector('#restart').addEventListener("click", async () => {
        // Step 1: Clear the timer and reset the question index
        clearInterval(intervalID);
        currentQuestionIndex = 0;
        skip = 0;
        corrected = 0;
        wrong = 0;

        // Step 2: Reset UI elements
        document.querySelector(".progress").style.width = "0%";
        document.querySelector(".result").style.display = "none";
        document.querySelector(".quiz").style.display = "flex";
        document.querySelector(".countdown").innerHTML = "";
        document.getElementById("options").innerHTML = "";
        document.getElementById("question").innerHTML = "Loading new quiz...";

        try {
            await quiz(categoryId);
            // console.log(categoryId)
        } catch (error) {
            console.error("Error restarting quiz:", error);
            document.getElementById("question").innerHTML = "Failed to restart quiz. Please try again later.";
        }
    });



    // await quiz(true);
});