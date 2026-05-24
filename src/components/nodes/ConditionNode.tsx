/**
 * ConditionNode Component
 * 
 * Renders a branch decision element exposing True and False outbound terminal connection sockets.
 */

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export interface ConditionNodeData {
  name: string;
  expression: string;
}

const ConditionNodeComponent = ({ data }: NodeProps) => {
  return (
    <div className="bg-slate-800 border-2 border-orange-500 rounded-lg p-3 min-w-[200px] shadow-lg">
      {/* Input Handle - Evaluation requested by event or trigger */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 bg-yellow-400"
        style={{ top: '50%' }}
      />
      
      {/* Output Handle - True branch */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="true"
        className="w-3 h-3 bg-green-400"
        style={{ top: '35%' }}
      />
      
      {/* Output Handle - False branch */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="false"
        className="w-3 h-3 bg-red-400"
        style={{ top: '65%' }}
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">C</span>
        </div>
        <span className="text-white font-semibold text-sm">Condition</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex flex-col">
          <label className="text-slate-400 text-xs mb-1">Name</label>
          <input
            type="text"
            value={data.name || ''}
            readOnly
            className="bg-slate-700 text-white text-sm px-2 py-1 rounded border border-slate-600 focus:outline-none focus:border-orange-500"
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-slate-400 text-xs mb-1">Expression</label>
          <input
            type="text"
            value={data.expression || ''}
            readOnly
            placeholder="e.g., count > 5"
            className="bg-slate-700 text-white text-sm px-2 py-1 rounded border border-slate-600 focus:outline-none focus:border-orange-500 font-mono"
          />
        </div>
        
        <div className="flex gap-2 mt-2 pt-2 border-t border-slate-600">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-green-400 text-xs">True</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <span className="text-red-400 text-xs">False</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ConditionNode = memo(ConditionNodeComponent);
