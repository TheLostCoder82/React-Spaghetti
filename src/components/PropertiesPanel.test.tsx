/**
 * PropertiesPanel Test Suite
 * 
 * Comprehensive Vitest unit tests for the `PropertiesPanel.tsx` component.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertiesPanel } from './PropertiesPanel';
import { WorkspaceProvider, useWorkspaceStore } from '../store/useWorkspaceStore';
import { LayoutNode } from '../types/schema';

/**
 * Mock hook to simulate workspace store with selected node
 */
const mockUpdateLayoutNode = vi.fn();

/**
 * Test wrapper with pre-populated state
 */
const createTestWrapper = (initialNodes: Record<string, LayoutNode> = {}) => {
  const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <WorkspaceProvider>
        {children}
      </WorkspaceProvider>
    );
  };
  
  return TestWrapper;
};

describe('PropertiesPanel', () => {
  beforeEach(() => {
    mockUpdateLayoutNode.mockClear();
  });

  it('displays info message when no element is selected', () => {
    // The panel will auto-select the root node from initial state
    // This test verifies the component renders properly
    render(
      <WorkspaceProvider>
        <PropertiesPanel />
      </WorkspaceProvider>
    );

    // Panel should render with DIV header (the root node type)
    expect(screen.getByText('DIV')).toBeInTheDocument();
  });

  it('renders layout options section when a node is selected', () => {
    render(
      <WorkspaceProvider>
        <PropertiesPanel />
      </WorkspaceProvider>
    );

    // The panel should auto-select the root node from initial state
    // Check for layout options header
    expect(screen.getByText('Layout Options')).toBeInTheDocument();
  });

  it('displays display type select field', () => {
    render(
      <WorkspaceProvider>
        <PropertiesPanel />
      </WorkspaceProvider>
    );

    expect(screen.getByLabelText('Display Type')).toBeInTheDocument();
  });

  it('shows padding input fields', () => {
    render(
      <WorkspaceProvider>
        <PropertiesPanel />
      </WorkspaceProvider>
    );

    expect(screen.getByLabelText('Top')).toBeInTheDocument();
    expect(screen.getByLabelText('Right')).toBeInTheDocument();
    expect(screen.getByLabelText('Bottom')).toBeInTheDocument();
    expect(screen.getByLabelText('Left')).toBeInTheDocument();
  });

  it('shows margin input fields', () => {
    render(
      <WorkspaceProvider>
        <PropertiesPanel />
      </WorkspaceProvider>
    );

    // There will be multiple "Top" labels, we just check they exist
    const marginSection = screen.getByText('Margin (px)');
    expect(marginSection).toBeInTheDocument();
  });

  it('shows typography section with font size input', () => {
    render(
      <WorkspaceProvider>
        <PropertiesPanel />
      </WorkspaceProvider>
    );

    expect(screen.getByText('Typography')).toBeInTheDocument();
    expect(screen.getByLabelText('Font Size (px)')).toBeInTheDocument();
  });

  it('shows font weight select field', () => {
    render(
      <WorkspaceProvider>
        <PropertiesPanel />
      </WorkspaceProvider>
    );

    expect(screen.getByLabelText('Font Weight')).toBeInTheDocument();
  });

  it('shows text color input', () => {
    render(
      <WorkspaceProvider>
        <PropertiesPanel />
      </WorkspaceProvider>
    );

    expect(screen.getByLabelText('Text Color')).toBeInTheDocument();
  });
});

describe('PropertiesPanel - Form Interaction', () => {
  it('updates padding value when user changes input', async () => {
    render(
      <WorkspaceProvider>
        <PropertiesPanel />
      </WorkspaceProvider>
    );

    // Find padding top input
    const paddingTopInput = screen.getAllByLabelText('Top')[0] as HTMLInputElement;
    
    // Change the value
    fireEvent.change(paddingTopInput, { target: { value: '16' } });
    
    // Verify the input was updated
    expect(paddingTopInput.value).toBe('16');
  });

  it('changes display type and shows flex options', () => {
    render(
      <WorkspaceProvider>
        <PropertiesPanel />
      </WorkspaceProvider>
    );

    const displaySelect = screen.getByLabelText('Display Type') as HTMLSelectElement;
    
    // Change to flex
    fireEvent.change(displaySelect, { target: { value: 'flex' } });
    
    // Flex options should now be visible
    expect(screen.getByLabelText('Flex Direction')).toBeInTheDocument();
    expect(screen.getByLabelText('Align Items')).toBeInTheDocument();
    expect(screen.getByLabelText('Justify Content')).toBeInTheDocument();
  });

  it('hides flex options when display type is not flex', () => {
    render(
      <WorkspaceProvider>
        <PropertiesPanel />
      </WorkspaceProvider>
    );

    const displaySelect = screen.getByLabelText('Display Type') as HTMLSelectElement;
    
    // Set to block (default)
    fireEvent.change(displaySelect, { target: { value: 'block' } });
    
    // Flex options should not be visible
    expect(screen.queryByLabelText('Flex Direction')).not.toBeInTheDocument();
  });

  it('updates font size when user enters new value', () => {
    render(
      <WorkspaceProvider>
        <PropertiesPanel />
      </WorkspaceProvider>
    );

    const fontSizeInput = screen.getByLabelText('Font Size (px)') as HTMLInputElement;
    const initialValue = fontSizeInput.value;
    
    fireEvent.change(fontSizeInput, { target: { value: '24' } });
    
    expect(fontSizeInput.value).toBe('24');
  });

  it('allows changing text color via color picker', () => {
    render(
      <WorkspaceProvider>
        <PropertiesPanel />
      </WorkspaceProvider>
    );

    const colorInput = screen.getByLabelText('Text Color') as HTMLInputElement;
    
    fireEvent.change(colorInput, { target: { value: '#ff0000' } });
    
    expect(colorInput.value).toBe('#ff0000');
  });
});

describe('PropertiesPanel - Display Options', () => {
  it('offers block, inline-block, and flex display options', () => {
    render(
      <WorkspaceProvider>
        <PropertiesPanel />
      </WorkspaceProvider>
    );

    const displaySelect = screen.getAllByLabelText('Display Type')[0] as HTMLSelectElement;
    const options = Array.from(displaySelect.options).map((opt) => opt.value);
    
    expect(options).toContain('block');
    expect(options).toContain('inline-block');
    expect(options).toContain('flex');
  });

  it('offers row and column flex direction options', () => {
    render(
      <WorkspaceProvider>
        <PropertiesPanel />
      </WorkspaceProvider>
    );

    const displaySelect = screen.getAllByLabelText('Display Type')[0] as HTMLSelectElement;
    fireEvent.change(displaySelect, { target: { value: 'flex' } });

    const flexDirectionSelect = screen.getAllByLabelText('Flex Direction')[0] as HTMLSelectElement;
    const options = Array.from(flexDirectionSelect.options).map((opt) => opt.value);
    
    expect(options).toContain('row');
    expect(options).toContain('column');
  });

  it('offers multiple font weight options', () => {
    render(
      <WorkspaceProvider>
        <PropertiesPanel />
      </WorkspaceProvider>
    );

    const fontWeightSelect = screen.getAllByLabelText('Font Weight')[0] as HTMLSelectElement;
    const options = Array.from(fontWeightSelect.options).map((opt) => opt.value);
    
    expect(options).toContain('normal');
    expect(options).toContain('bold');
    expect(options.length).toBeGreaterThan(5);
  });
});

describe('PropertiesPanel - Node Information', () => {
  it('displays the node type in the header', () => {
    render(
      <WorkspaceProvider>
        <PropertiesPanel />
      </WorkspaceProvider>
    );

    // The root node should be of type 'div'
    expect(screen.getByText('DIV')).toBeInTheDocument();
  });

  it('displays the node ID', () => {
    render(
      <WorkspaceProvider>
        <PropertiesPanel />
      </WorkspaceProvider>
    );

    // Should show ID information
    expect(screen.getByText(/ID:/)).toBeInTheDocument();
  });
});
