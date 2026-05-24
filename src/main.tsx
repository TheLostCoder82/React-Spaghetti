import React from 'react';
import ReactDOM from 'react-dom/client';
import { WorkspaceProvider } from './store/useWorkspaceStore';
import { WorkspaceShell } from './components/WorkspaceShell';
import './index.css';

/**
 * Main App Component
 * 
 * The root component of the React-Spaghetti IDE application.
 * Wraps the entire application in the WorkspaceProvider for global state management
 * and renders the WorkspaceShell layout.
 */
function App() {
  return (
    <WorkspaceProvider>
      <WorkspaceShell>
        <div className="p-4 text-slate-400">
          <h1 className="text-xl font-bold text-slate-200 mb-2">Welcome to React-Spaghetti IDE</h1>
          <p className="text-sm">
            A visual IDE designed to create React Components using a unified layout tree and logic graph.
          </p>
          <div className="mt-4 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Phase 1: Workspace Shell & Core State Management - Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">⚡</span>
              <span>Phase 2: Visual Layout Canvas & Properties Inspector - In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">○</span>
              <span>Phase 3: Logic Designer Graph Engine - Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">◇</span>
              <span>Phase 4: AST Transpiler & Code Generation Engine - Complete</span>
            </div>
          </div>
        </div>
      </WorkspaceShell>
    </WorkspaceProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
