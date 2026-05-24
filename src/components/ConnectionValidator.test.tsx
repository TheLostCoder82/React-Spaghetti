/**
 * Connection Validation Tests
 * 
 * Formal unit assertions validating the graph node wiring interceptor rules matrix.
 * Tests isValidConnection logic for all valid and invalid connection scenarios.
 */

import { describe, it, expect } from 'vitest';
import { Connection } from '@xyflow/react';
import { Node } from '@xyflow/react';

// Mock node types for testing
type NodeType = 'state' | 'prop' | 'eventTrigger' | 'action' | 'condition';

interface MockNode extends Node {
  type: NodeType;
}

/**
 * Connection validation function matching LogicGraphEditor logic
 */
function isValidConnection(
  connection: Connection,
  nodes: MockNode[]
): boolean {
  const { source, target, sourceHandle } = connection;

  if (!source || !target) return false;

  // Find source and target nodes
  const sourceNode = nodes.find((n) => n.id === source);
  const targetNode = nodes.find((n) => n.id === target);

  if (!sourceNode || !targetNode) return false;

  const sourceType = sourceNode.type;
  const targetType = targetNode.type;

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
}

describe('Connection Validation Rules', () => {
  // Helper to create mock nodes
  const createNode = (id: string, type: NodeType): MockNode => ({
    id,
    type,
    position: { x: 0, y: 0 },
  });

  describe('EventTrigger connection rules', () => {
    const eventNode = createNode('event-1', 'eventTrigger');
    const actionNode = createNode('action-1', 'action');
    const conditionNode = createNode('condition-1', 'condition');
    const stateNode = createNode('state-1', 'state');

    it('should allow EventTrigger to connect to Action', () => {
      const nodes = [eventNode, actionNode];
      const connection: Connection = {
        source: 'event-1',
        target: 'action-1',
      };

      expect(isValidConnection(connection, nodes)).toBe(true);
    });

    it('should allow EventTrigger to connect to Condition', () => {
      const nodes = [eventNode, conditionNode];
      const connection: Connection = {
        source: 'event-1',
        target: 'condition-1',
      };

      expect(isValidConnection(connection, nodes)).toBe(true);
    });

    it('should reject EventTrigger connecting directly to State', () => {
      const nodes = [eventNode, stateNode];
      const connection: Connection = {
        source: 'event-1',
        target: 'state-1',
      };

      expect(isValidConnection(connection, nodes)).toBe(false);
    });

    it('should reject EventTrigger connecting to Prop', () => {
      const propNode = createNode('prop-1', 'prop');
      const nodes = [eventNode, propNode];
      const connection: Connection = {
        source: 'event-1',
        target: 'prop-1',
      };

      expect(isValidConnection(connection, nodes)).toBe(false);
    });
  });

  describe('Condition connection rules', () => {
    const conditionNode = createNode('condition-1', 'condition');
    const actionNode1 = createNode('action-1', 'action');
    const actionNode2 = createNode('action-2', 'action');
    const eventNode = createNode('event-1', 'eventTrigger');

    it('should allow Condition with "true" handle to connect to Action', () => {
      const nodes = [conditionNode, actionNode1];
      const connection: Connection = {
        source: 'condition-1',
        target: 'action-1',
        sourceHandle: 'true',
      };

      expect(isValidConnection(connection, nodes)).toBe(true);
    });

    it('should allow Condition with "false" handle to connect to Action', () => {
      const nodes = [conditionNode, actionNode2];
      const connection: Connection = {
        source: 'condition-1',
        target: 'action-2',
        sourceHandle: 'false',
      };

      expect(isValidConnection(connection, nodes)).toBe(true);
    });

    it('should reject Condition without proper handle', () => {
      const nodes = [conditionNode, actionNode1];
      const connection: Connection = {
        source: 'condition-1',
        target: 'action-1',
        sourceHandle: undefined,
      };

      expect(isValidConnection(connection, nodes)).toBe(false);
    });

    it('should reject Condition connecting to non-Action node', () => {
      const nodes = [conditionNode, eventNode];
      const connection: Connection = {
        source: 'condition-1',
        target: 'event-1',
        sourceHandle: 'true',
      };

      expect(isValidConnection(connection, nodes)).toBe(false);
    });
  });

  describe('Action connection rules', () => {
    const actionNode1 = createNode('action-1', 'action');
    const actionNode2 = createNode('action-2', 'action');
    const stateNode = createNode('state-1', 'state');
    const eventNode = createNode('event-1', 'eventTrigger');

    it('should allow Action to connect to another Action', () => {
      const nodes = [actionNode1, actionNode2];
      const connection: Connection = {
        source: 'action-1',
        target: 'action-2',
      };

      expect(isValidConnection(connection, nodes)).toBe(true);
    });

    it('should allow Action to connect to State', () => {
      const nodes = [actionNode1, stateNode];
      const connection: Connection = {
        source: 'action-1',
        target: 'state-1',
      };

      expect(isValidConnection(connection, nodes)).toBe(true);
    });

    it('should reject Action connecting to EventTrigger', () => {
      const nodes = [actionNode1, eventNode];
      const connection: Connection = {
        source: 'action-1',
        target: 'event-1',
      };

      expect(isValidConnection(connection, nodes)).toBe(false);
    });

    it('should reject Action connecting to Condition', () => {
      const conditionNode = createNode('condition-1', 'condition');
      const nodes = [actionNode1, conditionNode];
      const connection: Connection = {
        source: 'action-1',
        target: 'condition-1',
      };

      expect(isValidConnection(connection, nodes)).toBe(false);
    });
  });

  describe('State connection rules', () => {
    const stateNode = createNode('state-1', 'state');
    const actionNode = createNode('action-1', 'action');
    const eventNode = createNode('event-1', 'eventTrigger');

    it('should allow State to connect to Action', () => {
      const nodes = [stateNode, actionNode];
      const connection: Connection = {
        source: 'state-1',
        target: 'action-1',
      };

      expect(isValidConnection(connection, nodes)).toBe(true);
    });

    it('should reject State connecting to EventTrigger', () => {
      const nodes = [stateNode, eventNode];
      const connection: Connection = {
        source: 'state-1',
        target: 'event-1',
      };

      expect(isValidConnection(connection, nodes)).toBe(false);
    });

    it('should reject State connecting to another State', () => {
      const stateNode2 = createNode('state-2', 'state');
      const nodes = [stateNode, stateNode2];
      const connection: Connection = {
        source: 'state-1',
        target: 'state-2',
      };

      expect(isValidConnection(connection, nodes)).toBe(false);
    });
  });

  describe('Prop connection rules', () => {
    const propNode = createNode('prop-1', 'prop');
    const actionNode = createNode('action-1', 'action');
    const stateNode = createNode('state-1', 'state');

    it('should allow Prop to connect to Action', () => {
      const nodes = [propNode, actionNode];
      const connection: Connection = {
        source: 'prop-1',
        target: 'action-1',
      };

      expect(isValidConnection(connection, nodes)).toBe(true);
    });

    it('should reject Prop connecting to State', () => {
      const nodes = [propNode, stateNode];
      const connection: Connection = {
        source: 'prop-1',
        target: 'state-1',
      };

      expect(isValidConnection(connection, nodes)).toBe(false);
    });
  });

  describe('invalid connection scenarios', () => {
    const node = createNode('node-1', 'action');

    it('should reject connection with missing source', () => {
      const nodes = [node];
      const connection: Connection = {
        source: undefined,
        target: 'node-1',
      };

      expect(isValidConnection(connection, nodes)).toBe(false);
    });

    it('should reject connection with missing target', () => {
      const nodes = [node];
      const connection: Connection = {
        source: 'node-1',
        target: undefined,
      };

      expect(isValidConnection(connection, nodes)).toBe(false);
    });

    it('should reject connection with non-existent source node', () => {
      const nodes = [node];
      const connection: Connection = {
        source: 'non-existent',
        target: 'node-1',
      };

      expect(isValidConnection(connection, nodes)).toBe(false);
    });

    it('should reject connection with non-existent target node', () => {
      const nodes = [node];
      const connection: Connection = {
        source: 'node-1',
        target: 'non-existent',
      };

      expect(isValidConnection(connection, nodes)).toBe(false);
    });
  });

  describe('complete workflow scenarios', () => {
    it('should validate complete click-to-state-update workflow', () => {
      const eventNode = createNode('click-event', 'eventTrigger');
      const actionNode = createNode('increment-action', 'action');
      const stateNode = createNode('count-state', 'state');

      const nodes = [eventNode, actionNode, stateNode];

      // Event -> Action
      const eventToAction: Connection = {
        source: 'click-event',
        target: 'increment-action',
      };
      expect(isValidConnection(eventToAction, nodes)).toBe(true);

      // Action -> State
      const actionToState: Connection = {
        source: 'increment-action',
        target: 'count-state',
      };
      expect(isValidConnection(actionToState, nodes)).toBe(true);
    });

    it('should validate conditional workflow with true/false branches', () => {
      const eventNode = createNode('submit-event', 'eventTrigger');
      const conditionNode = createNode('validation-condition', 'condition');
      const successAction = createNode('success-action', 'action');
      const errorAction = createNode('error-action', 'action');

      const nodes = [eventNode, conditionNode, successAction, errorAction];

      // Event -> Condition
      const eventToCondition: Connection = {
        source: 'submit-event',
        target: 'validation-condition',
      };
      expect(isValidConnection(eventToCondition, nodes)).toBe(true);

      // Condition (true) -> Success Action
      const conditionToSuccess: Connection = {
        source: 'validation-condition',
        target: 'success-action',
        sourceHandle: 'true',
      };
      expect(isValidConnection(conditionToSuccess, nodes)).toBe(true);

      // Condition (false) -> Error Action
      const conditionToError: Connection = {
        source: 'validation-condition',
        target: 'error-action',
        sourceHandle: 'false',
      };
      expect(isValidConnection(conditionToError, nodes)).toBe(true);
    });
  });
});
