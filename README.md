# Generative AI Engineering Lab

Hands-on experiments exploring **Generative AI, Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), and AI Agents**.

This repository documents my learning journey toward **AI & Software Engineering**, focusing on practical implementations, experimentation, and engineering best practices.

## 🎯 Objectives

- Understand LLM fundamentals and inference.
- Run and interact with local LLMs using Ollama.
- Build applications powered by LangChain.
- Implement RAG pipelines and vector search.
- Explore AI agents and tool integration.
- Apply software engineering principles to AI applications.

## 🛠 Tech Stack

| Category         | Technologies                |
| ---------------- | --------------------------- |
| LLM Runtime      | Ollama                      |
| Models           | Llama 3.2, Qwen             |
| Languages        | Python, TypeScript          |
| Frameworks       | LangChain                   |
| Vector Databases | ChromaDB (planned)          |
| APIs             | REST, OpenAI-compatible API |

_The stack will evolve as new concepts are explored._

## 🧪 Labs & Learning Roadmap

| ID        | Topic                           | Status     |
| --------- | ------------------------------- | ---------- |
| GENAI-001 | Local LLM inference with Ollama | OK         |
| GENAI-002 | Prompt Engineering              | 📋 Planned |
| GENAI-003 | LangChain Fundamentals          | 📋 Planned |
| GENAI-004 | Embeddings & Vector Databases   | 📋 Planned |
| GENAI-005 | RAG Pipeline Implementation     | 📋 Planned |
| GENAI-006 | AI Agents & Tool Calling        | 📋 Planned |

## 🚀 Getting Started

### Prerequisites

- Ollama installed locally
- Python 3.x for upcoming experiments
- A compatible local LLM

### Run a Local LLM

Pull the model:

```bash
ollama pull llama3.2:1b
```

Run the model:

```bash
ollama run llama3.2:1b
```

### Interact with Ollama via REST API

Ollama provides a local HTTP API running on `http://localhost:11434`.

Example request:

```bash
curl http://localhost:11434/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.2:1b",
    "messages": [
      {
        "role": "user",
        "content": "Explain what an LLM is."
      }
    ],
    "stream": false
  }'
```

## 📂 Repository Structure

Planned organization:

```text
genai-engineering-lab/
├── 01-llm-fundamentals/
├── 02-langchain/
├── 03-embeddings/
├── 04-rag/
├── 05-ai-agents/
├── projects/
└── docs/
```

Each lab will progressively include its objectives, implementation, execution instructions, observations, and lessons learned.

## 📚 Learning Approach

**Learn → Experiment → Implement → Validate → Document**

This repository contains personal experiments inspired by learning resources, technical documentation, and hands-on practice.

The objective is to move beyond tutorials and progressively build reliable AI-powered applications.

---

**Status:** Actively learning and experimenting.

**Focus:** Software Engineering • Generative AI • LLM • RAG • AI Agents
