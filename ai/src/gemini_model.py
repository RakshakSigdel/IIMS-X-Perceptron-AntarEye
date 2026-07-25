import os
from dotenv import load_dotenv
from google import genai

load_dotenv()


def load_model():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise EnvironmentError(
            "GEMINI_API_KEY environment variable not set. "
            "Set it with: export GEMINI_API_KEY='your-api-key-here' "
            "(Windows CMD: set GEMINI_API_KEY='your-api-key-here', "
            "PowerShell: $env:GEMINI_API_KEY='your-api-key-here')"
        )
    client = genai.Client(api_key=api_key)
    return client


if __name__ == "__main__":
    client = load_model()
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Hello, how are you?",
    )
    print(response.text)
