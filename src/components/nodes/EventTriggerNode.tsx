/**
 * EventTriggerNode Component
 * 
 * Provides a select menu allowing attachment to events like 'onClick' or 'onChange'.
 */

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export interface EventTriggerNodeData {
  name: string;
  eventType: 'onClick' | 'onChange';
}

const EventTriggerNodeComponent = ({ data }: NodeProps) => {
  return (
    <div className="bg-slate-800 border-2 border-yellow-500 rounded-lg p-3 min-w-[180px] shadow-lg">
      {/* Output Handle - Triggers execution paths */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 bg-yellow-400"
        style={{ top: '50%' }}
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">E</span>
        </div>
        <span className="text-white font-semibold text-sm">Event</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex flex-col">
          <label className="text-slate-400 text-xs mb-1">Name</label>
          <input
            type="text"
            value={data.name || ''}
            readOnly
            className="bg-slate-700 text-white text-sm px-2 py-1 rounded border border-slate-600 focus:outline-none focus:border-yellow-500"
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-slate-400 text-xs mb-1">Event Type</label>
          <select
            value={data.eventType || 'onClick'}
            disabled
            className="bg-slate-700 text-white text-sm px-2 py-1 rounded border border-slate-600 focus:outline-none focus:border-yellow-500"
          >
            <option value="onClick">onClick</option>
            <option value="onChange">onChange</option>
          </select>
        </div>
      </div>
      
      {/* No input handle - Events are triggered by layout interactions */}
    </div>
  );
};

export const EventTriggerNode = memo(EventTriggerNodeComponent);
