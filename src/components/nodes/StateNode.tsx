/**
 * StateNode Component
 * 
 * Renders a variable representation displaying a variable title name 
 * and reactive input control text field.
 */

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export interface StateNodeData {
  name: string;
  initialValue: string;
  dataType: 'string' | 'number' | 'boolean' | 'object';
}

const StateNodeComponent = ({ data }: NodeProps) => {
  return (
    <div className="bg-slate-800 border-2 border-blue-500 rounded-lg p-3 min-w-[200px] shadow-lg">
      {/* Output Handle - Provides current state value */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 bg-blue-400"
        style={{ top: '50%' }}
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">S</span>
        </div>
        <span className="text-white font-semibold text-sm">State</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex flex-col">
          <label className="text-slate-400 text-xs mb-1">Name</label>
          <input
            type="text"
            value={data.name || ''}
            readOnly
            className="bg-slate-700 text-white text-sm px-2 py-1 rounded border border-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-slate-400 text-xs mb-1">Initial Value</label>
          <input
            type="text"
            value={data.initialValue || ''}
            readOnly
            className="bg-slate-700 text-white text-sm px-2 py-1 rounded border border-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-slate-400 text-xs mb-1">Type</label>
          <span className="text-slate-300 text-xs px-2 py-1 bg-slate-700 rounded">
            {data.dataType || 'any'}
          </span>
        </div>
      </div>
      
      {/* Input Handle - Receives state updates from actions */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 bg-green-400"
        style={{ top: '50%' }}
      />
    </div>
  );
};

export const StateNode = memo(StateNodeComponent);
