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
                temperature: 0.85, // Подняли для непредсказуемости текста
                topP: 0.95,
            }
        });

        const prompt = `Перепиши следующий текст так, чтобы он звучал как естественный академический и исследовательский материал, написанный живым человеком-экспертом. Твоя главная цель — сделать так, чтобы текст успешно проходил проверки на ИИ-генерацию.

        Соблюдай эти критические правила:
        1. Максимальная "взрывность" (burstiness): Строго чередуй длинные, сложные предложения с короткими и емкими. Ритм текста должен быть рваным и естественным, а не монотонным.
        2. Высокая "перплексия": Используй богатый словарный запас и неочевидные (но уместные в науке) синонимы. Избегай клише.
        3. Структура: Делай абзацы разной длины. Никогда не начинай соседние предложения с одинаковых вводных конструкций или частей речи.
        4. Исключи маркеры ИИ: категорически запрещено использовать фразы "в заключение", "важно отметить", "в современном мире", "безусловно", "таким образом", "следует подчеркнуть".
        5. Научная точность: Строго сохраняй в неизменном виде все формулы, единицы измерения, специфические термины и данные.
        
        Текст для обработки: ${req.body.text}`;

        const result = await model.generateContent(prompt);
        res.json({ result: result.response.text() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Сервер запущен на порту 3000'));
