#!/usr/bin/env python3
"""
Batch read screenshots in groups for Claude analysis.
Outputs markdown-formatted batches.
"""

import os
import sys
from pathlib import Path

def get_screenshots(folder):
    """Get sorted list of screenshot paths."""
    extensions = {'.png', '.jpg', '.jpeg'}
    files = []
    for f in Path(folder).iterdir():
        if f.suffix.lower() in extensions:
            files.append(str(f))
    return sorted(files)

def create_batches(files, batch_size=10):
    """Split files into batches."""
    return [files[i:i+batch_size] for i in range(0, len(files), batch_size)]

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 batch-reader.py <folder> [batch_size]")
        sys.exit(1)

    folder = sys.argv[1]
    batch_size = int(sys.argv[2]) if len(sys.argv) > 2 else 10

    files = get_screenshots(folder)
    batches = create_batches(files, batch_size)

    print(f"# Screenshot Batches")
    print(f"Total: {len(files)} files in {len(batches)} batches of {batch_size}")
    print()

    for i, batch in enumerate(batches, 1):
        print(f"## Batch {i}/{len(batches)}")
        print("```")
        for f in batch:
            print(f"Read: {f}")
        print("```")
        print()

if __name__ == "__main__":
    main()
