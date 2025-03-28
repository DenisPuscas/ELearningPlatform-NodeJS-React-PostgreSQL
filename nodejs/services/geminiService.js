import axios from 'axios';
import 'dotenv/config';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const generateGeminiResponse = async (prompt) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${apiKey}`,
            {
              contents: [
                {
                  parts: [{ text: prompt }],
                },
              ],
            }
        );
      
        return response.data.candidates[0]?.content.parts[0].text;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw error;
    }
};