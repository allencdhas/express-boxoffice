#!/bin/bash
set -e

echo "Installing Python packages..."
python -m pip install --upgrade pip
python -m pip install boxoffice_api==1.2.2

echo "Installing Node.js packages..."
npm install

echo "Making Python script executable..."
chmod +x boxoff.py

echo "Build completed successfully!" 