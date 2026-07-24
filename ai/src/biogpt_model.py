import os
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models", "biogpt-large")
MODEL_NAME = "microsoft/BioGPT-Large"


def load_model():
    if os.path.isdir(MODEL_DIR) and any(os.scandir(MODEL_DIR)):
        print(f"Loading model from local: {MODEL_DIR}")
        tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
        model = AutoModelForCausalLM.from_pretrained(
            MODEL_DIR,
            device_map="auto",
        )
        return model, tokenizer

    print(f"Downloading model: {MODEL_NAME}")
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.bfloat16,
        bnb_4bit_use_double_quant=True,
    )
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        quantization_config=bnb_config,
        device_map="auto",
    )

    os.makedirs(MODEL_DIR, exist_ok=True)
    tokenizer.save_pretrained(MODEL_DIR)
    model.save_pretrained(MODEL_DIR)
    print(f"Model saved to: {MODEL_DIR}")

    return model, tokenizer


def generate(prompt: str, max_length: int = 50) -> str:
    model, tokenizer = load_model()
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    with torch.no_grad():
        generated_ids = model.generate(**inputs, max_length=max_length)
    return tokenizer.decode(generated_ids[0], skip_special_tokens=True)


if __name__ == "__main__":
    result = generate("Ibuprofen is best used for")
    print(result)
    load_model()
