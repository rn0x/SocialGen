import OpenAI from 'openai';

export default async function GeneratorPosts(content) {
  try {

    const openai = new OpenAI({
      baseURL: process.env.OPENAI_BASE_URL,
      apiKey: process.env.OPENAI_API_KEY,
    });

    const postContentResult = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a posts generator.',
        },
        {
          role: 'user',
          content: `${content} Write a brief description of up to 450 characters in Standard Arabic, making sure to include Arabic diacritics for the entire text`,
        },
      ],
      temperature: 0,
    });

    return postContentResult?.choices?.[0]?.message?.content
  } catch (error) {
    console.error(`[${new Date().toLocaleString()}] ❌ Error occurred: ${error}`);
  }
}