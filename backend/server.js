const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Base de données complète des 29 questions
const quizData = [
    { id: 1, question: "Which YouTuber is known for their humorous videos and social critiques?", options: ["Squeezie", "Cyprien", "McFly et Carlito", "Norman"], correctAnswer: "Cyprien" },
    { id: 2, question: "Who is the most followed French YouTuber in 2023?", options: ["Norman", "Squeezie", "Tibo InShape", "Michou"], correctAnswer: "Squeezie" },
    { id: 3, question: "Which YouTube duo is famous for their challenges?", options: ["McFly et Carlito", "Amixem et Joyca", "Pidi et Valouzz", "Léna Situations et Seb"], correctAnswer: "McFly et Carlito" },
    { id: 4, question: "Which YouTuber is known for their fitness videos?", options: ["Tibo InShape", "Valek", "Big Jim", "Michou"], correctAnswer: "Tibo InShape" },
    { id: 5, question: "Who is the creator of the series '10 Minutes to Lose'?", options: ["Mister V", "Cyprien", "Natoo", "PV Nova"], correctAnswer: "Mister V" },
    { id: 6, question: "Which YouTuber created a song titled 'Everything's Fine'?", options: ["Norman", "Squeezie", "Joyca", "McFly et Carlito"], correctAnswer: "Squeezie" },
    { id: 7, question: "Who is known for their lifestyle and fashion videos on YouTube?", options: ["Léna Situations", "Natoo", "EnjoyPhoenix", "EmmaCakeCup"], correctAnswer: "Léna Situations" },
    { id: 8, question: "Which YouTuber created a series of videos where they tell 'Horrible Stories'?", options: ["Doc Seven", "Squeezie", "David Lafarge", "Amixem"], correctAnswer: "Squeezie" },
    { id: 9, question: "Which YouTuber is famous for their educational videos on general knowledge?", options: ["Doc Seven", "Nota Bene", "Poisson Fécond", "Hugo Décrypte"], correctAnswer: "Doc Seven" },
    { id: 10, question: "What is the name of the comedy series created by Norman?", options: ["Norman Makes Videos", "Norman Stories", "Norman's Journal", "Norman Comedy"], correctAnswer: "Norman Makes Videos" },
    { id: 11, question: "Who is known for their videos on video games and movie reviews?", options: ["Joueur du Grenier", "Amixem", "Bob Lennon", "Mister MV"], correctAnswer: "Joueur du Grenier" },
    { id: 12, question: "Which YouTuber is famous for their quick and quirky cooking videos?", options: ["Cyprien", "Sananas", "Andy", "Rémi Gaillard"], correctAnswer: "Sananas" },
    { id: 13, question: "Who is known for their videos on history and mysteries?", options: ["Nota Bene", "Doc Seven", "Hugo Décrypte", "DirtyBiology"], correctAnswer: "Nota Bene" },
    { id: 14, question: "Which YouTuber is famous for their videos on animals and nature?", options: ["DirtyBiology", "Poisson Fécond", "Léo Grasset", "Max Bird"], correctAnswer: "Léo Grasset" },
    { id: 15, question: "Who is known for their videos on science and experiments?", options: ["e-penser", "DirtyBiology", "Max Bird", "Dr Nozman"], correctAnswer: "Dr Nozman" },
    { id: 16, question: "Which YouTuber is famous for their travel and discovery videos?", options: ["Natoo", "Amixem", "Squeezie", "Damon et Jo"], correctAnswer: "Damon et Jo" },
    { id: 17, question: "Who is known for their videos on extreme challenges and stunts?", options: ["Rémi Gaillard", "Cyrilmp4", "Squeezie", "Michou"], correctAnswer: "Cyrilmp4" },
    { id: 18, question: "Which YouTuber is famous for their life hacks and tips videos?", options: ["Sananas", "Andy", "Léna Situations", "Michou"], correctAnswer: "Andy" },
    { id: 19, question: "Who is known for their movie and series review videos?", options: ["Mister V", "Joueur du Grenier", "Bob Lennon", "Amixem"], correctAnswer: "Bob Lennon" },
    { id: 20, question: "Which YouTuber is famous for their board game and game night videos?", options: ["Amixem", "Squeezie", "Michou", "Joyca"], correctAnswer: "Amixem" },
    { id: 21, question: "Who is known for their videos on current events and politics?", options: ["Hugo Décrypte", "DirtyBiology", "Nota Bene", "Max Bird"], correctAnswer: "Hugo Décrypte" },
    { id: 22, question: "Which YouTuber is famous for their riddles and puzzles?", options: ["Max Bird", "Doc Seven", "Léo Grasset", "Poisson Fécond"], correctAnswer: "Max Bird" },
    { id: 23, question: "Who is known for their retro video game review videos?", options: ["Joueur du Grenier", "Bob Lennon", "Mister MV", "Amixem"], correctAnswer: "Joueur du Grenier" },
    { id: 24, question: "Which YouTuber is famous for their social experiments and hidden cameras?", options: ["Rémi Gaillard", "Cyrilmp4", "Squeezie", "Michou"], correctAnswer: "Rémi Gaillard" },
    { id: 25, question: "Who is known for their videos on international current events?", options: ["Hugo Décrypte", "DirtyBiology", "Nota Bene", "Max Bird"], correctAnswer: "Hugo Décrypte" },
    { id: 26, question: "Which YouTuber is famous for their horror movie review videos?", options: ["Bob Lennon", "Joueur du Grenier", "Mister MV", "Amixem"], correctAnswer: "Bob Lennon" },
    { id: 27, question: "Who is known for their TV series analysis videos?", options: ["Mister V", "Joueur du Grenier", "Bob Lennon", "Amixem"], correctAnswer: "Mister V" },
    { id: 28, question: "Which YouTuber is famous for their indie video game review videos?", options: ["Amixem", "Bob Lennon", "Mister MV", "Joueur du Grenier"], correctAnswer: "Mister MV" },
    { id: 29, question: "Who is known for their videos on cultural current events?", options: ["Hugo Décrypte", "DirtyBiology", "Nota Bene", "Max Bird"], correctAnswer: "Nota Bene" }
];

// Route pour envoyer les questions au frontend (sans la réponse correcte)
app.get('/api/questions', (req, res) => {
    const safeQuestions = quizData.map(({correctAnswer, ...rest}) => rest);
    res.json(safeQuestions);
});

// Route pour vérifier si la réponse est bonne
app.post('/api/check-answer', (req, res) => {
    const { id, answer } = req.body;
    const question = quizData.find(q => q.id === id);

    if (question) {
        const isCorrect = question.correctAnswer === answer;
        res.json({
            correct: isCorrect,
            correctResponse: isCorrect ? null : question.correctAnswer
        });
    } else {
        res.status(404).send("Question non trouvée");
    }
});

app.listen(PORT, () => {
    console.log(`✅ Serveur Backend lancé sur http://localhost:${PORT}`);
});