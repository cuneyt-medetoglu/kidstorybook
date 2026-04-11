#!/usr/bin/env python3
"""
Word-level forced alignment using OpenAI Whisper.

Usage:
  python whisper-align.py <audio_path> <language> [model_size]

Output:
  JSON to stdout: { "words": [{ "text": "...", "startMs": 0, "endMs": 120 }, ...], "durationMs": 5000 }

Requirements:
  pip install openai-whisper
"""

import sys
import json
import whisper


def align(audio_path: str, language: str, model_size: str = "base") -> dict:
    model = whisper.load_model(model_size)
    result = model.transcribe(
        audio_path,
        language=language,
        word_timestamps=True,
    )

    words = []
    for segment in result.get("segments", []):
        for w in segment.get("words", []):
            words.append({
                "text": w["word"].strip(),
                "startMs": round(w["start"] * 1000),
                "endMs": round(w["end"] * 1000),
            })

    duration_ms = round(result.get("segments", [{}])[-1].get("end", 0) * 1000) if result.get("segments") else 0

    return {"words": words, "durationMs": duration_ms}


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: whisper-align.py <audio_path> <language> [model_size]"}))
        sys.exit(1)

    audio_path = sys.argv[1]
    language = sys.argv[2]
    model_size = sys.argv[3] if len(sys.argv) > 3 else "base"

    try:
        output = align(audio_path, language, model_size)
        print(json.dumps(output, ensure_ascii=False))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
