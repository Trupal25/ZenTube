import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface chatCompletionProps {
  systemPrompt: string;
  userPrompt: string;
}

export const chatCompletion = async ({
  systemPrompt,
  userPrompt,
}: chatCompletionProps) => {
  const generation = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    model: "openai/gpt-oss-120b",
    temperature: 1,
    max_completion_tokens: 2000,
    top_p: 1,
    stream: false,
    reasoning_effort: "medium",
    stop: null,
  });

  const title = generation.choices[0].message.content;
  console.log(title);
  return title;
};
