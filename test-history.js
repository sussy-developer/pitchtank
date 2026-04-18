import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyBaQPhNxaawsxKNBVwlYYWYt4mkT6dOoKI");

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const chat = model.startChat({
      history: [
        { role: 'model', parts: [{ text: "Hello!" }] }
      ]
    });
    const result = await chat.sendMessage("test");
    console.log("Success", result.response.text());
  } catch (err) {
    console.error("Error:", err.message);
  }
}
run();
