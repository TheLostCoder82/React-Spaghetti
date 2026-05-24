/**
 * PropNode Component
 * 
 * Renders an interface item demonstrating inbound data typing specifications.
 */

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export interface PropNodeData {
  name: string;
  dataType: 'string' | 'number' | 'boolean' | 'object';
}

const PropNodeComponent = ({ data }: NodeProps) => {
  return (
    <div className="bg-slate-800 border-2 border-purple-500 rounded-lg p-3 min-w-[180px] shadow-lg">
      {/* Output Handle - Provides prop value to expressions */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 bg-purple-400"
        style={{ top: '50%' }}
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">P</span>
        </div>
        <span className="text-white font-semibold text-sm">Prop</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex flex-col">
          <label className="text-slate-400 text-xs mb-1">Name</label>
          <input
            type="text"
            value={data.name || ''}
            readOnly
            className="bg-slate-700 text-white text-sm px-2 py-1 rounded border border-slate-600 focus:outline-none focus:border-purple-500"
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-slate-400 text-xs mb-1">Type</label>
          <span className="text-slate-300 text-xs px-2 py-1 bg-slate-700 rounded">
            {data.dataType || 'any'}
          </span>
        </div>
      </div>
      
      {/* No input handle - Props are read-only inputs */}
    </div>
  );
};

export const PropNode = memo(PropNodeComponent);
