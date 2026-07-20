# EyeX Technologies — Hub71 MVP

## Executive Summary

EyeX Technologies delivers an **AI-powered business decision intelligence platform** purpose-built for the Hub71 ecosystem. Our MVP demonstrates a production-grade multi-agent system that ingests raw company data, performs multi-perspective analysis, and generates actionable strategic recommendations — all through an interactive dashboard.

**Value Proposition:** Replace weeks of manual business analysis with a 30-second automated intelligence pipeline that any startup founder or investor can query in natural language.

---

## Architecture

```
┌─────────────┐   ┌──────────────┐   ┌──────────────┐
│  User Query  │ → │  Supervisor   │ → │  Engineer    │
│  or Upload   │   │  (Router)    │   │  Agents 🛠️  │
└─────────────┘   └──────┬───────┘   └──────┬───────┘
                         │                  │
                         ▼                  ▼
                  ┌──────────────┐   ┌──────────────┐
                  │  Analyst     │   │  Researcher  │
                  │  Agent 📊    │   │  Agent 🔍    │
                  └──────┬───────┘   └──────┬───────┘
                         │                  │
                         ▼                  ▼
                  ┌──────────────┐   ┌──────────────┐
                  │  Strategist  │   │  Planner     │
                  │  Agent 🎯    │   │  Agent 📋    │
                  └──────┬───────┘   └──────┬───────┘
                         │                  │
                         ▼                  ▼
                  ┌──────────────┐   ┌──────────────┐
                  │  Decision    │   │  Coder Agent │
                  │  Agent 🧠    │   │  💻 → Tester │
                  └──────┬───────┘   └──────┬───────┘
                         │                  │
                         ▼                  ▼
                  ┌──────────────┐   ┌──────────────┐
                  │  Responder   │   │  Documenter  │
                  │  Agent 📝    │   │  Agent 📄    │
                  └──────────────┘   └──────────────┘
```

### Two Core Pipelines

| Pipeline            | Agents                                                                 | Purpose                                      |
| ------------------- | ---------------------------------------------------------------------- | -------------------------------------------- |
| **Intelligence** 🧠 | Analyst → Strategist → Decision                                        | Business analysis, strategic recommendations |
| **Engineering** 🛠️  | Planner → Researcher → Coder → Reviewer → Tester → Documenter → DevOps | Full-stack development automation            |

### Agent Count: **13 specialized agents**

---

## Key Features

### 1. Multi-Agent Intelligence Pipeline

- **Analyst Agent:** Financial metrics, trend detection, anomaly identification
- **Strategist Agent:** Strategic recommendations, risk assessment, opportunity mapping
- **Decision Agent:** Executive summaries, decision chains, confidence scoring

### 2. Company Memory System

- **5 memory layers:** conversation, long-term, agent, short-term, vector
- **Vector embeddings** for semantic search across company knowledge
- **Document understanding** with chunking and storage

### 3. Decision Intelligence Demo

- Analyze → Detect patterns → Generate recommendations → Explain reasoning
- Full transparency: each agent's output and reasoning chain visible

### 4. REST API

- `POST /analyze` — Submit business query, get full pipeline output
- `GET /knowledge` — Query stored company knowledge
- `POST /documents/upload` — Upload company data files
- `GET /report/{session_id}` — Retrieve past intelligence reports

---

## Tech Stack

| Layer         | Technology                                                              |
| ------------- | ----------------------------------------------------------------------- |
| **Backend**   | Python 3.12, FastAPI, LangGraph                                         |
| **AI Agents** | LangGraph AgentExecutor, structured Pydantic outputs                    |
| **Memory**    | Persistent dictionary store + vector embeddings (sentence-transformers) |
| **Frontend**  | React (Vite), TypeScript, TanStack Router, Tailwind CSS                 |
| **Design**    | Glass-morphism, dark theme, responsive                                  |

---

## Development Roadmap

### ✅ Phase 1 — AI Core (Complete)

- [x] 13 specialized LangGraph agents
- [x] Supervisor routing (intelligence + engineering)
- [x] Intelligence pipeline (Analyst → Strategist → Decision)
- [x] Engineering pipeline (Planner → ... → DevOps)

### ✅ Phase 2 — Memory & Knowledge (Complete)

- [x] 5-layer memory architecture
- [x] Vector embeddings for semantic search
- [x] Document upload and chunking pipeline
- [x] Company knowledge CRUD

### ✅ Phase 3 — Demo & Dashboard (Complete)

- [x] Intelligence Hub frontend page
- [x] Business query interface
- [x] Agent activity visualization
- [x] Knowledge/document management UI
- [x] Report history

### 🔄 Phase 4 — Testing & Hardening (In Progress)

- [x] 195 passing tests (unit + integration)
- [ ] Scale testing / load benchmarks
- [ ] Error recovery hardening
- [ ] Authentication integration

### 🔄 Phase 5 — Investor Materials (In Progress)

- [x] Technical documentation (this document)
- [ ] Live demo environment setup
- [ ] Pitch deck alignment
- [ ] Video walkthrough

---

## Running the MVP

### Backend

```bash
cd eyex-backend
pip install -r requirements.txt
python -m app.main
# API at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### Tests

```bash
cd eyex-backend
python -m pytest tests/ -q
# 195 tests passing
```

### Frontend

```bash
npm install
npm run dev
# Dashboard at http://localhost:5173
```

---

## API Endpoints

| Method | Path                                        | Description                    |
| ------ | ------------------------------------------- | ------------------------------ |
| `POST` | `/api/v1/intelligence/analyze`              | Run full intelligence pipeline |
| `POST` | `/api/v1/intelligence/knowledge`            | Store company knowledge        |
| `GET`  | `/api/v1/intelligence/knowledge`            | Query stored knowledge         |
| `POST` | `/api/v1/intelligence/documents/upload`     | Upload company document        |
| `GET`  | `/api/v1/intelligence/documents`            | List uploaded documents        |
| `GET`  | `/api/v1/intelligence/documents/{filename}` | Download document              |
| `GET`  | `/api/v1/intelligence/report/{session_id}`  | Retrieve report                |
| `POST` | `/api/v1/intelligence/analyze-stream`       | Streaming analysis             |

---

## Agent Catalog

| Agent            | Role                               | Output                                |
| ---------------- | ---------------------------------- | ------------------------------------- |
| **Supervisor**   | Routes queries to correct pipeline | Classification + routing decision     |
| **Analyst**      | Analyzes business data             | Key metrics, trends, anomalies        |
| **Strategist**   | Generates strategic options        | Recommendations, risks, opportunities |
| **Decision**     | Synthesizes into decisions         | Executive summary, reasoning chain    |
| **Planner**      | Creates task plans                 | Structured task breakdown             |
| **Researcher**   | Gathers information                | Research findings with sources        |
| **Coder**        | Implements code solutions          | Executable code                       |
| **Reviewer**     | Reviews implementations            | Code review feedback                  |
| **Tester**       | Validates solutions                | Test results                          |
| **Documenter**   | Creates documentation              | Documentation output                  |
| **DevOps**       | Handles deployment                 | Deployment artifacts                  |
| **Responder**    | Formats final response             | Human-readable output                 |
| **Quality Gate** | Validates pipeline quality         | Pass/fail with reasoning              |

---

## Test Suite Summary

```
195 passed, 0 failed
- test_mission.py       ✓ Agent pipeline, graph, routing
- test_supervisor.py    ✓ Classification, routing
- test_graph.py         ✓ Graph compilation, node count
- test_analyst.py       ✓ Business analysis output
- test_strategist.py    ✓ Strategic recommendations
- test_decision.py      ✓ Decision synthesis
- test_coder.py         ✓ Code generation
- test_planner.py       ✓ Task planning
- test_tester.py        ✓ Test generation
- test_benchmark_*.py   ✓ Performance benchmarks
```

---

## Contact

**EyeX Technologies** — Hub71 Cohort

- Platform: [eyex.tech](https://eyex.tech)
- Email: hello@eyex.tech
