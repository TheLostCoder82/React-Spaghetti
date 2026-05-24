/**
 * Logic Graph Editor Component
 * 
 * Main React Flow canvas for visual logic graph editing.
 * Integrates custom node types and synchronizes with the workspace store.
 */

import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useWorkspaceStore } from '../store/useWorkspaceStore';
import {
  StateNode,
  PropNode,
  EventTriggerNode,
  ActionNode,
  ConditionNode,
} from './nodes';
import { LogicNode, LogicEdge } from '../types/schema';

// Define node type mapping for React Flow
const nodeTypes = {
  state: StateNode,
  prop: PropNode,
  eventTrigger: EventTriggerNode,
  action: ActionNode,
  condition: ConditionNode,
};

// Convert schema LogicNode to React Flow Node
const convertLogicNodeToFlowNode = (logicNode: LogicNode): Node => ({
  id: logicNode.id,
  type: logicNode.type,
  position: logicNode.position,
  data: logicNode.data,
});

// Convert schema LogicEdge to React Flow Edge
const convertLogicEdgeToFlowEdge = (logicEdge: LogicEdge): Edge => ({
  id: logicEdge.id,
  source: logicEdge.source,
  target: logicEdge.target,
  sourceHandle: logicEdge.sourceHandle,
  targetHandle: logicEdge.targetHandle,
});

export const LogicGraphEditor = () => {
  const { state, addLogicNode, connectLogicNodes } = useWorkspaceStore();

  // Initialize nodes and edges from store
  const initialNodes = useMemo(
    () => state.logicGraph.nodes.map(convertLogicNodeToFlowNode),
    [state.logicGraph.nodes]
  );

  const initialEdges = useMemo(
    () => state.logicGraph.edges.map(convertLogicEdgeToFlowEdge),
    [state.logicGraph.edges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Connection validation based on schema rules
  const isValidConnection = useCallback(
    (connection: Connection): boolean => {
      const { source, target, sourceHandle } = connection;

      if (!source || !target) return false;

      // Find source and target nodes
      const sourceNode = nodes.find((n) => n.id === source);
      const targetNode = nodes.find((n) => n.id === target);

      if (!sourceNode || !targetNode) return false;

      const sourceType = sourceNode.type as string;
      const targetType = targetNode.type as string;

      // Rule 1: EventTrigger can only connect to Action or Condition
      if (sourceType === 'eventTrigger') {
        return targetType === 'action' || targetType === 'condition';
      }

      // Rule 2: Condition must expose true/false handles connecting only to Action
      if (sourceType === 'condition') {
        if (sourceHandle !== 'true' && sourceHandle !== 'false') {
          return false;
        }
        return targetType === 'action';
      }

      // Rule 3: Action can connect to another Action or State
      if (sourceType === 'action') {
        return targetType === 'action' || targetType === 'state';
      }

      // Rule 4: State can connect to Action (for expressions using state value)
      if (sourceType === 'state') {
        return targetType === 'action';
      }

      // Rule 5: Prop can connect to Action (for expressions using prop value)
      if (sourceType === 'prop') {
        return targetType === 'action';
      }

      return false;
    },
    [nodes]
  );

  // Handle edge creation and sync with store
  const onConnect = useCallback(
    (params: Connection) => {
      if (isValidConnection(params)) {
        const newEdge: Edge = {
          ...params,
          id: `edge-${params.source}-${params.target}`,
        };

        setEdges((eds) => addEdge(newEdge, eds));

        // Sync with store
        const schemaEdge: LogicEdge = {
          id: newEdge.id,
          source: newEdge.source,
          target: newEdge.target,
          sourceHandle: newEdge.sourceHandle,
          targetHandle: newEdge.targetHandle,
        };

        connectLogicNodes(schemaEdge);
      }
    },
    [setEdges, connectLogicNodes, isValidConnection]
  );

  // Handle node changes (drag, resize, etc.)
  const handleNodesChange = useCallback(
    (changedNodes: Node[]) => {
      setNodes(changedNodes);
      // Optionally sync position changes back to store here
    },
    [setNodes]
  );

  return (
    <div className="w-full h-full bg-slate-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#64748b', strokeWidth: 2 },
        }}
        className="bg-slate-900"
      >
        <Controls className="bg-slate-800 border border-slate-700 rounded-lg" />
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#475569"
        />
      </ReactFlow>
    </div>
  );
};

export default LogicGraphEditor;
