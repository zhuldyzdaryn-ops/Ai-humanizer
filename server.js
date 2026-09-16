require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// Ключ безопасно подтягивается из скрытых настроек Render
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/humanize', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-3.6-flash",
            generationConfig: {
                temperature: 0.5, 
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
        6. Строго сохраняй в неизменном виде все физические формулы, единицы измерения и специализированные термины.
        
        Текст для обработки: ${req.body.text}`;

        const result = await model.generateContent(prompt);
        res.json({ result: result.response.text() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Сервер запущен на порту 3000'));
