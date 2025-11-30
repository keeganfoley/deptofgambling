#!/usr/bin/env python3
"""
Process a single screenshot and extract betting data.
Usage: python3 process_single.py <image_path> <output_json>
"""

import sys
import json
import base64
import os
from pathlib import Path

def encode_image(image_path):
    """Encode image to base64."""
    with open(image_path, "rb") as f:
        return base64.standard_b64encode(f.read()).decode("utf-8")

def get_image_type(image_path):
    """Get MIME type from extension."""
    ext = Path(image_path).suffix.lower()
    types = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg'
    }
    return types.get(ext, 'image/png')

def extract_data_from_text(text, filename):
    """
    Parse the extracted text and structure the data.
    This is a fallback parser that looks for common patterns.
    """
    data = {
        "filename": filename,
        "sport": None,
        "page_type": None,
        "games": [],
        "raw_text": text[:500] if text else ""  # Store first 500 chars for debugging
    }

    text_lower = text.lower() if text else ""

    # Detect sport
    if "nfl" in text_lower or "football" in text_lower:
        data["sport"] = "NFL"
    elif "nba" in text_lower or "basketball" in text_lower:
        if "ncaa" in text_lower or "college" in text_lower:
            data["sport"] = "NCAAB"
        else:
            data["sport"] = "NBA"
    elif "ncaab" in text_lower:
        data["sport"] = "NCAAB"
    elif "ncaaf" in text_lower:
        data["sport"] = "NCAAF"
    elif "nhl" in text_lower or "hockey" in text_lower:
        data["sport"] = "NHL"
    elif "mlb" in text_lower or "baseball" in text_lower:
        data["sport"] = "MLB"

    # Detect page type
    if "pro projection" in text_lower or "pro line" in text_lower:
        data["page_type"] = "PRO_PROJECTIONS"
    elif "public betting" in text_lower or "% of bets" in text_lower:
        data["page_type"] = "PUBLIC_BETTING"
    elif "sharp action" in text_lower or "big money" in text_lower:
        data["page_type"] = "PRO_REPORT"
    elif "prop" in text_lower:
        data["page_type"] = "PROPS"

    return data

def main():
    if len(sys.argv) < 3:
        print("Usage: python3 process_single.py <image_path> <output_json>")
        sys.exit(1)

    image_path = sys.argv[1]
    output_json = sys.argv[2]

    if not os.path.exists(image_path):
        print(f"Error: Image not found: {image_path}")
        sys.exit(1)

    filename = os.path.basename(image_path)

    # Load existing data
    with open(output_json, 'r') as f:
        all_data = json.load(f)

    try:
        # For now, we'll create a placeholder that stores the image path
        # The actual analysis will be done by Claude when we run the analysis phase
        extracted = {
            "filename": filename,
            "path": image_path,
            "processed": True,
            "sport": None,
            "page_type": None,
            "needs_analysis": True
        }

        # Try to detect sport/type from filename or basic patterns
        fname_lower = filename.lower()

        # Check timestamp in filename to order
        import re
        time_match = re.search(r'(\d{1,2})\.(\d{2})\.(\d{2})', filename)
        if time_match:
            extracted["capture_time"] = f"{time_match.group(1)}:{time_match.group(2)}:{time_match.group(3)}"

        # Add to appropriate list based on detection
        all_data["games"].append(extracted)

        # Update sport counts
        if extracted.get("sport"):
            sport = extracted["sport"]
            all_data["sports"][sport] = all_data["sports"].get(sport, 0) + 1

        # Save updated data
        with open(output_json, 'w') as f:
            json.dump(all_data, f, indent=2)

        print(f"OK|{filename}")

    except Exception as e:
        error_entry = {
            "filename": filename,
            "error": str(e)
        }
        all_data["errors"].append(error_entry)

        with open(output_json, 'w') as f:
            json.dump(all_data, f, indent=2)

        print(f"ERROR|{filename}|{str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
