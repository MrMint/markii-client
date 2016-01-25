import React from 'react';

// Exported from redux-devtools
import { createDevTools } from 'redux-devtools';

// Monitors are separate packages, and you can make a custom one
import FilterableLogMonitor from 'redux-devtools-filterable-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

const DevTools = createDevTools(
  <DockMonitor
    toggleVisibilityKey="ctrl-h"
    changePositionKey="ctrl-q"
  >
    <FilterableLogMonitor />
  </DockMonitor>
);

export default DevTools;
