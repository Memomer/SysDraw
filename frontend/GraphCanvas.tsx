import React from 'react';
import ReactFlow, { ReactFlowProvider, type Node, type Edge } from 'reactflow';
import 'reactflow/dist/style.css';

interface GraphCanvasProps {
  nodes: Node[];
  edges: Edge[];
}

/**
 * GraphCanvas component for rendering graphs using ReactFlow.
 * Handles rendering only - accepts nodes and edges as props.
 * Zooming, panning, and dragging are enabled by default.
 */
export const GraphCanvas: React.FC<GraphCanvasProps> = ({ nodes, edges }) => {
  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      />
    </ReactFlowProvider>
  );
};

