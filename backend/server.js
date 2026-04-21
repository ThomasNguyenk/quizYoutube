const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const quizData = [
    { id: 1, question: "Which YouTuber is known for their humorous videos?", options: ["Squeezie", "Cyprien", "McFly", "Norman"], correctAnswer: "Cyprien" },
    { id: 2, question: "Who is the most followed French YouTuber in 2023?", options: ["Norman", "Squeezie", "Tibo InShape", "Michou"], correctAnswer: "Squeezie" },
    // Ajoute le reste de tes 29 questions ici...
];

// Route pour récupérer les questions (sans les bonnes réponses pour éviter la triche)
app.get('/api/questions', (req, res) => {
    const questions = quizData.map(({correctAnswer, ...rest}) => rest);
    res.json(questions);
});

// Route pour vérifier une réponse
app.post('/api/check-answer', (req, res) => {
    const { id, answer } = req.body;
    const question = quizData.find(q => q.id === id);
    if (question && question.correctAnswer === answer) {
        res.json({ correct: true });
    } else {
        res.json({ correct: false, correctResponse: question.correctAnswer });
    }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));