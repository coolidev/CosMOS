type link = (x: number) => number;

let cloglog: link = function(x: number) {
  return 1 - Math.exp(-Math.exp(x));
}

let cauchit: link = function(x: number) {
  return 0.5 + Math.atan(x)/Math.PI;
}

let loglog: link = function(x: number) {
  return Math.exp(-Math.exp(-x));
}

function soft_threshold(alt: number, reg_value: number, def_value: number, lower: number, upper: number) {
  if (alt < lower) {
    return def_value;
  } else if (alt < upper) {
    let t = (alt - lower)/(upper - lower);
    return t * reg_value + (1 - t) * def_value;
  } else {
    return reg_value;
  }
}

function affine_threshold(alt: number, inc: number, reg_value: number, def_value: number, 
                          lower_slope: number, upper_slope: number, intercept: number) {
  let lower = intercept - lower_slope * alt;
  let upper = intercept - upper_slope * alt;
  if (inc < lower) {
    return def_value;
  } else if (inc < upper) {
    let m = (intercept - inc)/alt;
    let t = (m - upper_slope)/(lower_slope - upper_slope);
    return (1-t) * reg_value + t * def_value;
  } else {
    return reg_value;
  }
}

export const EQUATIONS: { [key: string]: { [key: string]: (coefs: number[], alt: number, inc: number) => number } } = {
    'Viasat3': {
      'coverage': (coefs: number[], alt: number, inc: number) => { return 100 * Math.exp((coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)) }, 
      'availability': (coefs: number[], alt: number, inc: number) => { return 100 * Math.exp((coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)) },
      'average_gap': (coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
      'reduced_coverage': (coefs: number[], alt: number, inc: number) => { return 100 * Math.exp((coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)) },
      'slew_rate': (coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
      'tracking_rate': (coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
      'mean_response_time': (coefs: number[], alt: number, inc: number) => soft_threshold(alt,
                                                                                      coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc,
                                                                                      0,
                                                                                      coefs[4],
                                                                                      coefs[5]),
      'mean_coverage_duration': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
      'mean_contacts': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
      'max_gap': (coefs: number[], alt: number, inc: number) => soft_threshold(alt,
                                                                                          coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc,
                                                                                          0,
                                                                                          coefs[4],
                                                                                          coefs[5]),
    },
    'SpaceX 1110': {
      'coverage': (coefs: number[], alt: number, inc: number) => { return 100 * loglog(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
      'availability': (coefs: number[], alt: number, inc: number) => { return 100 * loglog(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
      'average_gap': (coefs: number[], alt: number, inc: number) => { return Math.max(0, 1 / (coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)) },
      'reduced_coverage': (coefs: number[], alt: number, inc: number) => { return 100 * loglog(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
      'slew_rate': (coefs: number[], alt: number, inc: number) => { return coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*alt + coefs[4]*alt*inc + coefs[5]*alt*alt*inc },
      'tracking_rate': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
      'mean_response_time': (coefs: number[], alt: number, inc: number) => {return Math.max(0, 1 / (coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc))},
      'mean_coverage_duration': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
      'mean_contacts':(coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*alt + coefs[4]*alt*inc + coefs[5]*alt*alt*inc) },
      'max_gap': (coefs: number[], alt: number, inc: number) => { return Math.max(0, 1 / (coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc))},
    },
    'O3b 7MPower': {
      'coverage': (coefs: number[], alt: number, inc: number) => affine_threshold(alt, inc,
                                                                                  100 / (Math.exp(-(coefs[0] + coefs[1]*alt + coefs[2]*(1-Math.exp(-inc/45)) + coefs[3]*alt*(1-Math.exp(-inc/45)))) + 1),
                                                                                  100,
                                                                                  coefs[4], coefs[5], coefs[6]),
      'availability': (coefs: number[], alt: number, inc: number) => affine_threshold(alt, inc,
        100 / (Math.exp(-(coefs[0] + coefs[1]*alt + coefs[2]*(1-Math.exp(-inc/45)) + coefs[3]*alt*(1-Math.exp(-inc/45)))) + 1),
        100, coefs[4], coefs[5], coefs[6]),
      'average_gap': (coefs: number[], alt: number, inc: number) => affine_threshold(alt, inc,
                                                                                     Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc),
                                                                                     0,
                                                                                     coefs[4], coefs[5], coefs[6]),
      'reduced_coverage': (coefs: number[], alt: number, inc: number) => affine_threshold(alt, inc,
                                                                                            100 / (Math.exp(-(coefs[0] + coefs[1]*alt + coefs[2]*(1-Math.exp(-inc/45)) + coefs[3]*alt*(1-Math.exp(-inc/45)))) + 1),
                                                                                            100,
                                                                                            coefs[4], coefs[5], coefs[6]),
      'slew_rate': (coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
      'tracking_rate': (coefs: number[], alt: number, inc: number) => { return coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*alt + coefs[4]*alt*inc + coefs[5]*alt*alt*inc },
      'mean_response_time': (coefs: number[], alt: number, inc: number) => affine_threshold(alt, inc,
                                                                                              Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc),
                                                                                              0,
                                                                                              coefs[4], coefs[5], coefs[6]),
      'mean_coverage_duration': (coefs: number[], alt: number, inc: number) => affine_threshold(alt, inc,
                                                                                                64800 / (Math.exp(-(coefs[0] + coefs[1]*alt + coefs[2]*(1-Math.exp(-inc/45)) + coefs[3]*alt*(1-Math.exp(-inc/45)))) + 1),
                                                                                                64800,
                                                                                                coefs[4], coefs[5], coefs[6]),
      'mean_contacts':(coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*alt + coefs[4]*alt*inc + coefs[5]*alt*alt*inc) },
      'max_gap': (coefs: number[], alt: number, inc: number) => affine_threshold(alt, inc,
                                                                                                    Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc),
                                                                                                    0,
                                                                                                    coefs[4], coefs[5], coefs[6]),
    },
    'O3B Legacy': {
      'coverage': (coefs: number[], alt: number, inc: number) => affine_threshold(alt, inc,
        100 / (Math.exp(-(coefs[0] + coefs[1]*alt + coefs[2]*(1-Math.exp(-inc/45)) + coefs[3]*alt*(1-Math.exp(-inc/45)))) + 1),
        100, coefs[4], coefs[5], coefs[6]),                                                                              
      'average_gap': (coefs: number[], alt: number, inc: number) => affine_threshold(alt, inc,
                                                                                     Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc),
                                                                                     0,
                                                                                     coefs[4], coefs[5], coefs[6]),
      'reduced_coverage': (coefs: number[], alt: number, inc: number) => affine_threshold(alt, inc,
                                                                                            100 / (Math.exp(-(coefs[0] + coefs[1]*alt + coefs[2]*(1-Math.exp(-inc/45)) + coefs[3]*alt*(1-Math.exp(-inc/45)))) + 1),
                                                                                            100,
                                                                                            coefs[4], coefs[5], coefs[6]),
      'slew_rate': (coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
      'tracking_rate': (coefs: number[], alt: number, inc: number) => { return coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*alt + coefs[4]*alt*inc + coefs[5]*alt*alt*inc },
      'mean_response_time': (coefs: number[], alt: number, inc: number) => affine_threshold(alt, inc,
                                                                                              Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc),
                                                                                              0,
                                                                                              coefs[4], coefs[5], coefs[6]),
      'mean_coverage_duration': (coefs: number[], alt: number, inc: number) => affine_threshold(alt, inc,
                                                                                                64800 / (Math.exp(-(coefs[0] + coefs[1]*alt + coefs[2]*(1-Math.exp(-inc/45)) + coefs[3]*alt*(1-Math.exp(-inc/45)))) + 1),
                                                                                                64800,
                                                                                                coefs[4], coefs[5], coefs[6]),
      'mean_contacts':(coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*alt + coefs[4]*alt*inc + coefs[5]*alt*alt*inc) },
      'max_gap': (coefs: number[], alt: number, inc: number) => affine_threshold(alt, inc,
                                                                                                Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc),
                                                                                                0,
                                                                                                coefs[4], coefs[5], coefs[6]),                                                                                          
      'availability': (coefs: number[], alt: number, inc: number) => affine_threshold(alt, inc,
        100 / (Math.exp(-(coefs[0] + coefs[1]*alt + coefs[2]*(1-Math.exp(-inc/45)) + coefs[3]*alt*(1-Math.exp(-inc/45)))) + 1),
        100, coefs[4], coefs[5], coefs[6])
    },
    'OneWeb MEO': {
      'coverage': (coefs: number[], alt: number, inc: number) => { return 100 * cloglog(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*Math.abs(inc-45) + coefs[4]*alt*inc + coefs[5]*alt*Math.abs(inc-45)) },
      'availability': (coefs: number[], alt: number, inc: number) => { return 100 * cloglog(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*Math.abs(inc-45) + coefs[4]*alt*inc + coefs[5]*alt*Math.abs(inc-45)) },
      'average_gap': (coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
      'reduced_coverage': (coefs: number[], alt: number, inc: number) => { return 100 * cloglog(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*Math.abs(inc-45) + coefs[4]*alt*inc + coefs[5]*alt*Math.abs(inc-45)) },
      'slew_rate': (coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
      'tracking_rate': (coefs: number[], alt: number, inc: number) => { return Math.max(0,1/(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)) },
      'mean_response_time': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
      'mean_coverage_duration': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
      'mean_contacts':(coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*alt + coefs[4]*alt*inc + coefs[5]*alt*alt*inc) },
      'max_gap': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
    }, 
    'Eutelsat': {
        'coverage': (coefs: number[], alt: number, inc: number) => { return 100 * Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
        'availability': (coefs: number[], alt: number, inc: number) => { return 100 * Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
        'average_gap': (coefs: number[], alt: number, inc: number) => { return Math.max(0, coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
        'reduced_coverage': (coefs: number[], alt: number, inc: number) => { return 100 * Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
        'slew_rate': (coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
        'tracking_rate': (coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
        'mean_response_time': (coefs: number[], alt: number, inc: number) => soft_threshold(alt,
                                                                                  coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc,
                                                                                  0,
                                                                                  coefs[4],
                                                                                  coefs[5]),
        'mean_coverage_duration': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
        'mean_contacts': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
        'max_gap':(coefs: number[], alt: number, inc: number) => soft_threshold(alt,
                                                                                    coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc,
                                                                                    0,
                                                                                    coefs[4],
                                                                                    coefs[5]),
    },
    'IridiumNext': {
      'coverage': (coefs: number[], alt: number, inc: number) => { return 100 / (Math.exp(-(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc))+ 1) },
      'availability': (coefs: number[], alt: number, inc: number) => { return 100 / (Math.exp(-(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc))+ 1) },
      'average_gap': (coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
      'reduced_coverage': (coefs: number[], alt: number, inc: number) => { return 100 / (Math.exp(-(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)) + 1) },
      'slew_rate': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
      'tracking_rate': (coefs: number[], alt: number, inc: number) => { return Math.max(0,1/(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)) },
      'mean_response_time': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
      'mean_coverage_duration': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
      'mean_contacts': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
      'max_gap': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
    },
    'Globalstar': {
      'coverage': (coefs: number[], alt: number, inc: number) => { return 100 * cloglog(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
      'availability': (coefs: number[], alt: number, inc: number) => { return 100 * cloglog(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
      'average_gap': (coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
      'reduced_coverage': (coefs: number[], alt: number, inc: number) => { return 100 * cloglog(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
      'slew_rate': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
      'tracking_rate': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
      'mean_response_time': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
      'mean_coverage_duration': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
      'mean_contacts': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
      'max_gap': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
    }, 
    'IntelsatEpicNG': {
      'coverage': (coefs: number[], alt: number, inc: number) => { return 100 * cauchit(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
      'availability': (coefs: number[], alt: number, inc: number) => { return 100 * cauchit(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
      'average_gap': (coefs: number[], alt: number, inc: number) => { return Math.max(0, coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
      'reduced_coverage': (coefs: number[], alt: number, inc: number) => { return 100 * cauchit(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
      'slew_rate': (coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
      'tracking_rate': (coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
      'mean_response_time': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
      'mean_coverage_duration': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
      'mean_contacts': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
      'max_gap': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
    },
    'Inmarsat4': {
      'coverage': (coefs: number[], alt: number, inc: number) => soft_threshold(alt,
                                                                                100 * cloglog(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc),
                                                                                100,
                                                                                coefs[4],
                                                                                coefs[5]),
      'availability': (coefs: number[], alt: number, inc: number) => soft_threshold(alt,
        100 * cloglog(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc),
        100, coefs[4], coefs[5]),
      'average_gap': (coefs: number[], alt: number, inc: number) => { return Math.exp((coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)) },
      'reduced_coverage': (coefs: number[], alt: number, inc: number) => soft_threshold(alt,
                                                                                    100 * cloglog(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc),
                                                                                    100,
                                                                                    coefs[4],
                                                                                    coefs[5]),
      'slew_rate': (coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
      'tracking_rate': (coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
      'mean_response_time': (coefs: number[], alt: number, inc: number) => {return Math.exp((coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc))},
      'mean_coverage_duration': (coefs: number[], alt: number, inc: number) => {return Math.exp((coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc))},
      'mean_contacts':(coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*alt + coefs[4]*alt*inc + coefs[5]*alt*alt*inc) },
      'max_gap': (coefs: number[], alt: number, inc: number) => {return Math.exp((coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc))},
    },
    'Inmarsat5': {
      'coverage': (coefs: number[], alt: number, inc: number) => soft_threshold(alt,
                                                                            100 * cloglog(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc),
                                                                            100,
                                                                            coefs[4],
                                                                            coefs[5]),
      'average_gap': (coefs: number[], alt: number, inc: number) => { return Math.exp((coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)) },
      'reduced_coverage': (coefs: number[], alt: number, inc: number) => soft_threshold(alt,
                                                                                100 * cloglog(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc),
                                                                                100,
                                                                                coefs[4],
                                                                                coefs[5]),
      'slew_rate': (coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
      'tracking_rate': (coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
      'mean_response_time': (coefs: number[], alt: number, inc: number) => soft_threshold(alt,
                                                                                  Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc),
                                                                                  0,
                                                                                  coefs[4],
                                                                                  coefs[5]),
      'mean_coverage_duration': (coefs: number[], alt: number, inc: number) => soft_threshold(alt,
                                                                                    Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc),
                                                                                    64800,
                                                                                    coefs[4],
                                                                                    coefs[5]),
      'mean_contacts':(coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*alt + coefs[4]*alt*inc + coefs[5]*alt*alt*inc) },
      'max_gap': (coefs: number[], alt: number, inc: number) => soft_threshold(alt,
                                                                                      Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc),
                                                                                      0,
                                                                                      coefs[4],
                                                                                      coefs[5]),
      'availability': (coefs: number[], alt: number, inc: number) => soft_threshold(alt,
        100 * cloglog(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc),
        100, coefs[4], coefs[5])
    },  
    'TDRS KaSA': {
      'coverage': (coefs: number[], alt: number, inc: number) => soft_threshold(alt,
                                                                                  100 * cloglog(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc),
                                                                                  100,
                                                                                  coefs[4],
                                                                                  coefs[5]), 
      'average_gap': (coefs: number[], alt: number, inc: number) => soft_threshold(alt,
                                                                                   coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc,
                                                                                   0,
                                                                                   coefs[4],
                                                                                   coefs[5]),
      'reduced_coverage':  (coefs: number[], alt: number, inc: number) => soft_threshold(alt,
                                                                                         100 * cloglog(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc),
                                                                                         100,
                                                                                         coefs[4],
                                                                                         coefs[5]), 
      'slew_rate': (coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
      'tracking_rate': (coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc) },
      'mean_response_time': (coefs: number[], alt: number, inc: number) => soft_threshold(alt,
                                                                                            coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc,
                                                                                            0,
                                                                                            coefs[4],
                                                                                            coefs[5]),
      'mean_coverage_duration': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
      'mean_contacts':(coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*alt + coefs[4]*alt*inc + coefs[5]*alt*alt*inc) },
      'max_gap': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
    },
    'TDRS SSA': {
      'coverage': (coefs: number[], alt: number, inc: number) => soft_threshold(alt,
                                                                                100 * cloglog(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc),
                                                                                100,
                                                                                coefs[4],
                                                                                coefs[5]), 
      'average_gap': (coefs: number[], alt: number, inc: number) => soft_threshold(alt,
                                                                                   coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc,
                                                                                   0,
                                                                                   coefs[4],
                                                                                   coefs[5]),
      'reduced_coverage': (coefs: number[], alt: number, inc: number) => soft_threshold(alt,
                                                                                        100 * cloglog(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc),
                                                                                        100,
                                                                                        coefs[4],
                                                                                        coefs[5]), 
      'slew_rate': (coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc) },
      'tracking_rate': (coefs: number[], alt: number, inc: number) => { return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc) },
      'mean_response_time': (coefs: number[], alt: number, inc: number) => soft_threshold(alt,
                                                                                            coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc,
                                                                                            0,
                                                                                            coefs[4],
                                                                                            coefs[5]),
      'mean_coverage_duration': (coefs: number[], alt: number, inc: number) => soft_threshold(alt,
                                                                                              coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc,
                                                                                              86400,
                                                                                              coefs[4],
                                                                                              coefs[5]),
      'mean_contacts': (coefs: number[], alt: number, inc: number) => {return Math.exp(coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc)},
      'max_gap': (coefs: number[], alt: number, inc: number) => soft_threshold(alt,
                                                                                                  coefs[0] + coefs[1]*alt + coefs[2]*inc + coefs[3]*alt*inc,
                                                                                                  0,
                                                                                                  coefs[4],
                                                                                                  coefs[5])
    },
    default: {
      coverage: (coefficients: number[], altitude: number, inclination: number) => { 
        return 100 / (Math.exp(-(
          coefficients[0] + coefficients[1] * altitude + 
          coefficients[2] * inclination + coefficients[3] * altitude * inclination
        )) + 1);
      },
      average_gap: (coefficients: number[], altitude: number, inclination: number) => { 
        return Math.exp(coefficients[0] + coefficients[1] * altitude + 
          coefficients[2] * inclination + coefficients[3] * altitude * inclination);
      },
      reduced_coverage: (coefficients: number[], altitude: number, inclination: number) => { 
        return 100 / (Math.exp(-(
          coefficients[0] + coefficients[1] * altitude + 
          coefficients[2] * inclination + coefficients[3] * altitude * inclination
        )) + 1);
      },
      slew_rate: (coefficients: number[], altitude: number, inclination: number) => { 
        return Math.exp(coefficients[0] + coefficients[1] * altitude + 
          coefficients[2] * inclination + coefficients[3] * altitude * inclination);
      },
      tracking_rate: (coefficients: number[], altitude: number, inclination: number) => { 
        return Math.exp(coefficients[0] + coefficients[1] * altitude + 
          coefficients[2] * inclination + coefficients[3] * altitude * inclination);
      },
      mean_response_time: (coefficients: number[], altitude: number, inclination: number) => { 
        return Math.exp(coefficients[0] + coefficients[1] * altitude + 
          coefficients[2] * inclination + coefficients[3] * altitude * inclination);
      },
      mean_coverage_duration: (coefficients: number[], altitude: number, inclination: number) => { 
        return Math.exp(coefficients[0] + coefficients[1] * altitude + 
          coefficients[2] * inclination + coefficients[3] * altitude * inclination);
      },
      mean_contacts: (coefficients: number[], altitude: number, inclination: number) => { 
        return Math.exp(coefficients[0] + coefficients[1] * altitude + 
          coefficients[2] * inclination + coefficients[3] * altitude * inclination);
      },
      max_gap: (coefficients: number[], altitude: number, inclination: number) => { 
        return Math.exp(coefficients[0] + coefficients[1] * altitude + 
          coefficients[2] * inclination + coefficients[3] * altitude * inclination);
      },
      availability: (coefficients: number[], altitude: number, inclination: number) => { 
        return 100 / (Math.exp(-(
          coefficients[0] + coefficients[1] * altitude + 
          coefficients[2] * inclination + coefficients[3] * altitude * inclination
        )) + 1);
      }
    }
}