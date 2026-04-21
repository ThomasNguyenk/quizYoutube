<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

// --- ÉTATS RÉACTIFS ---
const questions = ref([]);
const currentQuestionIndex = ref(0);
const score = ref(0);
const timeLeft = ref(30);
const selectedAnswer = ref(null);
const feedbackMessage = ref("");
const feedbackStatus = ref(""); // "success" ou "error"
const quizOver = ref(false);
const loading = ref(true);
const isProcessing = ref(false);
let timerInterval = null;

// --- CALCULS ---
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || {});

// --- LOGIQUE DU QUIZ ---
const fetchQuestions = async () => {
  loading.value = true;
  try {
    // Assure-tu que ton backend tourne sur le port 3000
    const response = await axios.get('http://localhost:3000/api/questions');
    questions.value = response.data;
    startTimer();
  } catch (error) {
    console.error("Erreur backend:", error);
    feedbackMessage.value = "Erreur : Impossible de charger les questions.";
  } finally {
    loading.value = false;
  }
};

const startTimer = () => {
  clearInterval(timerInterval);
  timeLeft.value = 30;
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      handleTimeout();
    }
  }, 1000);
};

const handleTimeout = () => {
  feedbackMessage.value = "Temps écoulé ! ⏰";
  feedbackStatus.value = "error";
  setTimeout(moveToNext, 2000);
};

const handleAnswerSubmission = async () => {
  if (!selectedAnswer.value || isProcessing.value) return;

  isProcessing.value = true;
  clearInterval(timerInterval);

  try {
    const response = await axios.post('http://localhost:3000/api/check-answer', {
      id: currentQuestion.value.id,
      answer: selectedAnswer.value
    });

    if (response.data.correct) {
      score.value++;
      feedbackMessage.value = "Bonne réponse ! ✨";
      feedbackStatus.value = "success";
    } else {
      feedbackMessage.value = `Faux ! C'était : ${response.data.correctResponse}`;
      feedbackStatus.value = "error";
    }
  } catch (e) {
    feedbackMessage.value = "Erreur de connexion au serveur.";
  }

  setTimeout(moveToNext, 2000);
};

const moveToNext = () => {
  isProcessing.value = false;
  feedbackMessage.value = "";
  feedbackStatus.value = "";
  selectedAnswer.value = null;

  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
    startTimer();
  } else {
    quizOver.value = true;
    clearInterval(timerInterval);
  }
};

const resetQuiz = () => {
  currentQuestionIndex.value = 0;
  score.value = 0;
  quizOver.value = false;
  fetchQuestions();
};

// --- CYCLE DE VIE ---
onMounted(fetchQuestions);
onUnmounted(() => clearInterval(timerInterval));
</script>

<template>
  <div class="quiz-wrapper">
    <div v-if="!quizOver && !loading" class="header-text">
      <h1>Welcome to the Youtuber Quiz!</h1>
      <h3>Question {{ currentQuestionIndex + 1 }} / {{ questions.length }}</h3>
    </div>

    <div class="container">
      <div v-if="loading" class="loading">Chargement des questions...</div>

      <div v-else-if="!quizOver">
        <div class="timer" :class="{ 'timer-low': timeLeft <= 10 }">
          Temps restant : {{ timeLeft }} secondes
        </div>

        <div class="question-box">
          <div class="question-text">{{ currentQuestion.question }}</div>

          <div class="choices-grid">
            <div v-for="option in currentQuestion.options" :key="option" class="choice-item">
              <label :class="{ 'selected': selectedAnswer === option }">
                <input
                    type="radio"
                    :value="option"
                    v-model="selectedAnswer"
                    name="quiz-option"
                />
                {{ option }}
              </label>
            </div>
          </div>
        </div>

        <div class="feedback" :class="feedbackStatus">
          {{ feedbackMessage }}
        </div>

        <button
            @click="handleAnswerSubmission"
            :disabled="isProcessing || !selectedAnswer"
            class="submit-btn"
        >
          {{ isProcessing ? 'Vérification...' : 'Submit Answer' }}
        </button>
      </div>

      <div v-else class="final-screen">
        <h2>Quiz terminé ! 🎉</h2>
        <div class="score-display">Votre score : <strong>{{ score }} / {{ questions.length }}</strong></div>
        <button @click="resetQuiz" class="restart-btn">Restart Quiz</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-wrapper {
  min-height: 100vh;
  padding: 20px;
  background: url('https://static.vecteezy.com/system/resources/thumbnails/035/158/342/small_2x/loop-background-neon-retro-wave-80s-style-video.jpg') center/cover no-repeat fixed;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header-text h1, .header-text h3 {
  text-align: center;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
}

.container {
  max-width: 700px;
  margin: 30px auto;
  padding: 30px;
  background: url('https://png.pngtree.com/thumb_back/fw800/background/20240513/pngtree-beautiful-youtube-banner-design-with-red-and-green-sign-image_15742021.jpg') center/cover;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  text-align: center;
  min-height: 400px;
}

.timer {
  background: rgba(0, 0, 0, 0.8);
  color: #00ff00;
  padding: 10px 20px;
  border-radius: 50px;
  display: inline-block;
  font-weight: bold;
  margin-bottom: 20px;
  border: 1px solid #00ff00;
}

.timer-low {
  color: #ff4757;
  border-color: #ff4757;
  animation: blink 0.8s infinite;
}

.question-text {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 25px;
  color: #fff;
  text-shadow: 1px 1px 2px #000;
  background: rgba(0,0,0,0.4);
  padding: 15px;
  border-radius: 10px;
}

.choices-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.choice-item label {
  display: block;
  padding: 15px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: bold;
  color: #333;
  border: 2px solid transparent;
}

.choice-item label:hover { background: #fff; transform: translateY(-2px); }
.choice-item label.selected {
  background: #2b00ff;
  color: white;
  border-color: #ff0000;
}
.choice-item input { display: none; }

.submit-btn, .restart-btn {
  margin-top: 25px;
  padding: 12px 35px;
  border: none;
  border-radius: 50px;
  background: #4caf50;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

.submit-btn:disabled { background: #888; cursor: not-allowed; }
.submit-btn:hover:not(:disabled) { background: #45a049; }

.feedback { height: 30px; margin-top: 15px; font-weight: bold; font-size: 1.2em; }
.success { color: #2ecc71; text-shadow: 1px 1px 2px #000; }
.error { color: #ff4757; text-shadow: 1px 1px 2px #000; }

.loading, .final-screen { color: white; text-shadow: 2px 2px 4px #000; }
.score-display { font-size: 1.5em; margin: 20px 0; }

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

@media (max-width: 600px) {
  .choices-grid { grid-template-columns: 1fr; }
}
</style>