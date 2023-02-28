import { STANDARDS_MAPPING } from 'src/utils/constants/network-library';

var stdsToMaskMap = null,
  stdsFromMaskMap = null;

export function convertStandardsToInt(standards: string[]) {
  let standards_num = 0;
  let stdsmap = getStandardsToMaskMap();
  standards.forEach((s) => {
    let stdVal = stdsmap.get(s);
    if (stdVal == null) throw Error(`Standard ${s} does not exist in CART.`);
    standards_num = standards_num | stdVal;
  });
  return standards_num;
}

export function convertIntToStandards(std_num: number) {
  //js numbers are signed...careful!
  let standards: string[] = [];
  let stdsmap = getStandardsFromMaskMap();
  let index = 1;
  let safe_index = std_num;
  while (safe_index > 0) {
    let val = std_num & index;
    if (val !== 0) {
      let stdMask = stdsmap.get(val);
      if (stdMask == null)
        throw Error(`Standard mask ${val} does not exist in CART.`);
      standards.push(stdMask);
    }
    safe_index = safe_index - index;
    index = index * 2;
  }
  return standards;
}

/**
 * convert single string standard to int
 * @param std_str a single standard!
 */
export function convertSingleStandardToInt(std_str: string) {
  return getStandardsToMaskMap().get(std_str);
}

export function convertSingleIntToStandard(std_int: number) {
  return getStandardsFromMaskMap().get(std_int);
}

export function getStandardsToMaskMap(refresh = false) {
  if (!stdsToMaskMap || refresh) {
    let newmap = new Map<string, number>();
    STANDARDS_MAPPING.forEach((s) => {
      newmap.set(s.name, s.mask);
    });
    stdsToMaskMap = newmap;
  }
  return stdsToMaskMap;
}

export function getStandardsFromMaskMap(refresh = false) {
  if (!stdsFromMaskMap || refresh) {
    let newmap = new Map<number, string>();
    STANDARDS_MAPPING.forEach((s) => {
      newmap.set(s.mask, s.name);
    });
    stdsFromMaskMap = newmap;
  }
  return stdsFromMaskMap;
}
