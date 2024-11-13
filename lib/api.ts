export interface ImageGenerationResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    delta: {
      content: string;
    };
    index: number;
    finish_reason: null | string;
  }[];
}

const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'sk-731348hwhhuqgeuqhoeqoejj';
const API_URL = 'https://flux.robus.us.kg/v1/chat/completions';

export async function generateImage(prompt: string, model: string): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json, text/event-stream',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        stream: true,
        model: "flux-1-schnell",
        temperature: 0.5,
        presence_penalty: 0,
        frequency_penalty: 0,
        top_p: 1
      }),
    });

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response reader');
    }

    let content = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      // Convert the Uint8Array to text
      const chunk = new TextDecoder().decode(value);
      // Split the chunk into lines
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6); // Remove 'data: ' prefix
          if (jsonStr === '[DONE]') continue;
          
          try {
            const data: ImageGenerationResponse = JSON.parse(jsonStr);
            if (data.choices?.[0]?.delta?.content) {
              content += data.choices[0].delta.content;
            }
          } catch (e) {
            console.warn('Failed to parse JSON:', e);
          }
        }
      }
    }

    // Extract image URL from the accumulated content
    const imageUrlMatch = content.match(/\!\[.*?\]\((.*?)\)/);
    if (!imageUrlMatch) {
      throw new Error('No image URL found in response');
    }

    return imageUrlMatch[1];
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
} 