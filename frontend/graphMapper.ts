import type { Node, Edge } from 'reactflow';
import type { Graph } from '../graphSchema';

/**
 * Maps a domain Graph into React Flow nodes and edges.
 * Pure function: no side effects, deterministic output for a given input.
 */
export function mapGraphToReactFlow(graph: Graph): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = graph.nodes.map((node, index) => ({
    id: node.id,
    position: {
      x: 0,
      y: index * 100, // simple vertical spacing
    },
    data: {
      label: node.label,
    },
  }));

  const edges: Edge[] = graph.edges.map((edge, index) => ({
    id: `${edge.source}-${edge.target}-${index}`,
    source: edge.source,
    target: edge.target,
  }));

  return { nodes, edges };
}


