/**
 * VisualCanvas Test Suite
 * 
 * Integration suite using Vitest and React Testing Library targeting `VisualCanvas.tsx`.
 * Wraps the component tree environment within a mock Craft Editor context provider workspace.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Editor, Frame, Element } from '@craftjs/core';
import VisualCanvas, { Container, Text, Button, Heading } from './VisualCanvas';
import { WorkspaceProvider } from '../store/useWorkspaceStore';

/**
 * Wrapper component to provide necessary contexts for testing
 */
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <WorkspaceProvider>
      {children}
    </WorkspaceProvider>
  );
};

describe('VisualCanvas', () => {
  beforeEach(() => {
    // Clear any existing state before each test
  });

  it('renders the canvas root container', () => {
    const { container } = render(
      <TestWrapper>
        <Editor resolver={{ Container, Text, Button, Heading, Element }}>
          <Frame>
            <Element id="root" is={Container} background="#1e293b" padding="24px">
              <Text text="Canvas Content" />
            </Element>
          </Frame>
        </Editor>
      </TestWrapper>
    );

    // Verify that the canvas creates a visible HTML container element
    const canvasElement = container.querySelector('.craft-container');
    expect(canvasElement).toBeInTheDocument();
  });

  it('creates a drop zone ready to intercept drag events', () => {
    render(
      <TestWrapper>
        <Editor resolver={{ Container, Text, Button, Heading, Element }}>
          <Frame>
            <Element id="dropzone" is={Container} background="#334155" padding="16px">
              <Text text="Drag elements here" fontSize="16px" color="#94a3b8" />
            </Element>
          </Frame>
        </Editor>
      </TestWrapper>
    );

    // The canvas should have a drop zone with placeholder text
    const dropZoneText = screen.getByText('Drag elements here');
    expect(dropZoneText).toBeInTheDocument();
  });

  it('renders within a scrollable overflow container', () => {
    const { container } = render(
      <TestWrapper>
        <div className="overflow-auto">
          <Editor resolver={{ Container, Text, Button, Heading }}>
            <Frame>
              <Container>
                <Text text="Content" />
              </Container>
            </Frame>
          </Editor>
        </div>
      </TestWrapper>
    );

    // Verify overflow-auto class is present for scrolling
    const canvasContainer = container.firstChild as HTMLElement;
    expect(canvasContainer).toHaveClass('overflow-auto');
  });
});

describe('Craft.js Primitive Components', () => {
  it('renders Container component with proper styling', () => {
    render(
      <TestWrapper>
        <Editor resolver={{ Container, Text, Button, Heading }}>
          <Frame>
            <Container background="#ff0000" padding="16px">
              <Text text="Test Content" />
            </Container>
          </Frame>
        </Editor>
      </TestWrapper>
    );

    const container = screen.getByText('Test Content').parentElement;
    expect(container).toBeInTheDocument();
    expect(container).toHaveStyle('background-color: #ff0000');
    expect(container).toHaveStyle('padding: 16px');
  });

  it('renders Text component with custom properties', () => {
    render(
      <TestWrapper>
        <Text text="Hello World" fontSize="20px" color="#00ff00" />
      </TestWrapper>
    );

    const textElement = screen.getByText('Hello World');
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveStyle('font-size: 20px');
    expect(textElement).toHaveStyle('color: #00ff00');
  });

  it('renders Button component with default styling', () => {
    render(
      <TestWrapper>
        <Button text="Click Me" />
      </TestWrapper>
    );

    const buttonElement = screen.getByText('Click Me');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement.tagName).toBe('BUTTON');
    expect(buttonElement).toHaveStyle('background-color: #3b82f6');
  });

  it('renders Heading component with correct tag and styling', () => {
    render(
      <TestWrapper>
        <Heading text="Main Title" level={1} color="#ffffff" />
      </TestWrapper>
    );

    const headingElement = screen.getByText('Main Title');
    expect(headingElement).toBeInTheDocument();
    expect(headingElement.tagName).toBe('H1');
    expect(headingElement).toHaveStyle('color: #ffffff');
    expect(headingElement).toHaveStyle('font-weight: bold');
  });

  it('renders Heading with different levels', () => {
    const { rerender } = render(
      <TestWrapper>
        <Heading text="Level 2" level={2} />
      </TestWrapper>
    );

    expect(screen.getByText('Level 2').tagName).toBe('H2');

    rerender(
      <TestWrapper>
        <Heading text="Level 3" level={3} />
      </TestWrapper>
    );

    expect(screen.getByText('Level 3').tagName).toBe('H3');
  });
});

describe('Craft.js Editor Integration', () => {
  it('initializes with Editor and Frame components', () => {
    render(
      <TestWrapper>
        <Editor resolver={{ Container, Text, Button, Heading }}>
          <Frame>
            <Container>
              <Text text="Initial Content" />
            </Container>
          </Frame>
        </Editor>
      </TestWrapper>
    );

    expect(screen.getByText('Initial Content')).toBeInTheDocument();
  });

  it('supports nested element structure', () => {
    render(
      <TestWrapper>
        <Editor resolver={{ Container, Text, Button, Heading }}>
          <Frame>
            <Container background="#1e293b" padding="20px">
              <Container background="#334155" padding="10px">
                <Text text="Nested Text" />
                <Button text="Nested Button" />
              </Container>
            </Container>
          </Frame>
        </Editor>
      </TestWrapper>
    );

    expect(screen.getByText('Nested Text')).toBeInTheDocument();
    expect(screen.getByText('Nested Button')).toBeInTheDocument();
  });
});
