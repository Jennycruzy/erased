#!/usr/bin/env bash
# Accuracy check with Gemini Nano on a virtual screen; the screen is recorded to <out>/screen.mp4.
set -u
OUT="${1:-out}"
mkdir -p "$OUT"
export DISPLAY=:99
Xvfb :99 -screen 0 1280x800x24 >/dev/null 2>&1 &
XVFB_PID=$!
sleep 2
ffmpeg -y -loglevel error -video_size 1280x800 -framerate 10 -f x11grab -i :99 -c:v libx264 -preset veryfast -crf 28 -pix_fmt yuv420p "$OUT/screen.mp4" &
FF_PID=$!
node scripts/ci/nano-eval.mjs "$(command -v google-chrome)" "${PROFILE_DIR:-/tmp/nano-profile}" "$OUT" "${EVAL_TIMEOUT_MIN:-45}"
CODE=$?
kill -INT "$FF_PID" 2>/dev/null; wait "$FF_PID" 2>/dev/null
kill "$XVFB_PID" 2>/dev/null
exit "$CODE"
