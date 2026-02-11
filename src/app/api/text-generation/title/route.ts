import { chatCompletion } from "@/lib/groq";

export const POST = async (req: Request) => {
  const token = req.headers.get("token");
  if (!req.body) {
    return new Response(
      JSON.stringify({
        message: "no body",
      }),
      {
        status: 400,
      },
    );
  }

  const bodyPromise = req.text();
  const data = await bodyPromise.then((body) => JSON.parse(body));

  const transcript = data.transcript;

  if (!token) {
    return new Response(
      JSON.stringify({
        message: "Unauthorized",
      }),
      {
        status: 400,
      },
    );
  }
  if (token !== process.env.GENERATE_ROUTE_TOKEN) {
    return new Response(
      JSON.stringify({
        message: "Invalid Token",
      }),
    );
  }

  const title = await chatCompletion({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: transcript,
  });

  console.log(title);

  return new Response(
    JSON.stringify({
      title: title,
    }),
  );
};

const SYSTEM_PROMPT = `You are a title generating expert.Your task is to generate 1 video title from the given transcript.If very short transcript is provided don't generate.`;
