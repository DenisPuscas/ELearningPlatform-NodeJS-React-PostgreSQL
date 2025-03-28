import { Router } from "express";
import { generateGeminiResponse } from "../services/geminiService.js";

const router = Router();

router.post('/generate', async (req, res) => {
    try {
        const { prompt } = req.body;
    
        if (!prompt) {
          return res.status(400).json({ error: 'Prompt is required' });
        }
    
        const response = await generateGeminiResponse(prompt);
        res.json({ response });
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Gemini response' });
      }
});

export default router;