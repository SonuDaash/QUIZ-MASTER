#!/usr/bin/env python3
"""
Smart Mind Quiz 2083 - AI Question Generator CLI
Generates curriculum-aligned quiz questions organized by topics with balanced distractors in CSV and JSON formats.

Supported Topics:
  1. Nepal Parichaya
  2. Mathematics
  3. History
  4. World Geography
  5. Science & Technology
  6. Computer & Tech
  7. Current Affairs

Usage:
  python scripts/generate_questions.py --topic "Nepal Parichaya" --count 10 --difficulty medium --output nepal_questions.csv
  python scripts/generate_questions.py --topic "Mathematics" --count 10 --output math_questions.csv
  python scripts/generate_questions.py --topic "History" --count 10 --output history_questions.csv
  python scripts/generate_questions.py --topic "World Geography" --count 10 --output geo_questions.csv
  python scripts/generate_questions.py --topic "Science & Technology" --count 10 --output science_questions.csv
  python scripts/generate_questions.py --topic "All" --count 20 --output all_syllabus_questions.csv
"""

import argparse
import csv
import json
import os
import random
import sys
from typing import List, Dict, Any

# Curricular Question Bank Sorted by Topic with Balanced Distractors
QUESTION_TEMPLATES: Dict[str, List[Dict[str, Any]]] = {
    # 1. NEPAL PARICHAYA
    "Nepal Parichaya": [
        {
            "question": "Which national park in Nepal was the first to be established and is renowned for the conservation of the One-horned Rhinoceros?",
            "option_a": "Bardia National Park",
            "option_b": "Chitwan National Park",
            "option_c": "Rara National Park",
            "option_d": "Langtang National Park",
            "correct_answer": "B",
            "subject": "Nepal Parichaya",
            "difficulty": "easy",
            "explanation": "Established in 1973 (2030 BS), Chitwan National Park is Nepal’s first national park and a UNESCO World Heritage site.",
            "marks": 1
        },
        {
            "question": "What is the official height of Mount Everest (Sagarmatha) measured jointly by Nepal and China in December 2020?",
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
            "question": "Which lake in Nepal is located at an altitude of 4,919 meters in the Manang district?",
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
            "question": "Which is the longest river flowing through the territory of Nepal?",
            "option_a": "Sapta Koshi",
            "option_b": "Sapta Gandaki",
            "option_c": "Karnali River",
            "option_d": "Mahakali River",
            "correct_answer": "C",
            "subject": "Nepal Parichaya",
            "difficulty": "medium",
            "explanation": "The Karnali River is the longest river in Nepal, measuring approx 507 km within the country.",
            "marks": 1
        },
        {
            "question": "Which district of Nepal is celebrated as the 'District of 52 Lakes and 53 Hills'?",
            "option_a": "Mustang",
            "option_b": "Rukum",
            "option_c": "Dolpa",
            "option_d": "Solukhumbu",
            "correct_answer": "B",
            "subject": "Nepal Parichaya",
            "difficulty": "hard",
            "explanation": "Rukum district in Western Nepal is culturally celebrated for having 52 lakes and 53 hills.",
            "marks": 2
        }
    ],

    # 2. MATHEMATICS & LOGIC
    "Mathematics": [
        {
            "question": "What is the sum of the interior angles of a regular hexagon (6-sided polygon)?",
            "option_a": "540°",
            "option_b": "720°",
            "option_c": "900°",
            "option_d": "1080°",
            "correct_answer": "B",
            "subject": "Mathematics",
            "difficulty": "easy",
            "explanation": "Sum of interior angles = (n - 2) * 180°. For a hexagon (n=6), (6 - 2) * 180° = 720°.",
            "marks": 1
        },
        {
            "question": "What is the length of the hypotenuse in a right-angled triangle with base = 6 cm and height = 8 cm?",
            "option_a": "9 cm",
            "option_b": "10 cm",
            "option_c": "12 cm",
            "option_d": "14 cm",
            "correct_answer": "B",
            "subject": "Mathematics",
            "difficulty": "easy",
            "explanation": "Using Pythagorean theorem: c = √(6² + 8²) = √(36 + 64) = √100 = 10 cm.",
            "marks": 1
        },
        {
            "question": "If the radius of a circle is doubled, by what factor does its surface area increase?",
            "option_a": "2 times",
            "option_b": "4 times",
            "option_c": "8 times",
            "option_d": "16 times",
            "correct_answer": "B",
            "subject": "Mathematics",
            "difficulty": "medium",
            "explanation": "Area of circle = πr². If radius becomes 2r, new area = π(2r)² = 4πr² (4 times original).",
            "marks": 1
        },
        {
            "question": "Find the next number in the square sequence: 1, 4, 9, 16, 25, 36, ... ?",
            "option_a": "45",
            "option_b": "48",
            "option_c": "49",
            "option_d": "56",
            "correct_answer": "C",
            "subject": "Mathematics",
            "difficulty": "easy",
            "explanation": "The sequence consists of squares of natural numbers: 1², 2², 3², 4², 5², 6², 7² = 49.",
            "marks": 1
        }
    ],

    # 3. HISTORY & CIVILIZATIONS
    "History": [
        {
            "question": "Who was the first King of unified modern Nepal, establishing the capital at Kathmandu in 1768 AD?",
            "option_a": "Prithvi Narayan Shah",
            "option_b": "Tribhuvan Bir Bikram Shah",
            "option_c": "Mahendra Bir Bikram Shah",
            "option_d": "Birendra Bir Bikram Shah",
            "correct_answer": "A",
            "subject": "History",
            "difficulty": "easy",
            "explanation": "King Prithvi Narayan Shah of Gorkha unified Nepal in 1768 AD (1825 BS).",
            "marks": 1
        },
        {
            "question": "Which treaty ended the Anglo-Nepalese War between the Kingdom of Nepal and the British East India Company in 1816?",
            "option_a": "Treaty of Betrawati",
            "option_b": "Treaty of Sugauli",
            "option_c": "Treaty of Thapathali",
            "option_d": "Treaty of Lahore",
            "correct_answer": "B",
            "subject": "History",
            "difficulty": "easy",
            "explanation": "The Treaty of Sugauli was ratified in March 1816 establishing Nepal’s modern boundaries.",
            "marks": 1
        },
        {
            "question": "In which year did the historic Kot Parva (Kot Massacre) occur in Kathmandu, leading to the rise of Rana rule?",
            "option_a": "1816 AD (1872 BS)",
            "option_b": "1846 AD (1903 BS)",
            "option_c": "1901 AD (1958 BS)",
            "option_d": "1951 AD (2007 BS)",
            "correct_answer": "B",
            "subject": "History",
            "difficulty": "medium",
            "explanation": "The Kot Massacre occurred on September 14, 1846 (1903 BS), leading to 104 years of Rana rule.",
            "marks": 1
        }
    ],

    # 4. WORLD GEOGRAPHY
    "World Geography": [
        {
            "question": "Which is the largest hot desert on Earth, spanning over 9 million square kilometers across Northern Africa?",
            "option_a": "Gobi Desert",
            "option_b": "Sahara Desert",
            "option_c": "Kalahari Desert",
            "option_d": "Atacama Desert",
            "correct_answer": "B",
            "subject": "World Geography",
            "difficulty": "easy",
            "explanation": "The Sahara Desert in North Africa is the world’s largest hot non-polar desert.",
            "marks": 1
        },
        {
            "question": "Which river holds the record for having the largest volume of water discharge into the world’s oceans?",
            "option_a": "Nile River",
            "option_b": "Amazon River",
            "option_c": "Yangtze River",
            "option_d": "Mississippi River",
            "correct_answer": "B",
            "subject": "World Geography",
            "difficulty": "easy",
            "explanation": "The Amazon River discharges approx 209,000 cubic meters per second, exceeding any other river.",
            "marks": 1
        },
        {
            "question": "Which is the largest landlocked country in the world by total surface area?",
            "option_a": "Mongolia",
            "option_b": "Kazakhstan",
            "option_c": "Bolivia",
            "option_d": "Chad",
            "correct_answer": "B",
            "subject": "World Geography",
            "difficulty": "medium",
            "explanation": "Kazakhstan in Central Asia is the largest landlocked country on Earth (2.72 million km²).",
            "marks": 1
        }
    ],

    # 5. SCIENCE & TECHNOLOGY
    "Science & Technology": [
        {
            "question": "Which cellular organelle is known as the 'Powerhouse of the Cell' because it synthesizes ATP?",
            "option_a": "Ribosome",
            "option_b": "Mitochondria",
            "option_c": "Endoplasmic Reticulum",
            "option_d": "Golgi Complex",
            "correct_answer": "B",
            "subject": "Science & Technology",
            "difficulty": "easy",
            "explanation": "Mitochondria generate most of the chemical energy needed by eukaryotic cells through ATP synthesis.",
            "marks": 1
        },
        {
            "question": "What is the speed of light in vacuum in SI units (rounded to the nearest million meters per second)?",
            "option_a": "150,000,000 m/s",
            "option_b": "300,000,000 m/s",
            "option_c": "450,000,000 m/s",
            "option_d": "600,000,000 m/s",
            "correct_answer": "B",
            "subject": "Science & Technology",
            "difficulty": "easy",
            "explanation": "The speed of light in vacuum is defined as 299,792,458 m/s (approx 3 x 10⁸ m/s).",
            "marks": 1
        },
        {
            "question": "Which chemical element has the lowest atomic number (Atomic Number = 1) in the Periodic Table?",
            "option_a": "Helium",
            "option_b": "Hydrogen",
            "option_c": "Lithium",
            "option_d": "Beryllium",
            "correct_answer": "B",
            "subject": "Science & Technology",
            "difficulty": "easy",
            "explanation": "Hydrogen (H) has an atomic number of 1 and is the lightest chemical element in the universe.",
            "marks": 1
        },
        {
            "question": "Which metal is in liquid state at standard room temperature and pressure (25°C)?",
            "option_a": "Gallium",
            "option_b": "Mercury",
            "option_c": "Bromine",
            "option_d": "Lead",
            "correct_answer": "B",
            "subject": "Science & Technology",
            "difficulty": "easy",
            "explanation": "Mercury (Hg) is the only metallic element that is liquid at standard room temperature and pressure.",
            "marks": 1
        }
    ],

    # 6. COMPUTER & TECH
    "Computer & Tech": [
        {
            "question": "What does the networking acronym 'HTTP' stand for in web browsers and internet protocols?",
            "option_a": "High-speed Text Transfer Path",
            "option_b": "HyperText Transfer Protocol",
            "option_c": "Hyper Transfer Terminal Packet",
            "option_d": "Host Text Transmission Port",
            "correct_answer": "B",
            "subject": "Computer & Tech",
            "difficulty": "easy",
            "explanation": "HTTP stands for HyperText Transfer Protocol, the foundation of data communication on the Web.",
            "marks": 1
        },
        {
            "question": "Which memory type in computer systems is volatile and loses its contents when power is turned off?",
            "option_a": "ROM (Read Only Memory)",
            "option_b": "RAM (Random Access Memory)",
            "option_c": "SSD (Solid State Drive)",
            "option_d": "Flash Memory",
            "correct_answer": "B",
            "subject": "Computer & Tech",
            "difficulty": "easy",
            "explanation": "RAM is primary volatile memory that requires electrical power to retain data.",
            "marks": 1
        }
    ],

    # 7. CURRENT AFFAIRS & SPORTS
    "Current Affairs": [
        {
            "question": "Which country hosted the 33rd Summer Olympic Games in July-August 2024?",
            "option_a": "Tokyo, Japan",
            "option_b": "Paris, France",
            "option_c": "Los Angeles, USA",
            "option_d": "Brisbane, Australia",
            "correct_answer": "B",
            "subject": "Current Affairs",
            "difficulty": "easy",
            "explanation": "The 2024 Summer Olympics were hosted in Paris, France.",
            "marks": 1
        },
        {
            "question": "Which international organization with 193 member states was established on 24 October 1945 in San Francisco?",
            "option_a": "World Bank",
            "option_b": "United Nations (UN)",
            "option_c": "World Trade Organization (WTO)",
            "option_d": "International Monetary Fund (IMF)",
            "correct_answer": "B",
            "subject": "Current Affairs",
            "difficulty": "easy",
            "explanation": "The United Nations (UN) was founded on October 24, 1945.",
            "marks": 1
        }
    ]
}


def generate_questions(topic: str, count: int, difficulty: str) -> List[Dict[str, Any]]:
    """Generates the requested number of questions sorted for a topic."""
    if topic == "All":
        all_pool = []
        for cat, items in QUESTION_TEMPLATES.items():
            all_pool.extend(items)
        templates = all_pool
    else:
        templates = QUESTION_TEMPLATES.get(topic)
        if not templates:
            # Match case-insensitively
            for k, v in QUESTION_TEMPLATES.items():
                if k.lower() in topic.lower() or topic.lower() in k.lower():
                    templates = v
                    break
            if not templates:
                templates = QUESTION_TEMPLATES["Nepal Parichaya"]

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
            "subject": base["subject"],
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
    parser.add_argument(
        "--topic",
        type=str,
        default="Nepal Parichaya",
        help="Syllabus topic ('Nepal Parichaya', 'Mathematics', 'History', 'World Geography', 'Science & Technology', 'Computer & Tech', 'Current Affairs', 'All')"
    )
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
