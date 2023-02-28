/* eslint-disable no-new-func */
/* eslint-disable no-eval */
import { useState, useEffect } from 'react';

export function round(x, decimals) {
  if (typeof x == 'string') {
    return x;
  }
  return x.toFixed(decimals);
}

export function importAll(r) {
  return r.keys().map(r);
}

export function strToNum(str) {
  let matches = str.match(/\d+/g);
  let value = str;

  if (matches && matches.length > 0)
    matches.forEach(item => {
      value = str.replace(item, Number(item).toLocaleString('en-US'));
    });

  return value;
}

export function addComma(str) {
  if (str.toString().includes('.')) {
    let value = str.toString().replace(/^([^.]*\.)(.*)$/, function (a, b, c) {
      return b + c.replace(/\./g, "");
    });

    let str1 = value.split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    let str2 = value.split('.')[1];

    return str1 + '.' + str2;
  } else {
    let value = str.toString().split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return value;
  }
}

export function parseComma(str) {
  return str.toString().replace(/,/g, '');
  //return str.toString().replace(/,/g, "").replace(/[^0-9\.]/g, "");
}

export function formatDate(value, delta) {
  if (!value)
    return '';

  let sDate = Math.floor(value - 25569) * 86400;
  let lDate = new Date(sDate * 1000);
  let d = lDate.getDate();
  let dd = d < 10 ? '0' + d : d;
  let yyyy = lDate.getFullYear();
  let mon = eval(lDate.getMonth() + 1);
  let mm = (mon < 10 ? '0' + mon : mon);

  return yyyy + delta + '-' + mm + '-' + dd;
}

export function getLevel(params, itemVal) {
  let level;

  Object.keys(params).forEach(el => {
    if (!level) {
      switch (el) {
        case 'altitude':
          level = itemVal === "altitudeCheck" ? params[el] : null;
          break;
        case 'availabilityThreshold':
          level = itemVal === "availability" ? params[el] * 100 : null;
          break;
        case 'dataVolumeNeed':
          level = itemVal === "data_volume" ? params[el] : null;
          break;
        case 'gapThreshold':
          level = itemVal === "average_gap" ? params[el] : null;
          break;
        case 'navAccuracyNeed':
          level = itemVal === "trackingCapability" ? params[el] : null;
          break;
        case 'launchYear':
          level = itemVal === "systemIOCTime" ? params[el] : null;
          break;
        case 'userEIRP':
          level = itemVal === "userEIRP" ? params[el] : null;
          break;

        default:
          break;
      }
    }
  });

  return level;
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

export function deserializeEquations(eqns) {
  const serializedEqns = {};

  for (let key in eqns) {
    serializedEqns[key] = {};
    for (let metric in eqns[key]) {
      serializedEqns[key][metric] = new Function('return ' + eqns[key][metric])();
    }
  }

  return serializedEqns;
}