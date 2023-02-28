/* eslint-disable react-hooks/rules-of-hooks */
// import { IconButton, Tooltip } from '@material-ui/core';
// import { GetApp } from '@material-ui/icons';
// import React from 'react';
import useStyles from '../../../utils/styles';

export const renderToolbar = (toolbarSlot) => {
  const classes = useStyles();
  return (
    <div
        style={{
          alignItems: 'center',
          display: 'flex',
          width: '100%'
        }}
      >
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <div style={{ padding: '0 5px' }}>
            <b>Page Count:</b> {toolbarSlot.numPages}
          </div>
        </div>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flexGrow: 1,
            flexShrink: 1,
            justifyContent: 'center',
          }}
        >
          <div style={{ padding: '0 5px' }}>
            {toolbarSlot.zoomOutButton}
          </div>
          <div style={{ padding: '0 5px' }}>
            {toolbarSlot.zoomPopover}
          </div>
          <div style={{ padding: '0 5px' }}>
            {toolbarSlot.zoomInButton}
          </div>
        </div>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            marginLeft: 'auto',
          }}
        >
          <div style={{ padding: '0 5px' }}>
            {toolbarSlot.downloadButton}
          </div>
        </div>
      </div>
  );
};

function Layout(isSidebarOpened, container, main, toolbar, sidebar) {
  return (
    <div
        style={{
          border: '1px solid rgba(0, 0, 0, .3)',
          display: 'grid',
          gridTemplateAreas: "'toolbar toolbar' 'sidebar main'",
          gridTemplateColumns: '0% 1fr',
          gridTemplateRows: '40px calc(100% - 40px)',
          height: '100%',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <div
          style={{
            alignItems: 'center',
            backgroundColor: '#EEE',
            borderBottom: '1px solid rgba(0, 0, 0, .1)',
            display: 'flex',
            gridArea: 'toolbar',
            justifyContent: 'center',
            padding: '4px',
          }}
        >
          {toolbar(renderToolbar)}
        </div>
        <div
          style={{
            borderRight: '1px solid rgba(0, 0, 0, 0.2)',
            display: 'flex',
            gridArea: 'sidebar',
            justifyContent: 'center',
          }}
        >
          {sidebar.children}
        </div>
        <div
          {...main.attrs}
          style={Object.assign({}, {
            gridArea: 'main',
            overflow: 'scroll',
          }, main.attrs.style)}
        >
          {main.children}
        </div>
      </div>
  );
}

export default Layout;
