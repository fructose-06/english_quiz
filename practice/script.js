const quizData = [
    {
        question: "The third day of the week is",
        options: ["Sunday", "Thursday", "Wednesday", "Tuesday"],
        answer: "Tuesday"
    },
    {
        question: "My father is a farmer. He has a ____. It is useful for his farm.",
        options: ["taxi", "ambulance", "boat", "tractor"],
        answer: "tractor"
    },
    {
        question: "Which vehicle has three wheels?",
        options: ["It is a motorcycle.", "It is an ambulance.", "It is a bicycle.", "It is a tricycle."],
        answer: "It is a tricycle."
    },
    {
        question: "Tanawat is thirsty. He wants ____.",
        options: ["soft drink", "sausage", "toast", "macaroni"],
        answer: "soft drink"
    },
    {
        question: "Lisa is my sister. ____ is a singer.",
        options: ["He", "She", "They", "We"],
        answer: "She"
    },
    {
        question: "Mary and Emma are in the art room. ____ are painting pictures.",
        options: ["He", "She", "They", "We"],
        answer: "They"
    },
    {
        question: "Look at those kittens. ____ are my pets.",
        options: ["They", "It", "We", "You"],
        answer: "They"
    },
    {
        question: "Teacher: ____ are you, John? / John: I am 165 cm.",
        options: ["How high", "How tall", "How many", "How long"],
        answer: "How tall"
    },
    {
        question: "Mickey: ____ is the robot? / Shopkeeper: It is 300 baht.",
        options: ["How old", "How tall", "How many", "How much"],
        answer: "How much"
    },
    {
        question: "Pim: ____ geese are there in the field? / Tony: There are ten geese.",
        options: ["How much", "How long", "How many", "What"],
        answer: "How many"
    },
    {
        question: "Sam: I have nothing to write my name. / Ann: Sure, here you are.",
        options: ["May I use your eraser, please?", "May I borrow your pen, please?", "May I come in, please?", "May I sharpen my pencil, please?"],
        answer: "May I borrow your pen, please?"
    },
    {
        question: "Mary: It's dark here. ____ / Jim: Yes, you may.",
        options: ["May I go out, please?", "May I turn on the light?", "May I go to the toilet, please?", "May I switch off the light, please?"],
        answer: "May I turn on the light?"
    },
    {
        question: "(รูปป้ายห้ามจอดรถ ตัว P ขีดคร่อม) This sign means...",
        options: ["Don't park your car here.", "Don't pick the flowers.", "No Pets.", "Don't play in the class."],
        answer: "Don't park your car here."
    },
    {
        question: "[READING]\nPim and Mary are friends. Pim is nine years old. Mary is ten years old. They go to Saitip Primary School in Bangkok. Pim likes sports. She likes riding her bike and she is playing basketball. Mary doesn't like sports. She likes playing with dolls and she loves reading books. They both like animals. Their favorite animal is dogs. Mary has three dogs at home. Pim has only one dog, Jumbo. She likes playing with it.\n\nWhat do Pim and Mary like?",
        options: ["Animals", "Sports", "Reading books", "Riding bikes"],
        answer: "Animals"
    },
    {
        question: "[READING]\nPim and Mary are friends. Pim is nine years old. Mary is ten years old. They go to Saitip Primary School in Bangkok. Pim likes sports. She likes riding her bike and she is playing basketball. Mary doesn't like sports. She likes playing with dolls and she loves reading books. They both like animals. Their favorite animal is dogs. Mary has three dogs at home. Pim has only one dog, Jumbo. She likes playing with it.\n\nHow many dogs does Pim have?",
        options: ["One", "Two", "Three", "Four"],
        answer: "One"
    }
];

let currentQuestionIndex = 0;
let score = 0; // คะแนนแบบเกม (มีโบนัสคอมโบ)
let correctAnswers = 0; // จำนวนข้อที่ตอบถูกจริง (เต็ม 15) เพื่อเอาไปคำนวณ Feedback
let lives = 3;
let currentStreak = 0;
let maxStreak = 0;
let questionTimer;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultArea = document.getElementById('result-area');
const questionEl = document.getElementById('question-text');
const optionsEl = document.getElementById('options');
const quizArea = document.getElementById('quiz-area');
const progressBar = document.getElementById('progress-bar');
const feedbackText = document.getElementById('feedback-text');

const livesDisplay = document.getElementById('lives-display');
const streakDisplay = document.getElementById('streak-display');
const scoreDisplay = document.getElementById('score-display');

function startGame() {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    lives = 3;
    currentStreak = 0;
    maxStreak = 0;
    
    updateHUD();
    loadQuestion();
}

function loadQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];
    questionEl.innerText = currentQuestion.question;
    optionsEl.innerHTML = ''; 
    
    const progressPercentage = (currentQuestionIndex / quizData.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    
    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.onclick = (e) => selectAnswer(option, e.target);
        optionsEl.appendChild(button);
    });
}

function updateHUD() {
    livesDisplay.innerText = "❤️".repeat(lives) + "🖤".repeat(3 - lives);
    streakDisplay.innerText = currentStreak;
    scoreDisplay.innerText = score;
}

function selectAnswer(selectedOption, clickedButton) {
    const currentQuestion = quizData[currentQuestionIndex];
    const allButtons = document.querySelectorAll('.option-btn');
    
    allButtons.forEach(btn => btn.disabled = true);
    
    if (selectedOption === currentQuestion.answer) {
        clickedButton.classList.add('correct');
        currentStreak++;
        correctAnswers++; // นับจำนวนข้อที่ตอบถูก
        if (currentStreak > maxStreak) maxStreak = currentStreak;
        score += 100 + (currentStreak * 50); 
    } else {
        clickedButton.classList.add('wrong');
        currentStreak = 0;
        lives--;
        
        allButtons.forEach(btn => {
            if (btn.innerText === currentQuestion.answer) {
                btn.classList.add('correct');
            }
        });

        quizArea.classList.remove('shake');
        void quizArea.offsetWidth; 
        quizArea.classList.add('shake');
    }
    
    updateHUD();
    
    questionTimer = setTimeout(() => {
        if (lives <= 0) {
            showResults();
            return;
        }

        currentQuestionIndex++;
        
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 1500); 
}

function determineRank(finalScore) {
    if (finalScore >= 5000) return "Grandmaster 👑";
    if (finalScore >= 3500) return "Diamond 💎";
    if (finalScore >= 2000) return "Gold 🥇";
    if (finalScore >= 1000) return "Silver 🥈";
    return "Bronze 🥉";
}


    // ระบบคำแนะนำตาม Diagnostic Rubric (ปรับเป็นแนวทางการเรียนรู้)
function getFeedback(correct) {
    // 12 - 15 คะแนน (Excellent)
    if (correct >= 12) {
        return "🟢 <strong>12 - 15 คะแนน (Excellent)</strong><br><br><strong>การประเมิน:</strong> พื้นฐานคำศัพท์และไวยากรณ์แน่นมาก พร้อมต่อยอดเนื้อหา ป.4 ได้เลย<br><br>💡 <strong>แนวทางการเรียนรู้:</strong> สามารถข้ามการทวนพื้นฐานยาวๆ ไปได้เลย แล้วเน้นลุยเนื้อหาใหม่ๆ เช่น การเปรียบเทียบ (Comparative) และอดีตกาล (Past Tense) ได้เลยครับ!";
    }
    // 8 - 11 คะแนน (Good)
    if (correct >= 8) {
        return "🟡 <strong>8 - 11 คะแนน (Good)</strong><br><br><strong>การประเมิน:</strong> มีพื้นฐานที่ดี แต่อาจจะลืมบางเรื่อง หรือยังสับสนเรื่องคำสรรพนาม (Pronoun) / การตั้งคำถาม (Wh-Questions) อยู่บ้าง<br><br>💡 <strong>แนวทางการเรียนรู้:</strong> ลองเช็กดูว่าตัวเองตอบผิดในข้อไหนบ่อยที่สุด แล้วกลับไปทบทวนเรื่องนั้นเพิ่มเติมอีกนิดให้แม่นยำขึ้น ก่อนเริ่มเรียนเนื้อหาใหม่ครับ";
    }
    // 0 - 7 คะแนน (Needs Support)
    return "🔴 <strong>0 - 7 คะแนน (Needs Support)</strong><br><br><strong>การประเมิน:</strong> ยังมีคลังคำศัพท์ไม่เยอะมาก และอาจจะยังไม่คุ้นเคยกับโครงสร้างประโยคพื้นฐาน<br><br>💡 <strong>แนวทางการเรียนรู้:</strong> อย่าเพิ่งรีบข้ามไปเนื้อหาที่ยากขึ้น ลองกลับมาทบทวนคำศัพท์รอบตัว และฝึกอ่านประโยคสั้นๆ บ่อยๆ ควบคู่ไปกับการเล่นเกมภาษาอังกฤษเพื่อความสนุกและจำง่ายขึ้นครับ";
}


function showResults() {
    gameScreen.classList.add('hidden');
    resultArea.classList.remove('hidden');
    
    progressBar.style.width = '100%';
    
    document.getElementById('final-score').innerText = score;
    document.getElementById('final-streak').innerText = maxStreak;
    
    const rankElement = document.getElementById('level-display');
    rankElement.innerText = determineRank(score);
    
    // อัปเดตข้อความคำแนะนำโดยใช้ 'จำนวนข้อที่ถูก' (correctAnswers)
    feedbackText.innerHTML = `<div>ตอบถูกทั้งหมด: <strong>${correctAnswers} / 15</strong> ข้อ</div><br>` + getFeedback(correctAnswers);
    
    const titleElement = document.getElementById('result-title');
    if (lives <= 0) {
        titleElement.innerText = "ELIMINATED";
        titleElement.style.color = "var(--wrong)";
    } else {
        titleElement.innerText = "VICTORY";
        titleElement.style.color = "var(--correct)";
    }
}

function restartGame() {
    clearTimeout(questionTimer); 
    
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    lives = 3;
    currentStreak = 0;
    maxStreak = 0;
    
    resultArea.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    updateHUD();
    loadQuestion();
}

function restartToMenu() {
    clearTimeout(questionTimer); 
    
    gameScreen.classList.add('hidden');
    resultArea.classList.add('hidden');
    startScreen.classList.remove('hidden');
}