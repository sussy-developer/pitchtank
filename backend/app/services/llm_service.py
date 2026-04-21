import os
import json
import re

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "gemini")

_gemini_model = None
_mistral_pipe = None


def _get_gemini():
    global _gemini_model
    if _gemini_model is None:
        import google.generativeai as genai
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError(
                "GEMINI_API_KEY is not set. "
                "Add it to backend/.env or set it as an environment variable."
            )
        genai.configure(api_key=api_key)
        _gemini_model = genai.GenerativeModel("gemini-1.5-flash")
    return _gemini_model


def _get_mistral():
    global _mistral_pipe
    if _mistral_pipe is None:
        from transformers import (
            AutoModelForCausalLM,
            AutoTokenizer,
            BitsAndBytesConfig,
            pipeline,
        )
        import torch

        bnb = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.float16,
        )
        model_id = "mistralai/Mistral-7B-Instruct-v0.2"
        tokenizer = AutoTokenizer.from_pretrained(model_id)
        model = AutoModelForCausalLM.from_pretrained(
            model_id, quantization_config=bnb, device_map="auto"
        )
        _mistral_pipe = pipeline(
            "text-generation", model=model, tokenizer=tokenizer
        )
    return _mistral_pipe


def call_llm(prompt: str) -> str:
    if LLM_PROVIDER == "mistral":
        pipe = _get_mistral()
        messages = [{"role": "user", "content": prompt}]
        out = pipe(messages, max_new_tokens=2048, temperature=0.1, do_sample=True)
        return out[0]["generated_text"][-1]["content"]
    else:
        model = _get_gemini()
        response = model.generate_content(
            prompt,
            generation_config={"temperature": 0.1, "max_output_tokens": 2048},
        )
        return response.text


def parse_json_response(text: str) -> dict:
    # Strip markdown code fences
    text = re.sub(r"```(?:json)?\s*", "", text)
    text = re.sub(r"```\s*", "", text)

    # Find the outermost JSON object
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError as exc:
            raise ValueError(f"JSON parse failed: {exc}\nRaw: {text[:400]}") from exc

    raise ValueError(f"No JSON object found in LLM response:\n{text[:400]}")
