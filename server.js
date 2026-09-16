require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Подключаем CORS
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors()); // Разрешаем браузерам отправлять запросы с других сайтов
app.use(express.json());
// server.js
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());
app.use(express.static('public')); // Папка для HTML файла

// ВНИМАНИЕ: Вставьте ваш новый API-ключ в кавычки ниже!
const genAI = new GoogleGenerativeAI('AQ.Ab8RN6LmuykjC5t5vS_QUnxIavsf9AGvxIs_jZGrtEGQ2pK6FQ');

app.post('/api/humanize', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: {
                temperature: 0.5, // Снизили температуру для научного стиля
                topP: 0.95,
            }
        });

        const prompt = `Перепиши следующий текст в строгом академическом и научно-исследовательском стиле. 
        Текст должен звучать объективно, логично и аргументированно, как выдержка из качественной научной статьи или исследовательской работы.
        
        Соблюдай следующие правила:
        1. Используй безличные предложения и страдательный залог (например, "было исследовано", "представляется целесообразным").
        2. Применяй сложную синтаксическую структуру, характерную для академического письма, но сохраняй ясность мысли.
        3. Замени простые слова на профессиональную терминологию.
        4. Полностью исключи эмоциональную окраску, просторечия, обращения к читателю и воду.
        5. Избегай типичных ИИ-шаблонов (таких как "в заключение", "важно отметить", "в современном мире").
        
        Текст для обработки: ${req.body.text}`;

        const result = await model.generateContent(prompt);
        res.json({ result: result.response.text() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Сервер запущен на порту 3000'));
