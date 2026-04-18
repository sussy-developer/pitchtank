import { GoogleGenerativeAI } from '@google/generative-ai';

async function run() {
  try {
    const models = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyBaQPhNxaawsxKNBVwlYYWYt4mkT6dOoKI`);
    const data = await models.json();
    const valid = data.models.filter(m => m.supportedGenerationMethods.includes('generateContent')).map(m => m.name);
    console.log(valid);
  } catch (error) {
    console.error(error);
  }
}

run();
