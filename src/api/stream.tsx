// export async function streamChat(
//   query: string,
//   onChunk: (chunk: string) => void
// ) {
//   const response = await fetch("http://localhost:8000/api/conversations/chat-stream/", {
//     method: "POST",
//     credentials: "include", // 🔥 same as axios withCookies
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ query }),
//   });

//   if (!response.body) {
//     throw new Error("No response body");
//   }

//   const reader = response.body.getReader();
//   const decoder = new TextDecoder("utf-8");

//   let done = false;

//   while (!done) {
//     const { value, done: doneReading } = await reader.read();
//     done = doneReading;

//     const chunkValue = decoder.decode(value);
//     onChunk(chunkValue); // 🔥 push chunk to UI
//   }
// }

export async function streamChat(
  query: string,
  conversationId: number | null,
  onChunk: (chunk: string) => void
) {
  const response = await fetch(
    "http://localhost:8000/api/conversations/chat-stream/",
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        conversation_id: conversationId,
      }),
    }
  );

  if (!response.body) throw new Error("No response body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;

const chunkValue = decoder.decode(value, { stream: true });

const lines = chunkValue.split("\n");

for (let line of lines) {
  if (line.startsWith("data: ")) {
    const data = line.replace("data: ", "");
    onChunk(data);
  }
}
  }
}