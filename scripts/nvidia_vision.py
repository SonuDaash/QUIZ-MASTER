#!/usr/bin/env python3
"""
NVIDIA NIM Vision & Question Analysis Script
Uses NVIDIA's Vision NIM (`meta/llama-3.2-11b-vision-instruct`) to analyze images and generate quiz questions.
"""

import os
import requests
import json

INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
API_KEY = os.getenv("NVIDIA_API_KEY", "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")

def analyze_image(image_url: str, prompt: str = "What is in this image? Provide a detailed and accurate description.") -> str:
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "meta/llama-3.2-11b-vision-instruct",
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": image_url}}
                ]
            }
        ],
        "max_tokens": 1024,
        "temperature": 0.2
    }

    response = requests.post(INVOKE_URL, headers=headers, json=payload)
    if response.status_code == 200:
        data = response.json()
        return data["choices"][0]["message"]["content"]
    else:
        raise Exception(f"NVIDIA API Error {response.status_code}: {response.text}")


def generate_audiovisual_question(image_url: str) -> dict:
    """Analyzes an image and generates a formatted 4-option quiz question."""
    prompt = (
        "Analyze this image and create 1 competition quiz question based on what is shown. "
        "Return JSON with: question, option_a, option_b, option_c, option_d, correct_answer (A/B/C/D), explanation."
    )
    analysis = analyze_image(image_url, prompt)
    return {"image_url": image_url, "result": analysis}


if __name__ == "__main__":
    test_image = "https://assets.ngc.nvidia.com/products/api-catalog/phi-3-5-vision/example1b.jpg"
    print(f"[*] Analyzing image with NVIDIA NIM: {test_image} ...\n")
    try:
        description = analyze_image(test_image)
        print("=== NVIDIA Vision Analysis Result ===")
        print(description)
    except Exception as e:
        print(f"[!] Error: {e}")
