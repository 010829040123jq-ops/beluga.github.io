# AI Writing Lab

AI Writing Lab is an AI-assisted creative writing application for story drafting, revision, reader feedback, writing guidance, character management, and Human-AI contribution visualization.

## Features

- Chapter drafting
- Text revision, expansion, compression, and continuation
- Virtual reader feedback
- Writing mentor suggestions
- Human-AI contribution visualization
- Character library
- Story canvas
- Behavior logs

## Project Structure

```text
ai-writing-app-clean/
├── index.html
├── package.json
├── README.md
└── api/
    └── generate.js
```

## Deployment

The project can be deployed on Vercel.

Environment variables:

```text
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-4.1-mini
```

## Local Development

```bash
npm install -g vercel
vercel dev
```

The API key should be configured through environment variables.
