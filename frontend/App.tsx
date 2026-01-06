import React, { useState } from 'react';
import type { Graph } from '../graphSchema';
import { mapGraphToReactFlow } from './graphMapper';
import { GraphCanvas } from './GraphCanvas';

const API_URL = 'http://localhost:5000/generate-graph';

/**
 * Main App component for generating and rendering system design graphs.
 * Sends a prompt to the backend AI graph API and renders the result.
 */
const App: React.FC = () => {
  const [graph, setGraph] = useState<Graph | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate diagram: ${response.statusText}`);
      }

      const data: Graph = await response.json();
      setGraph(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate diagram');
    } finally {
      setLoading(false);
    }
  };

  const { nodes, edges } = graph ? mapGraphToReactFlow(graph) : { nodes: [], edges: [] };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px', borderBottom: '1px solid #ddd', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the system you want to diagram..."
          rows={2}
          style={{ flex: 1, resize: 'vertical', padding: '8px' }}
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{ padding: '8px 16px' }}
        >
          {loading ? 'Generating...' : 'Generate Diagram'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '8px 12px', color: 'red' }}>
          Error: {error}
        </div>
      )}

      {!graph && !loading && !error && (
        <div style={{ padding: '8px 12px', color: '#555' }}>
          Enter a prompt and click &quot;Generate Diagram&quot; to create a system design graph.
        </div>
      )}

      <div style={{ flex: 1 }}>
        <GraphCanvas nodes={nodes} edges={edges} />
      </div>
    </div>
  );
};

export default App;

