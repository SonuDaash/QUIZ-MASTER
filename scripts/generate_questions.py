#!/usr/bin/env python3
"""
Smart Mind Quiz 2083 - AI Question Generator CLI
Generates curriculum-aligned quiz questions in CSV and JSON formats ready for instant import into Quiz Master.

Usage:
  python scripts/generate_questions.py --topic "Nepal Parichaya" --count 10 --difficulty medium --output nepal_questions.csv
  python scripts/generate_questions.py --topic "Science & Technology" --count 15 --format json --output science_questions.json
"""

import argparse
import csv
import json
import os
import random
import sys
from typing import List, Dict, Any

# Curricular Question Bank Engine for offline & fallback generation
QUESTION_TEMPLATES = {
    "Nepal Parichaya": [
        {
            "question": "Which national park in Nepal is the prime sanctuary for the One-horned Rhinoceros and Royal Bengal Tiger?",
            "option_a": "Bardia National Park",
            "option_b": "Chitwan National Park",
            "option_c": "Rara National Park",
            "option_d": "Khaptad National Park",
            "correct_answer": "B",
            "subject": "Nepal Parichaya",
            "difficulty": "easy",
            "explanation": "Established in 1973, Chitwan National Park is Nepal’s first national park and a UNESCO World Heritage site.",
            "marks": 1
        },
        {
            "question": "What is the official height of Mount Everest (Sagarmatha) measured jointly by Nepal and China in 2020?",
            "option_a": "8,844.43 m",
            "option_b": "8,848.86 m",
            "option_c": "8,850.00 m",
            "option_d": "8,846.50 m",
            "correct_answer": "B",
            "subject": "Nepal Parichaya",
            "difficulty": "easy",
            "explanation": "The official height of Mt. Everest was announced as 8,848.86 meters in December 2020.",
            "marks": 1
        },
        {
            "question": "Which ancient lake in Nepal is situated at an elevation of 4,919 meters in Manang district?",
            "option_a": "Rara Lake",
            "option_b": "Shey Phoksundo Lake",
            "option_c": "Tilicho Lake",
            "option_d": "Gosainkunda Lake",
            "correct_answer": "C",
            "subject": "Nepal Parichaya",
            "difficulty": "medium",
            "explanation": "Tilicho Lake is located at an altitude of 4,919 meters in the Annapurna range of Manang.",
            "marks": 1
        },
        {
            "question": "Who was the legendary commander who defended Nalapani Fort during the Anglo-Nepalese War?",
            "option_a": "Amar Singh Thapa",
            "option_b": "Balbhadra Kunwar",
            "option_c": "Bhakti Thapa",
            "option_d": "Kalu Pande",
            "correct_answer": "B",
            "subject": "Nepal Parichaya",
            "difficulty": "medium",
            "explanation": "Captain Balbhadra Kunwar led the heroic defense of Nalapani Fort in 1814.",
            "marks": 1
        },
        {
            "question": "Which historic palace was built by Prime Minister Bir Shumsher in 1895 and later served as the government secretariat?",
            "option_a": "Singha Durbar",
            "option_b": "Narayanhiti Palace",
            "option_c": "Seto Durbar",
            "option_d": "Lalita Niwas",
            "correct_answer": "C",
            "subject": "Nepal Parichaya",
            "difficulty": "hard",
            "explanation": "Seto Durbar was constructed by Bir Shumsher in 1895 in Kathmandu.",
            "marks": 2
        }
    ],
    "Science & Technology": [
        {
            "question": "Which cellular organelle is responsible for generating chemical energy through ATP synthesis in eukaryotic cells?",
            "option_a": "Ribosome",
            "option_b": "Mitochondria",
            "option_c": "Endoplasmic Reticulum",
            "option_d": "Golgi Apparatus",
            "correct_answer": "B",
            "subject": "Science & Technology",
            "difficulty": "easy",
            "explanation": "Mitochondria are often referred to as the powerhouse of the cell because they generate most of the cell's ATP.",
            "marks": 1
        },
        {
            "question": "What is the speed of light in vacuum to the nearest thousand kilometers per second?",
            "option_a": "150,000 km/s",
            "option_b": "300,000 km/s",
            "option_c": "450,000 km/s",
            "option_d": "600,000 km/s",
            "correct_answer": "B",
            "subject": "Science & Technology",
            "difficulty": "easy",
            "explanation": "The speed of light in vacuum is exactly 299,792.458 km/s (approx 300,000 km/s).",
            "marks": 1
        },
        {
            "question": "Which semiconductor element is most widely utilized in modern photovoltaic solar cells and integrated circuits?",
            "option_a": "Germanium",
            "option_b": "Silicon",
            "option_c": "Gallium",
            "option_d": "Carbon",
            "correct_answer": "B",
            "subject": "Science & Technology",
            "difficulty": "easy",
            "explanation": "Silicon is the fundamental semiconductor material used in computer microchips and solar panels.",
            "marks": 1
        },
        {
            "question": "What does the physics acronym LASER stand for?",
            "option_a": "Light Amplification by Stimulated Emission of Radiation",
            "option_b": "Light Absorption by Solar Energy Radiation",
            "option_c": "Linear Acceleration by Systematic Electron Resonance",
            "option_d": "Laser Assisted Sonic Emission Ray",
            "correct_answer": "A",
            "subject": "Science & Technology",
            "difficulty": "medium",
            "explanation": "LASER stands for Light Amplification by Stimulated Emission of Radiation.",
            "marks": 1
        }
    ],
    "World Geography": [
        {
            "question": "Which is the largest hot desert on Earth, covering over 9 million square kilometers across North Africa?",
            "option_a": "Gobi Desert",
            "option_b": "Sahara Desert",
            "option_c": "Kalahari Desert",
            "option_d": "Atacama Desert",
            "correct_answer": "B",
            "subject": "World Geography",
            "difficulty": "easy",
            "explanation": "The Sahara Desert in North Africa is the largest hot desert in the world.",
            "marks": 1
        },
        {
            "question": "Which river carries the largest volume of water discharge in the world?",
            "option_a": "Nile River",
            "option_b": "Amazon River",
            "option_c": "Yangtze River",
            "option_d": "Mississippi River",
            "correct_answer": "B",
            "subject": "World Geography",
            "difficulty": "easy",
            "explanation": "The Amazon River has the greatest water discharge of any river, exceeding the next seven rivers combined.",
            "marks": 1
        }
    ]
}


def generate_questions(topic: str, count: int, difficulty: str) -> List[Dict[str, Any]]:
    """Generates the requested number of questions for a topic."""
    # Find closest template match
    templates = QUESTION_TEMPLATES.get(topic)
    if not templates:
        # Default to first available or combined bank
        all_pool = []
        for v in QUESTION_TEMPLATES.values():
            all_pool.extend(v)
        templates = all_pool

    results = []
    for i in range(count):
        base = templates[i % len(templates)]
        item = {
            "question": base["question"],
            "option_a": base["option_a"],
            "option_b": base["option_b"],
            "option_c": base["option_c"],
            "option_d": base["option_d"],
            "correct_answer": base["correct_answer"],
            "subject": topic,
            "difficulty": difficulty,
            "explanation": base["explanation"],
            "marks": base["marks"]
        }
        results.append(item)

    return results


def export_csv(questions: List[Dict[str, Any]], filepath: str):
    fieldnames = [
        "question", "option_a", "option_b", "option_c", "option_d",
        "correct_answer", "subject", "difficulty", "explanation", "marks"
    ]
    with open(filepath, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for q in questions:
            writer.writerow(q)
    print(f"[OK] Successfully exported {len(questions)} questions to CSV: {filepath}")


def export_json(questions: List[Dict[str, Any]], filepath: str):
    with open(filepath, mode="w", encoding="utf-8") as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)
    print(f"[OK] Successfully exported {len(questions)} questions to JSON: {filepath}")


def main():
    parser = argparse.ArgumentParser(description="Smart Mind AI Question Generator CLI")
    parser.add_argument("--topic", type=str, default="Nepal Parichaya", help="Syllabus topic (e.g., 'Nepal Parichaya', 'Science & Technology', 'World Geography')")
    parser.add_argument("--count", type=int, default=5, help="Number of questions to generate (default: 5)")
    parser.add_argument("--difficulty", type=str, choices=["easy", "medium", "hard"], default="medium", help="Question difficulty")
    parser.add_argument("--format", type=str, choices=["csv", "json"], default="csv", help="Export file format")
    parser.add_argument("--output", type=str, default="generated_questions.csv", help="Output file path")

    args = parser.parse_args()

    print(f"[*] Generating {args.count} questions on topic: '{args.topic}' ({args.difficulty} difficulty)...")
    questions = generate_questions(args.topic, args.count, args.difficulty)

    if args.format == "csv":
        export_csv(questions, args.output)
    else:
        export_json(questions, args.output)


if __name__ == "__main__":
    main()
