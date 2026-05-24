/**
 * Visual Canvas Component
 * 
 * Implements a visual drag-and-drop component workspace editor canvas using `@craftjs/core`.
 * Configures a flexible layout container context allowing nested dropping of standard elements.
 * Registers foundational craft node definitions for standard HTML primitives.
 */

import React from 'react';
import { Editor, Frame, Element, useEditor } from '@craftjs/core';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { LayoutNode } from '../types/schema';

/**
 * Generate a unique ID for layout nodes
 */
const generateId = (): string => `layout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Convert Craft.js user component to our LayoutNode schema
 */
const craftToLayoutNode = (
  id: string,
  data: any,
  children: string[]
): LayoutNode => {
  const typeMap: Record<string, LayoutNode['type']> = {
    'Container': 'div',
    'Text': 'text',
    'Button': 'button',
    'Heading': 'h1',
  };

  return {
    id,
    type: typeMap[data.name] || 'div',
    children,
    props: {
      className: data.custom?.className || '',
      ...(data.props || {}),
    },
    styles: {
      padding: data.style?.padding || '8px',
      margin: data.style?.margin || '0',
      backgroundColor: data.style?.backgroundColor || 'transparent',
      color: data.style?.color || 'inherit',
      fontSize: data.style?.fontSize || '14px',
      ...data.style,
    },
  };
};

/**
 * Recursively convert Craft.js tree to our layout tree format
 */
const convertCraftTree = (nodes: Record<string, any>): Record<string, LayoutNode> => {
  const result: Record<string, LayoutNode> = {};
  
  const processNode = (nodeId: string, parentChildren: string[]) => {
    const node = nodes[nodeId];
    if (!node) return;

    const childIds: string[] = [];
    if (node.nodes && node.nodes.length > 0) {
      node.nodes.forEach((childId: string) => {
        processNode(childId, childIds);
      });
    }

    const layoutNode = craftToLayoutNode(nodeId, node.data || {}, childIds);
    result[nodeId] = layoutNode;
    
    if (parentChildren) {
      parentChildren.push(nodeId);
    }
  };

  // Find root node
  const rootNodeId = Object.keys(nodes).find(id => !nodes[id].parent);
  if (rootNodeId) {
    processNode(rootNodeId, []);
  }

  return result;
};

/**
 * Canvas Content Component that listens to Craft.js changes
 */
const CanvasContent: React.FC = () => {
  const { actions, query } = useEditor();
  const { addLayoutNode, updateLayoutNode, state: workspaceState } = useWorkspaceStore();

  // Listen to node changes and sync with workspace store
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const nodes = query.getNodes();
      if (Object.keys(nodes).length === 0) return;

      const layoutNodes = convertCraftTree(nodes);
      
      // Sync each node with workspace store
      Object.entries(layoutNodes).forEach(([id, layoutNode]) => {
        if (workspaceState.layoutTree.nodes[id]) {
          updateLayoutNode(id, layoutNode);
        } else {
          addLayoutNode(id, layoutNode);
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [query, addLayoutNode, updateLayoutNode, workspaceState.layoutTree.nodes]);

  return (
    <Element
      id="root"
      is={Container}
      background="#1e293b"
      padding="24px"
      custom={{ displayName: 'Root Container' }}
    >
      <Element
        is={Container}
        background="#334155"
        padding="16px"
        margin="8px"
        custom={{ displayName: 'Drop Zone' }}
      >
        <Text text="Drag elements here" fontSize="16px" color="#94a3b8" />
      </Element>
    </Element>
  );
};

/**
 * Container Component - A flexible layout element
 */
export const Container: React.FC<{
  background?: string;
  padding?: string;
  margin?: string;
  children?: React.ReactNode;
  custom?: { displayName?: string };
}> = ({ children, ...props }) => {
  return (
    <div
      style={{
        padding: props.padding,
        margin: props.margin,
        backgroundColor: props.background,
        minHeight: '40px',
        borderRadius: '4px',
        border: '1px dashed #475569',
        transition: 'border-color 0.2s',
      }}
      className="craft-container"
    >
      {children}
    </div>
  );
};

/**
 * Text Component - A simple text element
 */
export const Text: React.FC<{
  text?: string;
  fontSize?: string;
  color?: string;
  custom?: { displayName?: string };
}> = ({ text = 'Text', fontSize = '14px', color = '#e2e8f0' }) => {
  return (
    <span
      style={{
        fontSize,
        color,
        padding: '4px',
      }}
      className="craft-text"
    >
      {text}
    </span>
  );
};

/**
 * Button Component - An interactive button element
 */
export const Button: React.FC<{
  text?: string;
  background?: string;
  color?: string;
  padding?: string;
  custom?: { displayName?: string };
}> = ({ text = 'Button', background = '#3b82f6', color = '#ffffff', padding = '8px 16px' }) => {
  return (
    <button
      style={{
        backgroundColor: background,
        color,
        padding,
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
      }}
      className="craft-button"
    >
      {text}
    </button>
  );
};

/**
 * Heading Component - A heading element
 */
export const Heading: React.FC<{
  text?: string;
  level?: 1 | 2 | 3;
  color?: string;
  custom?: { displayName?: string };
}> = ({ text = 'Heading', level = 1, color = '#e2e8f0' }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <Tag
      style={{
        color,
        margin: '8px 0',
        fontSize: `${24 - (level - 1) * 4}px`,
        fontWeight: 'bold',
      }}
      className="craft-heading"
    >
      {text}
    </Tag>
  );
};

/**
 * VisualCanvas Component
 * 
 * Main canvas component that wraps Craft.js Editor with our custom configuration
 */
interface VisualCanvasProps {
  className?: string;
}

export const VisualCanvas: React.FC<VisualCanvasProps> = ({ className = '' }) => {
  return (
    <div className={`w-full h-full overflow-auto ${className}`}>
      <Editor
        resolver={{
          Container,
          Text,
          Button,
          Heading,
        }}
        onRender={(render) => {
          // Custom rendering logic can be added here
          return render;
        }}
      >
        <Frame>
          <CanvasContent />
        </Frame>
      </Editor>
    </div>
  );
};

export default VisualCanvas;
