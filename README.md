## SysDraw – Minimal Graph + AI Diagram Prototype

### Overview

SysDraw is a small full‑stack TypeScript app that:

- Defines a shared `Graph` schema (`graphSchema.ts`)
- Renders graphs with ReactFlow on the frontend
- Exposes backend APIs that:
  - Return a static graph (`GET /graph`)
  - Generate a graph from a prompt via an LLM (`POST /generate-graph`)

Typing a prompt in the frontend and clicking **Generate Diagram** will call the backend AI endpoint, validate the returned graph, map it to ReactFlow nodes/edges, and render it.

### Project Structure

- `graphSchema.ts` – shared `GraphNode`, `GraphEdge`, `Graph` interfaces
- `frontend/graphMapper.ts` – `mapGraphToReactFlow(graph: Graph)`
- `frontend/GraphCanvas.tsx` – thin wrapper around `ReactFlow`
- `frontend/App.tsx` – main UI: prompt box, button, calls backend, renders graph
- `backend/server.ts` – Express server, `/graph` + `/generate-graph` endpoints
- `backend/tsconfig.json` – backend TS config
- `sampleGraph.json` – example graph (not used by default now)
- `vite.config.ts` – Vite + React config
- `tsconfig.json` / `tsconfig.node.json` – root TS configs

### Prerequisites

- Node.js 18+ (20.x recommended)
- npm

### Installation

```bash
npm install
```

### Environment Setup (LLM API Key)

Create `.env` in the project root:

```bash
OPENAI_API_KEY=sk-...your-key-here...
```

Make sure `.env` is not committed (it is already listed in `.gitignore`).

When starting the backend, load the env vars into the shell:

```bash
set -a; source .env; set +a
```

### Running the Backend

```bash
npm run dev:backend
```

- Default port: `5000`
- Endpoints:
  - `GET /graph` – returns a static graph conforming to `Graph`
  - `POST /generate-graph` – request body `{ "prompt": "..." }`, calls the LLM, validates the JSON against `Graph`, and returns:

```json
{
  "nodes": [{ "id": "string", "label": "string" }],
  "edges": [{ "source": "string", "target": "string" }]
}
```

#### Quick backend tests

Static graph:

```bash
curl http://localhost:5000/graph | jq
```

AI‑generated graph:

```bash
curl -s -X POST http://localhost:5000/generate-graph \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Simple web app with client, API server and database"}' | jq
```

If you see `EADDRINUSE` on port 5000:

```bash
lsof -ti:5000 | xargs kill
npm run dev:backend
```

### Running the Frontend

```bash
npm run dev
```

Then open:

```text
http://localhost:5173
```

### Frontend Behavior

- Prompt input (textarea) for the system description
- **Generate Diagram** button:
  - Sends `POST http://localhost:5000/generate-graph` with `{ prompt }`
  - While waiting: button shows “Generating…” and `loading` is true
  - On success: response is typed as `Graph`, passed to `mapGraphToReactFlow`, and rendered via `GraphCanvas`
  - On error: shows a simple error message above the canvas
- Initial state:
  - Canvas is empty
  - A hint text explains to enter a prompt and click **Generate Diagram**

All AI logic (prompting, calling the LLM, JSON parsing, schema validation) lives only in the backend; the frontend just sends a prompt and renders whatever valid `Graph` it receives.


