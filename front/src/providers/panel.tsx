// Libraries
import React, { useState } from 'react';
import { INPUT_PANEL, MAXIMUM, MINIMUM, NETWORK_PANEL, NORMAL, RESULT_PANEL, VISUALIZER_PANEL } from '../utils/basic';

// minimum, normal, maximum

const initial = {
  input_panel: 'normal',
  visualizer_panel: 'normal',
  network_panel: 'normal',
  result_panel: 'normal',
  handlePanel: (name: string, status: string) => {},
}

export const PanelContext = React.createContext(initial);

const PanelContextProvider = ({ children }: any) => {
  const [inputPanel, setInputPanel] = useState('');
  const [visualizePanel, setVisualizePanel] = useState('');
  const [networkPanel, setNetworkPanel] = useState('');
  const [resultPanel, setResultPanel] = useState('');

  const handleMinimize = (panelName: string) => {
    if (panelName === INPUT_PANEL) {
      setInputPanel(MINIMUM);
    }
    if (panelName === VISUALIZER_PANEL) {
      setVisualizePanel(MINIMUM);
      setNetworkPanel(MAXIMUM);
    }
    if (panelName === NETWORK_PANEL) {
      setVisualizePanel(MAXIMUM);
      setNetworkPanel(MINIMUM);
    }
    if (panelName === RESULT_PANEL) {
      setResultPanel(MINIMUM);
    }
  }

  const handleNormalize = (panelName: string) => {
    if (panelName === INPUT_PANEL) {
      setInputPanel(NORMAL);
    }
    if (panelName === VISUALIZER_PANEL || panelName === NETWORK_PANEL) {
      setVisualizePanel(NORMAL);
      setNetworkPanel(NORMAL);
    }
    if (panelName === RESULT_PANEL) {
      setResultPanel(NORMAL);
    }
  }

  const handleMaximuze = (panelName: string) => {
    if (panelName === INPUT_PANEL) {
      setInputPanel(MAXIMUM);
    }
    if (panelName === VISUALIZER_PANEL) {
      setVisualizePanel(MAXIMUM);
      setNetworkPanel(MINIMUM);
    }
    if (panelName === NETWORK_PANEL) {
      setVisualizePanel(MINIMUM);
      setNetworkPanel(MAXIMUM);
    }
    if (panelName === RESULT_PANEL) {
      setResultPanel(MAXIMUM);
    }
  }

  const handlePanelStatus = (panelName: string, status: string) => {
    if (status === MINIMUM) {
      handleMinimize(panelName);
    }
    if (status === NORMAL) {
      handleNormalize(panelName);
    }
    if (status === MAXIMUM) {
      handleMaximuze(panelName);
    }
  }

  return (
    <PanelContext.Provider
      value={{
        input_panel: inputPanel,
        visualizer_panel: visualizePanel,
        network_panel: networkPanel,
        result_panel: resultPanel,
        handlePanel: handlePanelStatus
      }}
    >
      { children }
    </PanelContext.Provider>
  )
}

export { PanelContextProvider };
