/**
 * ActionNode Component
 * 
 * Renders an operator containing a select dropdown targeting operations like 'setState',
 * with an input box for custom JS expressions.
 */

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export interface ActionNodeData {
  name: string;
  actionType: 'setState' | 'consoleLog' | 'fetchApi';
  expression: string;
}

const ActionNodeComponent = ({ data }: NodeProps) => {
  return (
    <div className="bg-slate-800 border-2 border-green-500 rounded-lg p-3 min-w-[220px] shadow-lg">
      {/* Input Handle - Triggered by event or condition */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 bg-yellow-400"
        style={{ top: '50%' }}
      />
      
      {/* Output Handle - Triggers subsequent actions or state updates */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 bg-green-400"
        style={{ top: '50%' }}
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">A</span>
        </div>
        <span className="text-white font-semibold text-sm">Action</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex flex-col">
          <label className="text-slate-400 text-xs mb-1">Name</label>
          <input
            type="text"
            value={data.name || ''}
            readOnly
            className="bg-slate-700 text-white text-sm px-2 py-1 rounded border border-slate-600 focus:outline-none focus:border-green-500"
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-slate-400 text-xs mb-1">Action Type</label>
          <select
            value={data.actionType || 'setState'}
            disabled
            className="bg-slate-700 text-white text-sm px-2 py-1 rounded border border-slate-600 focus:outline-none focus:border-green-500"
          >
            <option value="setState">setState</option>
            <option value="consoleLog">consoleLog</option>
            <option value="fetchApi">fetchApi</option>
          </select>
        </div>
        
        <div className="flex flex-col">
          <label className="text-slate-400 text-xs mb-1">Expression</label>
          <input
            type="text"
            value={data.expression || ''}
            readOnly
            placeholder="e.g., count + 1"
            className="bg-slate-700 text-white text-sm px-2 py-1 rounded border border-slate-600 focus:outline-none focus:border-green-500 font-mono"
          />
        </div>
      </div>
    </div>
  );
};

export const ActionNode = memo(ActionNodeComponent);
