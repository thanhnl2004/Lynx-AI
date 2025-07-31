import { answerQuestion } from "../services/ai/llm-model.ts";

const getAIResponse = async (req, res) => {
    const { message } = req.body;
    const response = await answerQuestion(message);
    res.json({response});
}

export default getAIResponse;