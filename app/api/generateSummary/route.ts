import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  //todo in the body of the post req
  const { todos } = await request.json();
  console.log(todos);
  // communicate with openAi GPT
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `When responding,welcome the user always as Mr.KWI and say 
      welcome to the kwikwi todo app! limit the response to 200 character`,
      },
      {
        role: "user",
        content: `hello there,provide a summary of the following todos.Count how many todos are in each category
        such as Todo, in progres and done,then tell the user to have a productive day! here's the data:${JSON.stringify(
          todos
        )} `,
      },
    ],
    model: "gpt-3.5-turbo",
  });
  // const { data }: any = response;
  console.log("DATA IS :", response);
  console.log(response.choices[0].message);
  return NextResponse.json(response.choices[0].message);
}
