/**
 * Properties Panel Component
 * 
 * Implements the interactive Right Properties configuration view, binding UI inputs
 * to CSS properties like flexbox, dimensions, typography, and color schemes.
 */

import React, { useState, useEffect } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { LayoutNode } from '../types/schema';

/**
 * Properties Panel Props
 */
interface PropertiesPanelProps {
  className?: string;
}

/**
 * Form state interface for layout properties
 */
interface LayoutFormState {
  display: string;
  flexDirection: string;
  alignItems: string;
  justifyContent: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  fontSize: string;
  fontWeight: string;
  textColor: string;
}

/**
 * Default form values
 */
const defaultFormState: LayoutFormState = {
  display: 'block',
  flexDirection: 'row',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  paddingTop: '0',
  paddingRight: '0',
  paddingBottom: '0',
  paddingLeft: '0',
  marginTop: '0',
  marginRight: '0',
  marginBottom: '0',
  marginLeft: '0',
  fontSize: '14',
  fontWeight: 'normal',
  textColor: '#e2e8f0',
};

/**
 * Extract style values from LayoutNode
 */
const extractFormStateFromNode = (node: LayoutNode): LayoutFormState => {
  const styles = node.styles || {};
  
  // Parse padding values
  const padding = styles.padding || '0';
  const paddingParts = padding.split(' ').map(p => p.replace(/px/g, '') || '0');
  
  // Parse margin values
  const margin = styles.margin || '0';
  const marginParts = margin.split(' ').map(m => m.replace(/px/g, '') || '0');

  return {
    display: styles.display || 'block',
    flexDirection: styles.flexDirection || 'row',
    alignItems: styles.alignItems || 'stretch',
    justifyContent: styles.justifyContent || 'flex-start',
    paddingTop: paddingParts[0] || '0',
    paddingRight: paddingParts[1] || paddingParts[0] || '0',
    paddingBottom: paddingParts[2] || paddingParts[0] || '0',
    paddingLeft: paddingParts[3] || paddingParts[1] || paddingParts[0] || '0',
    marginTop: marginParts[0] || '0',
    marginRight: marginParts[1] || marginParts[0] || '0',
    marginBottom: marginParts[2] || marginParts[0] || '0',
    marginLeft: marginParts[3] || marginParts[1] || marginParts[0] || '0',
    fontSize: styles.fontSize?.replace('px', '') || '14',
    fontWeight: styles.fontWeight || 'normal',
    textColor: styles.color || '#e2e8f0',
  };
};

/**
 * Convert form state back to style object
 */
const formStateToStyles = (formState: LayoutFormState): Record<string, string> => {
  const styles: Record<string, string> = {};

  styles.display = formState.display;
  
  if (formState.display === 'flex') {
    styles.flexDirection = formState.flexDirection;
    styles.alignItems = formState.alignItems;
    styles.justifyContent = formState.justifyContent;
  }

  // Construct padding string
  const paddingValues = [
    formState.paddingTop,
    formState.paddingRight,
    formState.paddingBottom,
    formState.paddingLeft,
  ];
  const uniquePadding = [...new Set(paddingValues)];
  if (uniquePadding.length === 1) {
    styles.padding = `${paddingValues[0]}px`;
  } else {
    styles.padding = paddingValues.map(v => `${v}px`).join(' ');
  }

  // Construct margin string
  const marginValues = [
    formState.marginTop,
    formState.marginRight,
    formState.marginBottom,
    formState.marginLeft,
  ];
  const uniqueMargin = [...new Set(marginValues)];
  if (uniqueMargin.length === 1) {
    styles.margin = `${marginValues[0]}px`;
  } else {
    styles.margin = marginValues.map(v => `${v}px`).join(' ');
  }

  styles.fontSize = `${formState.fontSize}px`;
  styles.fontWeight = formState.fontWeight;
  styles.color = formState.textColor;

  return styles;
};

/**
 * Input Field Component
 */
const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  min?: string;
  step?: string;
}> = ({ label, value, onChange, type = 'text', min, step }) => (
  <div className="mb-3">
    <label className="block text-xs text-slate-400 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      min={min}
      step={step}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
    />
  </div>
);

/**
 * Select Field Component
 */
const SelectField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}> = ({ label, value, onChange, options }) => (
  <div className="mb-3">
    <label className="block text-xs text-slate-400 mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

/**
 * Section Header Component
 */
const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-700 pb-2 mb-3">
    {title}
  </h3>
);

/**
 * PropertiesPanel Component
 * 
 * Displays an organized form to manipulate layout, spacing, and typography properties
 */
export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ className = '' }) => {
  const { state: workspaceState, updateLayoutNode } = useWorkspaceStore();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [formState, setFormState] = useState<LayoutFormState>(defaultFormState);

  // Find selected node from workspace state
  const selectedNode = selectedNodeId ? workspaceState.layoutTree.nodes[selectedNodeId] : null;

  // Update form state when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setFormState(extractFormStateFromNode(selectedNode));
    }
  }, [selectedNode]);

  // Handle form field changes
  const handleFieldChange = (field: keyof LayoutFormState, value: string) => {
    const newFormState = { ...formState, [field]: value };
    setFormState(newFormState);

    if (selectedNodeId) {
      const newStyles = formStateToStyles(newFormState);
      updateLayoutNode(selectedNodeId, { styles: newStyles });
    }
  };

  // For demonstration, we'll auto-select the first node if available
  // In a real implementation, this would come from a selection mechanism
  useEffect(() => {
    const nodeIds = Object.keys(workspaceState.layoutTree.nodes);
    if (nodeIds.length > 0 && !selectedNodeId) {
      setSelectedNodeId(nodeIds[0]);
    }
  }, [workspaceState.layoutTree.nodes, selectedNodeId]);

  // If no element is selected, display info state
  if (!selectedNode) {
    return (
      <div className={`w-full h-full bg-slate-800 border-l border-slate-700 p-4 ${className}`}>
        <div className="flex items-center justify-center h-full text-slate-400 text-sm">
          Select a visual node element on the canvas to configure properties
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full bg-slate-800 border-l border-slate-700 overflow-y-auto ${className}`}>
      <div className="p-4">
        {/* Node Info */}
        <div className="mb-4 pb-3 border-b border-slate-700">
          <h2 className="text-base font-semibold text-slate-100">
            {selectedNode.type.toUpperCase()}
          </h2>
          <p className="text-xs text-slate-400 mt-1">ID: {selectedNode.id}</p>
        </div>

        {/* Layout Options */}
        <SectionHeader title="Layout Options" />
        <SelectField
          label="Display Type"
          value={formState.display}
          onChange={(v) => handleFieldChange('display', v)}
          options={[
            { value: 'block', label: 'Block' },
            { value: 'inline-block', label: 'Inline Block' },
            { value: 'flex', label: 'Flex' },
          ]}
        />

        {formState.display === 'flex' && (
          <>
            <SelectField
              label="Flex Direction"
              value={formState.flexDirection}
              onChange={(v) => handleFieldChange('flexDirection', v)}
              options={[
                { value: 'row', label: 'Row' },
                { value: 'column', label: 'Column' },
                { value: 'row-reverse', label: 'Row Reverse' },
                { value: 'column-reverse', label: 'Column Reverse' },
              ]}
            />
            <SelectField
              label="Align Items"
              value={formState.alignItems}
              onChange={(v) => handleFieldChange('alignItems', v)}
              options={[
                { value: 'stretch', label: 'Stretch' },
                { value: 'flex-start', label: 'Flex Start' },
                { value: 'flex-end', label: 'Flex End' },
                { value: 'center', label: 'Center' },
                { value: 'baseline', label: 'Baseline' },
              ]}
            />
            <SelectField
              label="Justify Content"
              value={formState.justifyContent}
              onChange={(v) => handleFieldChange('justifyContent', v)}
              options={[
                { value: 'flex-start', label: 'Flex Start' },
                { value: 'flex-end', label: 'Flex End' },
                { value: 'center', label: 'Center' },
                { value: 'space-between', label: 'Space Between' },
                { value: 'space-around', label: 'Space Around' },
                { value: 'space-evenly', label: 'Space Evenly' },
              ]}
            />
          </>
        )}

        {/* Spacing - Padding */}
        <SectionHeader title="Padding (px)" />
        <div className="grid grid-cols-2 gap-2 mb-3">
          <InputField
            label="Top"
            value={formState.paddingTop}
            onChange={(v) => handleFieldChange('paddingTop', v)}
            type="number"
            min="0"
          />
          <InputField
            label="Right"
            value={formState.paddingRight}
            onChange={(v) => handleFieldChange('paddingRight', v)}
            type="number"
            min="0"
          />
          <InputField
            label="Bottom"
            value={formState.paddingBottom}
            onChange={(v) => handleFieldChange('paddingBottom', v)}
            type="number"
            min="0"
          />
          <InputField
            label="Left"
            value={formState.paddingLeft}
            onChange={(v) => handleFieldChange('paddingLeft', v)}
            type="number"
            min="0"
          />
        </div>

        {/* Spacing - Margin */}
        <SectionHeader title="Margin (px)" />
        <div className="grid grid-cols-2 gap-2 mb-3">
          <InputField
            label="Top"
            value={formState.marginTop}
            onChange={(v) => handleFieldChange('marginTop', v)}
            type="number"
            min="0"
          />
          <InputField
            label="Right"
            value={formState.marginRight}
            onChange={(v) => handleFieldChange('marginRight', v)}
            type="number"
            min="0"
          />
          <InputField
            label="Bottom"
            value={formState.marginBottom}
            onChange={(v) => handleFieldChange('marginBottom', v)}
            type="number"
            min="0"
          />
          <InputField
            label="Left"
            value={formState.marginLeft}
            onChange={(v) => handleFieldChange('marginLeft', v)}
            type="number"
            min="0"
          />
        </div>

        {/* Typography */}
        <SectionHeader title="Typography" />
        <InputField
          label="Font Size (px)"
          value={formState.fontSize}
          onChange={(v) => handleFieldChange('fontSize', v)}
          type="number"
          min="8"
          step="1"
        />
        <SelectField
          label="Font Weight"
          value={formState.fontWeight}
          onChange={(v) => handleFieldChange('fontWeight', v)}
          options={[
            { value: 'normal', label: 'Normal' },
            { value: 'bold', label: 'Bold' },
            { value: '100', label: 'Thin (100)' },
            { value: '200', label: 'Extra Light (200)' },
            { value: '300', label: 'Light (300)' },
            { value: '400', label: 'Regular (400)' },
            { value: '500', label: 'Medium (500)' },
            { value: '600', label: 'Semi Bold (600)' },
            { value: '700', label: 'Bold (700)' },
            { value: '800', label: 'Extra Bold (800)' },
            { value: '900', label: 'Black (900)' },
          ]}
        />
        <div className="mb-3">
          <label className="block text-xs text-slate-400 mb-1">Text Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={formState.textColor}
              onChange={(e) => handleFieldChange('textColor', e.target.value)}
              className="w-8 h-8 rounded border border-slate-600 cursor-pointer"
            />
            <input
              type="text"
              value={formState.textColor}
              onChange={(e) => handleFieldChange('textColor', e.target.value)}
              className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
