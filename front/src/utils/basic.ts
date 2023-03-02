export const HEADER = 'header';
export const SIDE_MENU = 'side_menu';
export const INPUT_PANEL = 'input';
export const MAIN_PANEL = 'main';
export const VISUALIZER_PANEL = 'visualizer';
export const NETWORK_PANEL = 'network';
export const RESULT_PANEL = 'result';
export const TAB_MENU = 'tab_menu';

export const MINIMUM = 'minimum';
export const NORMAL = 'normal';
export const MAXIMUM = 'maximum';

export const PANEL_RATIO = {
  // width: 100% of screen width
  [HEADER]: {
    width: 100,
    height: 10
  },
  // width: 100% of screen width
  // height: 90% of screen height
    [SIDE_MENU]: {
      width: 4,
    },
    [INPUT_PANEL]: {
      width: 25,
      minimized_width: 0,
    },
    [MAIN_PANEL]: { // main panel includes visualizer and network panels
      width: 44,
    },
      [VISUALIZER_PANEL]: {
        // width: 100% of main panel
        height: 5 / 9,
        minimized_height: 1 / 9,
        maximuzed_height: 8 / 9
      },
      [NETWORK_PANEL]: {
        // width: 100% of main panel
        height: 4 / 9,
        minimized_height: 1 / 9,
        maximuzed_height: 8 / 9
      },
    [RESULT_PANEL]: {
      width: 25,
      minimized_width: 0,
    },
    [TAB_MENU]: {
      width: 2,
    }
}

export const ratio_list = [
  {
    ratio: '4:3',
    value: 4 / 3,
    supported: true,
  },
  {
    ratio: '5:4',
    value: 1.25,
    supported: false,
  },
  {
    ratio: '3:2',
    value: 1.5,
    supported: false,
  },
  {
    ratio: '16:10',
    value: 1.6,
    supported: false,
  },
  {
    ratio: '16:9',
    value: 16 / 9,
    supported: true,
  },
  {
    ratio: '19:9',
    value: 19 / 9,
    supported: false,
  },
  {
    ratio: '21:9',
    value: 21 / 9,
    supported: false,
  },
  {
    ratio: '32:9',
    value: 32 / 9,
    supported: false,
  },
  {
    ratio: '1:1',
    value: 1,
    supported: false,
  },
  {
    ratio: '4:1',
    value: 4,
    supported: false,
  },
]
