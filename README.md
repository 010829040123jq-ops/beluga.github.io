# AI Writing Lab

AI Writing Lab is an AI-assisted creative writing application for story drafting, revision, reader feedback, writing guidance, character management, and Human-AI contribution visualization. It is designed for students, creative writing learners, fiction writers, content creators, and Human-AI writing workflow research.


## Target Users and Use Cases

### Students and Writing Learners

The system supports creative writing practice, story outline training, chapter drafting, and revision exercises. It helps users receive feedback on structure, rhythm, character motivation, and expression.

### Fiction Writers and Content Creators

The system supports short stories, serial fiction, script fragments, character settings, and chapter drafts. It helps writers move from ideas to drafts and review their work from a reader-centered perspective.

### Human-AI Writing Research and Product Design

The system can be used to explore how AI feedback, virtual reader personas, and Human-AI contribution visualization influence user control, authorship perception, and revision decisions.


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
