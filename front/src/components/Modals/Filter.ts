import { data } from 'cypress/types/jquery';
import { gt } from 'cypress/types/lodash';
import { Filter } from 'src/utils/filterer';
import { max } from 'underscore';



export const allFilters = new Map<string, (val : any) => Filter>();

/************************** STANDARDS COMPLIANCE FILTER *******************************************/

/**
 * Currently compares compare val with the network val. Checking if the network meets ALL of the selected
 * standards.
 * Ex: 
 * user: wants 100 (5)
 * network: needs at least 100 (4), 111 and 101 are also valid
 * 
 * To switch to A or B or C (basically, any)
 * we can do
 * userVal & networkVal ===0 
 */

allFilters.set('standardsCompliance', (compareVal : any) => {
  const stdsFilter : Filter = {
    filterName: 'Standards Compliance',
    filterParam: compareVal?.toString(),
    filterFunction: (networkObj : any) => {
      let standardsVal = compareVal;
      if (standardsVal === -1) {
        return false;
      }
      if(isNaN(networkObj.standardsCompliance) || isNaN(standardsVal)) {
        return false;
      }
      return (Number(networkObj.standardsCompliance) & Number(standardsVal)) === Number(standardsVal);
    }
  };
  return stdsFilter;
});


/************************** MISSION LAUNCH YEAR FILTER *******************************************/

allFilters.set('missionLaunchYear', (compareVal : any) => {
  const mlyFilter = {
    filterName: "Launch Year",
    filterParam: compareVal?.toString(),
    filterFunction: (networkObj : any) => {
      let launchYear = compareVal;
      if (launchYear === -1) {
        return false;
      }
      if(isNaN(networkObj.year) || isNaN(launchYear)) {
        return false;
      }
      return Number(networkObj.year) <= launchYear;
    }
  };
  return mlyFilter
});

allFilters.set('missionLaunchYearDTE', (compareVal : any) => {
  const mlyFilter = {
    filterName: "Launch Year",
    filterParam: compareVal?.toString(),
    filterFunction: (networkObj : any) => {
      let launchYear = compareVal;
      if (launchYear === -1) {
        return false;
      }
      if(isNaN(networkObj.startYear) || isNaN(launchYear)) {
        return false;
      }
      return networkObj.startYear? Number(networkObj.startYear) <= launchYear : true;
    }
  };
  return mlyFilter;
});

/************************** MISSION FREQUENCY BAND FILTER *******************************************/

allFilters.set('missionFreqBand', (compareVal : any) => {
  let fbFilter = {
    filterName: "Band",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      let bands;
        if(compareVal == null || compareVal === ""){
          bands = [""]
        } else {
          bands = compareVal.split(',');
        }
        if (bands.length===0) {
          bands = [""]
        }
        bands = bands.map(e => e.toLowerCase());
    
        for(let i = 0; i < bands.length; i++) {
          if (val.frequencyBandName?.toLowerCase()?.includes(bands[i])) return true;
        }
        return false;
    }
  };
  return fbFilter;
});

/************************** MISSION POLARIZATION FILTER *******************************************/

allFilters.set('missionPolarization', (compareVal : any) => {
  let polFilter = {
    filterName: "Polarization",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return true;
      }
      let polarization;
      if(compareVal == null || compareVal === ""){
        polarization = [""]
      } else {
        polarization = compareVal.split(',');
      }
        if (polarization.length === 0) {
          polarization = [""]
        }
        polarization = polarization.map(e => e.toLowerCase());
        for(let i = 0; i < polarization.length; i++) {
          try{
            if (val.polarization && val.polarization?.toLowerCase()?.includes(polarization[i])) return true;
            if (!val.polarization && val.antennaPolarizations && val.antennaPolarizations?.toLowerCase()?.includes(polarization[i])) return true;
          } catch {
            console.log("Bad data was recieved", val);
            return false;
          }
        }
        return false;
    }
  };
  return polFilter;
});

/************************** MISSION CODING TYPE FILTER *******************************************/

allFilters.set('missionCodingType', (compareVal : any) => {
  const codFilter = {
    filterName: "Coding",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay' || !val.channelCodingType){
        return false;
      }
      let channelCodingType;
      if(compareVal == null || compareVal === ""){
        channelCodingType = [""]
      } else {
        channelCodingType = compareVal.split(',');
      }
        if (channelCodingType.length === 0) {
          channelCodingType = [""]
        }
        channelCodingType = channelCodingType.map(e => e.toLowerCase());
        for(let i = 0; i < channelCodingType.length; i++) {
          if (val.channelCodingType?.toLowerCase()?.includes(channelCodingType[i])) return true;
        }
        return false;
    }
  }
  return codFilter;
});


  /************************** MISSION MODULATION TYPE FILTER *******************************************/

allFilters.set('missionModulationType', (compareVal : any) => {
  const modFilter = {
    filterName: "Modulation",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      let modulationType;
      if(compareVal == null || compareVal === ""){
        modulationType = [""]
      } else {
        modulationType = compareVal.split(',');
      }
        if (modulationType.length === 0) {
          modulationType = [""]
        }
        modulationType = modulationType.map(e => e.toLowerCase());
        for(let i = 0; i < modulationType.length; i++) {
          if (val.modulationType?.toLowerCase()?.includes(modulationType[i])) return true;
        }
        return false;
    }
  };
  return modFilter;
});

/************************** OPERATIONAL YEAR FILTER *******************************************/

allFilters.set('operationalYear', (compareVal : any) => {
  const opYrFilter = {
    filterName: "Op. Year",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {

      let year = compareVal;
      if (year === '') {
      year = '999999';
      }
      if(isNaN(val.year) || isNaN(year)) {
      return false;
      }
      return Number(val.year) <= Number(year);
    }
  };
  return opYrFilter
});
/************************** FREQUENCY BAND FILTER *******************************************/

allFilters.set('frequencyBands', (compareVal : any) => {
  const freqBandFilter = {
    filterName: "Band",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      let bands;
        if(compareVal == null || compareVal === ""){
          bands = [""]
        } else {
          bands = compareVal.split(',');
        }
        if (bands.length === 0) {
          bands = [""]
        }
        bands = bands.map(e => e.toLowerCase());
    
        for(let i = 0; i < bands.length; i++) {
          if (val.supportedFrequencies?.toLowerCase()?.includes(bands[i])) return true;
        }
        return false;
    }
  };
  return freqBandFilter;
});

/************************** LOCATION FILTER *******************************************/

allFilters.set('location', (compareVal : any) => {
  const locFilter = {
    filterName: "Location",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      let location;
      if(compareVal == null || compareVal === ""){
        location = [""]
      } else {
        location = compareVal.split(',');
      }
        if (location.length === 0) {
          location = [""]
        }
        location = location.map(e => e.toLowerCase());
        for(let i = 0; i < location.length; i++) {
          if (val.location?.toLowerCase()?.includes(location[i])) return true;
        }
        return false;
    }
  };
  return locFilter;
});

/************************** MIN FREQUENCY FILTER *******************************************/
allFilters.set('minFrequency>', (compareVal : any) => {
  const minFreqFilter = {
    filterName: "Min Frequency (>)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(compareVal == null || compareVal === ""){
        return true;
      }
      let minFrequency = compareVal;
      let isValid = false;
      if (minFrequency === '') {
      minFrequency = '0';
      }
      if(isNaN(val.minFrequency)){
        val.minFrequency.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) > Number(minFrequency)){
            isValid = true;
          }
        })
        return isValid;
      } else {
        return Number(val.minFrequency) > Number(minFrequency);
      }
    }
  };
  return minFreqFilter;
});

allFilters.set('minFrequency<', (compareVal : any) => {
  const minFreqFilter = {
    filterName: "Min Frequency (<)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(compareVal == null || compareVal === ""){
        return true;
      }
      let minFrequency = compareVal;
      let isValid = false;
      if (minFrequency === '') {
      minFrequency = '0';
      }
      if(isNaN(val.minFrequency)){
        val.minFrequency.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) < Number(minFrequency)){
            isValid = true;
          }
        })
        return isValid;
      } else {
        return Number(val.minFrequency) < Number(minFrequency);
      }
    }
  };
  return minFreqFilter;
});

allFilters.set('minFrequency=', (compareVal : any) => {
  const minFreqFilter = {
    filterName: "Min Frequency (=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(compareVal == null || compareVal === ""){
        return true;
      }
      let minFrequency = compareVal;
      let isValid = false;
      if (minFrequency === '') {
      minFrequency = '0';
      }
      if(isNaN(val.minFrequency)){
        val.minFrequency.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) === Number(minFrequency)){
            isValid = true;
          }
        })
        return isValid;
      } else {
        return Number(val.minFrequency) === Number(minFrequency);
      }
    }
  };
  return minFreqFilter
});

allFilters.set('minFrequency>=', (compareVal : any) => {
  const minFreqFilter = {
    filterName: "Min Frequency (>=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(compareVal == null || compareVal === ""){
        return true;
      }
      let minFrequency = compareVal;
      let isValid = false;
      if (minFrequency === '') {
      minFrequency = '0';
      }
      if(isNaN(val.minFrequency)){
        val.minFrequency.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) >= Number(minFrequency)){
            isValid = true;
          }
        })
        return isValid;
      } else {
        return Number(val.minFrequency) >= Number(minFrequency);
      }
    }
  };
  return minFreqFilter
});

allFilters.set('minFrequency<=', (compareVal : any) => {
  const minFreqFilter = {
    filterName: "Min Frequency (<=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(compareVal == null || compareVal === ""){
        return true;
      }
      let minFrequency = compareVal;
      let isValid = false;
      if (minFrequency === '') {
      minFrequency = '0';
      }
      if(isNaN(val.minFrequency)){
        val.minFrequency.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) <= Number(minFrequency)){
            isValid = true;
          }
        })
        return isValid;
      } else {
        return Number(val.minFrequency) <= Number(minFrequency);
      }
    }
  };
  return minFreqFilter
});

/************************** MAX FREQUENCY FILTER *******************************************/
allFilters.set('maxFrequency<', (compareVal : any) => {
  const maxFreqFilter = {
    filterName: "Max Frequency (<)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
    
      if(compareVal == null || compareVal === ""){
        return true;
      }
      let maxFrequency = compareVal;
      let isValid = false;
      if (maxFrequency === '') {
      maxFrequency = '9999999';
      }
      if(isNaN(val.minFrequency)){
        val.maxFrequency.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) < Number(maxFrequency)){
            isValid = true;
          }
        })
        return isValid;
      } else {
        return Number(val.maxFrequency) < Number(maxFrequency);
      }
    }
  };
  return maxFreqFilter;
});

allFilters.set('maxFrequency>', (compareVal : any) => {
  const maxFreqFilter = {
    filterName: "Max Frequency (>)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
    
      if(compareVal == null || compareVal === ""){
        return true;
      }
      let maxFrequency = compareVal;
      let isValid = false;
      if (maxFrequency === '') {
      maxFrequency = '9999999';
      }
      if(isNaN(val.minFrequency)){
        val.maxFrequency.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) > Number(maxFrequency)){
            isValid = true;
          }
        })
        return isValid;
      } else {
        return Number(val.maxFrequency) > Number(maxFrequency);
      }
    }
  };
  return maxFreqFilter;
});

allFilters.set('maxFrequency=', (compareVal : any) => {
  const maxFreqFilter = {
    filterName: "Max Frequency (=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
    
      if(compareVal == null || compareVal === ""){
        return true;
      }
      let maxFrequency = compareVal;
      let isValid = false;
      if (maxFrequency === '') {
      maxFrequency = '9999999';
      }
      if(isNaN(val.minFrequency)){
        val.maxFrequency.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) === Number(maxFrequency)){
            isValid = true;
          }
        })
        return isValid;
      } else {
        return Number(val.maxFrequency) === Number(maxFrequency);
      }
    }
  };
  return maxFreqFilter;
});

allFilters.set('maxFrequency>=', (compareVal : any) => {
  const maxFreqFilter = {
    filterName: "Max Frequency (>=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
  
      if(compareVal == null || compareVal === ""){
        return true;
      }
      let maxFrequency = compareVal;
      let isValid = false;
      if (maxFrequency === '') {
      maxFrequency = '9999999';
      }
      if(isNaN(val.minFrequency)){
        val.maxFrequency.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) >= Number(maxFrequency)){
            isValid = true;
          }
        })
        return isValid;
      } else {
        return Number(val.maxFrequency) >= Number(maxFrequency);
      }
    }
  };
  return maxFreqFilter
});

allFilters.set('maxFrequency<=', (compareVal : any) => {
  const maxFreqFilter = {
    filterName: "Max Frequency (<=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
    
      if(compareVal == null || compareVal === ""){
        return true;
      }
      let maxFrequency = compareVal;
      let isValid = false;
      if (maxFrequency === '') {
      maxFrequency = '9999999';
      }
      if(isNaN(val.minFrequency)){
        val.maxFrequency.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) <= Number(maxFrequency)){
            isValid = true;
          }
        })
        return isValid;
      } else {
        return Number(val.maxFrequency) <= Number(maxFrequency);
      }
    }
  };
  return maxFreqFilter
});

/************************** SGL G/T FILTERS *******************************************/


allFilters.set('sglGT<', (compareVal : any) => {
  const sglGTFilter = {
    filterName: "SGL G/T (<)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'dte'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let sglGt = compareVal;
        let isValid = false;
        if (sglGt === '') {
          return true;
        }
        if(isNaN(sglGt)) {
        return false;
        }
        val.sglGt.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) < Number(sglGt)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return sglGTFilter;
});

allFilters.set('sglGT>', (compareVal : any) => {
  const sglGTFilter = {
    filterName: "SGL G/T (>)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'dte'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let sglGt = compareVal;
        let isValid = false;
        if (sglGt === '') {
          return true;
        }
        if(isNaN(sglGt)) {
        return false;
        }
        val.sglGt.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) > Number(sglGt)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return sglGTFilter;
});

allFilters.set('sglGT<=', (compareVal : any) => {
  const sglGTFilter = {
    filterName: "SGL G/T (<=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'dte'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let sglGt = compareVal;
        let isValid = false;
        if (sglGt === '') {
          return true;
        }
        if(isNaN(sglGt)) {
        return false;
        }
        val.sglGt.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) <= Number(sglGt)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return sglGTFilter;
});

allFilters.set('sglGT>=', (compareVal : any) => {
  const sglGTFilter = {
    filterName: "SGL G/T (>=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'dte'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let sglGt = compareVal;
        let isValid = false;
        if (sglGt === '') {
          return true;
        }
        if(isNaN(sglGt)) {
        return false;
        }
        val.sglGt.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) >= Number(sglGt)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return sglGTFilter;
});

allFilters.set('sglGT=', (compareVal : any) => {
  const sglGTFilter = {
    filterName: "SGL G/T (=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'dte'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let sglGt = compareVal;
        let isValid = false;
        if (sglGt === '') {
          return true;
        }
        // console.log("year: " + year + " and val " + val.year);
        if(isNaN(sglGt)) {
        return false;
        }
        val.sglGt.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) === Number(sglGt)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return sglGTFilter;
});


/************************** SSL G/T FILTERS *******************************************/

allFilters.set('sslGT<', (compareVal : any) => {
  const sslGTFilter = {
    filterName: "SSL G/T (<)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'dte'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let sslGt = compareVal;
        let isValid = false;
        if (sslGt === '') {
          return true;
        }
        if(isNaN(sslGt)) {
        return false;
        }
        val.sslGt.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) < Number(sslGt)){
            isValid = true;
          }
        })
        return isValid;
    }
  }
  return sslGTFilter;  
});

allFilters.set('sslGT>', (compareVal : any) => {
  const sslGTFilter = {
    filterName: "SSL G/T (>)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'dte'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let sslGt = compareVal;
        let isValid = false;
        if (sslGt === '') {
          return true;
        }
        if(isNaN(sslGt)) {
        return false;
        }
        val.sslGt.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) > Number(sslGt)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return sslGTFilter
});

allFilters.set('sslGT<=', (compareVal : any) => {
  const sslGTFilter = {
    filterName: "SSL G/T (<=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'dte'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let sslGt = compareVal;
        let isValid = false;
        if (sslGt === '') {
          return true;
        }
        if(isNaN(sslGt)) {
        return false;
        }
        val.sslGt.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) <= Number(sslGt)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return sslGTFilter
});

allFilters.set('sslGT>=', (compareVal : any) => {
  const sslGTFilter = {
    filterName: "SSL G/T (>=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'dte'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let sslGt = compareVal;
        let isValid = false;
        if (sslGt === '') {
          return true;
        }
        if(isNaN(sslGt)) {
        return false;
        }
        val.sslGt.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) >= Number(sslGt)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return sslGTFilter;
});

allFilters.set('sslGT=', (compareVal : any) => {
  const sslGTFilter = {
    filterName: "SSL G/T (=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'dte'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let sslGt = compareVal;
        let isValid = false;
        if (sslGt === '') {
          return true;
        }
        // console.log("year: " + year + " and val " + val.year);
        if(isNaN(sslGt)) {
        return false;
        }
        val.sslGt.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) === Number(sslGt)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return sslGTFilter; 
});

/************************** SSL EIRP FILTERS *******************************************/

allFilters.set('sslEIRP<', (compareVal : any) => {
  const sslEIRPFilter = {
    filterName: "SSL EIRP (<)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'dte'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let sslEirp = compareVal;
        let isValid = false; 
        if (sslEirp === '') {
          return true;
        }
        if(isNaN(sslEirp)) {
        return false;
        }
        val.sslEirp.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) < Number(sslEirp)){
            isValid = true;
          }
        })
        return isValid;
    }
  }
  return sslEIRPFilter;
});

allFilters.set('sslEIRP>', (compareVal : any) => {
  const sslEIRPFilter = {
    filterName: "SSL EIRP (>)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'dte'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let sslEirp = compareVal;
        let isValid = false;
        if (sslEirp === '') {
          return true;
        }
        if(isNaN(sslEirp)) {
        return false;
        }
        val.sslEirp.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) > Number(sslEirp)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return sslEIRPFilter;
});

allFilters.set('sslEIRP<=', (compareVal : any) => {
  const sslEIRPFilter = {
    filterName: "SSL EIRP (<=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'dte'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let sslEirp = compareVal;
        let isValid = false;
        if (sslEirp === '') {
          return true;
        }
        if(isNaN(sslEirp)) {
        return false;
        }
        val.sslEirp.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) <= Number(sslEirp)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return sslEIRPFilter;
});

allFilters.set('sslEIRP>=', (compareVal : any) => {
  const sslEIRPFilter = {
    filterName: "SSL EIRP (>=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'dte'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let sslEirp = compareVal;
        let isValid = false;
        if (sslEirp === '') {
          return true;
        }
        if(isNaN(sslEirp)) {
        return false;
        }
        val.sslEirp.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) >= Number(sslEirp)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return sslEIRPFilter;
});

allFilters.set('sslEIRP=', (compareVal : any) => {
  const sslEIRPFilter = {
    filterName: "SSL EIRP (=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'dte'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let sslEirp = compareVal;
        let isValid = false;
        if (sslEirp === '') {
          return true;
        }
        // console.log("year: " + year + " and val " + val.year);
        if(isNaN(sslEirp)) {
        return false;
        }
        val.sslEirp.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) === Number(sslEirp)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return sslEIRPFilter
});

/************************** SGL EIRP FILTERS *******************************************/

allFilters.set('sglEIRP<', (compareVal : any) => {
  const sglEIRPFilter = {
    filterName: "SGL EIRP (<)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'dte'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let sglEirp = compareVal;
        let isValid = false;
        if (sglEirp === '') {
          return true;
        }
        if(isNaN(sglEirp)) {
        return false;
        }
        val.sglEirp.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) < Number(sglEirp)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return sglEIRPFilter 
});

allFilters.set('sglEIRP>', (compareVal : any) => {
  const sglEIRPFilter = {
    filterName: "SGL EIRP (>)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'dte'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let sglEirp = compareVal;
        let isValid = false;
        if (sglEirp === '') {
          return true;
        }
        if(isNaN(sglEirp)) {
        return false;
        }
        val.sglEirp.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) > Number(sglEirp)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return sglEIRPFilter
});

allFilters.set('sglEIRP<=', (compareVal : any) => {
  const sglEIRPFilter = {
    filterName: "SGL EIRP (<=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'dte'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let sglEirp = compareVal;
        let isValid = false;
        if (sglEirp === '') {
          return true;
        }
        if(isNaN(sglEirp)) {
        return false;
        }
        val.sglEirp.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) <= Number(sglEirp)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return sglEIRPFilter;
});

allFilters.set('sglEIRP>=', (compareVal : any) => {
  const sglEIRPFilter = {
    filterName: "SGL EIRP (>=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'dte'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let sglEirp = compareVal;
        let isValid = false;
        if (sglEirp === '') {
          return true;
        }
        if(isNaN(sglEirp)) {
        return false;
        }
        val.sglEirp.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) >= Number(sglEirp)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return sglEIRPFilter;
});

allFilters.set('sglEIRP=', (compareVal : any) => {
  const sglEIRPFilter = {
    filterName: "SGL EIRP (=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'dte'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let sglEirp = compareVal;
        let isValid = false;
        if (sglEirp === '') {
          return true;
        }
        // console.log("year: " + year + " and val " + val.year);
        if(isNaN(sglEirp)) {
        return false;
        }
        val.sglEirp.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) === Number(sglEirp)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return sglEIRPFilter
});
/************************** RELAY TYPE FILTER *******************************************/

allFilters.set('relayType', (compareVal : any) => {
  const relayTypeFilter = {
    filterName: "Relay Type",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'dte' || val.relayType == null){
        return false;
      }
      let relayType;
      
      if(compareVal == null || compareVal === ""){
        relayType = [""]
      } else {
        relayType = compareVal.split(',');
      }
        if (relayType.length === 0) {
          relayType = [""]
        }
        
        relayType = relayType.map(e => e.toLowerCase());
        for(let i = 0; i < relayType.length; i++) {
          if (val.relayType?.toLowerCase()?.includes(relayType[i])) return true;
        }
        return false;
    }
  }
  return relayTypeFilter;
});

/************************** ANTENNA NAME FILTER *******************************************/

allFilters.set('antennaName', (compareVal : any) => {
  const antNameFilter = {
    filterName: "Antenna",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return false;
      }
      let antennaNames;
      if(compareVal == null || compareVal === ""){
        antennaNames = [""]
      } else {
        antennaNames = compareVal.split(',');
      }
        if (antennaNames.length === 0) {
          antennaNames = [""]
        }
        antennaNames = antennaNames.map(e => e.toLowerCase());
        for(let i = 0; i < antennaNames.length; i++) {
          if (val.antennaNames?.toLowerCase()?.includes(antennaNames[i])) return true;
        }
        return false;
    }
  };
  return antNameFilter;
});

/************************** DATA FORMAT FILTER *******************************************/

allFilters.set('dataFormat', (compareVal : any) => {
  const dataFormatFilter = {
    filterName: "Format",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return false;
      }
      let dataFormat;
      if(compareVal == null || compareVal === ""){
        dataFormat = [""]
      } else {
        dataFormat = compareVal.split(',');
      }
        if (dataFormat.length === 0) {
          dataFormat = [""]
        }
        dataFormat = dataFormat.map(e => e.toLowerCase());
        for(let i = 0; i < dataFormat.length; i++) {
          if (val.dataFormat?.toLowerCase()?.includes(dataFormat[i])) return true;
        }
        return false;
    }
  };
  return dataFormatFilter;
});

/************************** MODULATION TYPE FILTER *******************************************/

allFilters.set('modulationType', (compareVal : any) => {
  const modTypeFilter = {
    filterName: "Modulation",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      let modulationType;
      if(compareVal == null || compareVal === ""){
        modulationType = [""]
      } else {
        modulationType = compareVal.split(',');
      }
        if (modulationType.length === 0) {
          modulationType = [""]
        }
        modulationType = modulationType.map(e => e.toLowerCase());
        for(let i = 0; i < modulationType.length; i++) {
          if (val.modulationType?.toLowerCase()?.includes(modulationType[i])) return true;
        }
        return false;
    }
  };
  return modTypeFilter; 
});

/************************** CHANNEL CODING TYPE FILTER *******************************************/

allFilters.set('channelCodingType', (compareVal : any) => {
  const chCodTypeFilter = {
    filterName: "Coding",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        let channelCodingType;
        if(compareVal == null || compareVal === ""){
          channelCodingType = [""]
        } else {
          channelCodingType = compareVal.split(',');
        }
          if (channelCodingType.length === 0) {
            channelCodingType = [""]
          }
          channelCodingType = channelCodingType.map(e => e.toLowerCase());
          for(let i = 0; i < channelCodingType.length; i++) {
            if (val.codingType?.toLowerCase()?.includes(channelCodingType[i])) return true;
          }
          return false;
      }
      let channelCodingType;
      if(compareVal == null || compareVal === ""){
        channelCodingType = [""]
      } else {
        channelCodingType = compareVal.split(',');
      }
        if (channelCodingType.length === 0) {
          channelCodingType = [""]
        }
        channelCodingType = channelCodingType.map(e => e.toLowerCase());
        for(let i = 0; i < channelCodingType.length; i++) {
          if (val.channelCodingType?.toLowerCase()?.includes(channelCodingType[i])) return true;
        }
        return false;
    }
  }
  return chCodTypeFilter;
});

/************************** POLARIZATION FILTER *******************************************/

allFilters.set('polarization', (compareVal : any) => {
  const polFilter = {
    filterName: "Polarization",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return false;
      }
      let polarization;
      if(compareVal == null || compareVal === ""){
        polarization = [""]
      } else {
        polarization = compareVal.split(',');
      }
        if (polarization.length === 0) {
          polarization = [""]
        }
        polarization = polarization.map(e => e.toLowerCase());
        for(let i = 0; i < polarization.length; i++) {
          if (val.polarization?.toLowerCase()?.includes(polarization[i])) return true;
        }
        return false;
    }
  };
  return  polFilter
});

/************************** SUBCARRIER MODULATION TYPE FILTER *******************************************/

allFilters.set('subcarrierModulationType', (compareVal : any) => {
  const subModFilter = {
    filterName: "Sub-Carrier Modulation",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return false;
      }
      let subcarrierModulationType;
      if(compareVal == null || compareVal === ""){
        subcarrierModulationType = [""]
      } else {
        subcarrierModulationType = compareVal.split(',');
      }
        if (subcarrierModulationType.length === 0) {
          subcarrierModulationType = [""]
        }
        subcarrierModulationType = subcarrierModulationType.map(e => e.toLowerCase());
        for(let i = 0; i < subcarrierModulationType.length; i++) {
          if (val.subcarrierModulationType?.toLowerCase()?.includes(subcarrierModulationType[i])) return true;
        }
        return false;
    }
  };
  return subModFilter; 
});

/************************** EIRP FILTERS *******************************************/

allFilters.set('EIRP<', (compareVal : any) => {
  const eirpFilter = {
    filterName: "EIRP (<)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let eirp = compareVal;
        let isValid = false;
        if (eirp === '') {
          return true;
        }
        if(isNaN(eirp)) {
        return false;
        }
        val.eirpValues.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) < Number(eirp)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return eirpFilter;
});

allFilters.set('EIRP>', (compareVal : any) => {
  const eirpFilter = {
    filterName: "EIRP (>)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let eirp = compareVal;
        let isValid = false;
        if (eirp === '') {
          return true;
        }
        if(isNaN(eirp)) {
        return false;
        }
        val.eirpValues.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) > Number(eirp)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return eirpFilter;
});

allFilters.set('EIRP<=', (compareVal : any) => {
  const eirpFilter = {
    filterName: "EIRP (<=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let eirp = compareVal;
        let isValid = false;
        if (eirp === '') {
          return true;
        }
        if(isNaN(eirp)) {
        return false;
        }
        val.eirpValues.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) <= Number(eirp)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return eirpFilter
});

allFilters.set('EIRP>=', (compareVal : any) => {
  const eirpFilter = {
    filterName: "EIRP (>=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let eirp = compareVal;
        let isValid = false;
        if (eirp === '') {
          return true;
        }
        if(isNaN(eirp)) {
        return false;
        }
        val.eirpValues.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) >= Number(eirp)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return eirpFilter;
});

allFilters.set('EIRP=', (compareVal : any) => {
  const eirpFilter = {
    filterName: "EIRP (=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let eirp = compareVal;
        let isValid = false;
        if (eirp === '') {
          return true;
        }
        // console.log("year: " + year + " and val " + val.year);
        if(isNaN(eirp)) {
        return false;
        }
        val.eirpValues.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) === Number(eirp)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return eirpFilter;
});

/************************** ANTENNA SIZE FILTERS *******************************************/

allFilters.set('antennaSize<', (compareVal : any) => {
  const antSizeFilter = {
    filterName: "Antenna Size (<)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let antennaSize = compareVal;
        let isValid = false;
        if (antennaSize === '') {
          return true;
        }
        if(isNaN(antennaSize)) {
        return false;
        }
        val.antennaSize.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) < Number(antennaSize)){
            isValid = true;
          }
        })
        return isValid;
    }
  }
  return antSizeFilter;
});

allFilters.set('antennaSize>', (compareVal : any) => {
  const antSizeFilter = {
    filterName: "Antenna Size (>)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let antennaSize = compareVal;
        let isValid = false;
        if (antennaSize === '') {
          return true;
        }
        if(isNaN(antennaSize)) {
        return false;
        }
        val.antennaSize.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) > Number(antennaSize)){
            isValid = true;
          }
        })
        return isValid;
    }
  }
  return antSizeFilter;
});

allFilters.set('antennaSize<=', (compareVal : any) => {
  const antSizeFilter = {
    filterName: "Antenna Size (<=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let antennaSize = compareVal;
        let isValid = false;
        if (antennaSize === '') {
          return true;
        }
        if(isNaN(antennaSize)) {
        return false;
        }
        val.antennaSize.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) <= Number(antennaSize)){
            isValid = true;
          }
        })
        return isValid;
    }
  }
  return antSizeFilter;
});

allFilters.set('antennaSize>=', (compareVal : any) => {
  const antSizeFilter = {
    filterName: "Antenna Size (>=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let antennaSize = compareVal;
        let isValid = false;
        if (antennaSize === '') {
          return true;
        }
        if(isNaN(antennaSize)) {
        return false;
        }
        val.antennaSize.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) >= Number(antennaSize)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return antSizeFilter;
});

allFilters.set('antennaSize=', (compareVal : any) => {
  const antSizeFilter = {
    filterName: "Antenna Size (=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let antennaSize = compareVal;
        let isValid = false;
        if (antennaSize === '') {
          return true;
        }
        // console.log("year: " + year + " and val " + val.year);
        if(isNaN(antennaSize)) {
        return false;
        }
        val.antennaSize.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) === Number(antennaSize)){
            isValid = true;
          }
        })
        return isValid;
    }
  }
  return antSizeFilter;
});

/************************** ANTENNA GAIN FILTERS *******************************************/

allFilters.set('antennaGain<', (compareVal : any) => {
  const antGainFilter = {
    filterName: "Antenna Gain (<)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let antennaGain = compareVal;
        let isValid = false;
        if (antennaGain === '') {
          return true;
        }
        if(isNaN(antennaGain)) {
        return false;
        }
        val.antennaGain.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) < Number(antennaGain)){
            isValid = true;
          }
        })
        return isValid;
    }
  }
  return antGainFilter;
});

allFilters.set('antennaGain>', (compareVal : any) => {
  const antGainFilter = {
    filterName: "Antenna Gain (>)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let antennaGain = compareVal;
        let isValid = false;
        if (antennaGain === '') {
          return true;
        }
        if(isNaN(antennaGain)) {
        return false;
        }
        val.antennaGain.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) > Number(antennaGain)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return antGainFilter;
});

allFilters.set('antennaGain<=', (compareVal : any) => {
  const antGainFilter = {
    filterName: "Antenna Gain (<=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let antennaGain = compareVal;
        let isValid = false;
        if (antennaGain === '') {
          return true;
        }
        if(isNaN(antennaGain)) {
        return false;
        }
        val.antennaGain.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) <= Number(antennaGain)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return antGainFilter;
});

allFilters.set('antennaGain>=', (compareVal : any) => {
  const antGainFilter = {
    filterName: "Antenna Gain (>=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let antennaGain = compareVal;
        let isValid = false;
        if (antennaGain === '') {
          return true;
        }
        if(isNaN(antennaGain)) {
        return false;
        }
        val.antennaGain.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) >= Number(antennaGain)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return antGainFilter;
});

allFilters.set('antennaGain=', (compareVal : any) => {
  const antGainFilter = {
    filterName: "Antenna Gain (=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let antennaGain = compareVal;
        let isValid = false;
        if (antennaGain === '') {
          return true;
        }
        // console.log("year: " + year + " and val " + val.year);
        if(isNaN(antennaGain)) {
        return false;
        }
        val.antennaGain.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) === Number(antennaGain)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return antGainFilter;
});

/************************** G/T FILTERS *******************************************/

allFilters.set('GT<', (compareVal : any) => {
  const gtFilter = {
    filterName: "G/T (<)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let gt = compareVal;
        let isValid = false;
        if (gt === '') {
          return true;
        }
        if(isNaN(gt)) {
        return false;
        }
        val.gtValues.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) < Number(gt)){
            isValid = true;
          }
        })
        return isValid;
      }
    };
  return gtFilter;
});

allFilters.set('GT>', (compareVal : any) => {
  const gtFilter = {
    filterName: "G/T (>)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let gt = compareVal;
        let isValid = false;
        if (gt === '') {
          return true;
        }
        if(isNaN(gt)) {
        return false;
        }
        val.gtValues.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) > Number(gt)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return gtFilter;
});

allFilters.set('GT<=', (compareVal : any) => {
  const gtFilter = {
    filterName: "G/T (<=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let gt = compareVal;
        let isValid = false;
        if (gt === '') {
          return true;
        }
        if(isNaN(gt)) {
        return false;
        }
        val.gtValues.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) <= Number(gt)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return gtFilter;
});

allFilters.set('GT>=', (compareVal : any) => {
  const gtFilter = {
    filterName: "G/T (>=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let gt = compareVal;
        let isValid = false;
        if (gt === '') {
          return true;
        }
        if(isNaN(gt)) {
        return false;
        }
        val.gtValues.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) >= Number(gt)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return gtFilter
});

allFilters.set('GT=', (compareVal : any) => {
  const gtFilter = {
    filterName: "G/T (=)",
    filterParam: compareVal?.toString(),
    filterFunction: (val : any) => {
      if(val.type === 'relay'){
        return false;
      }
        if(compareVal == null || compareVal === ""){
          return true;
        }
        let gt = compareVal;
        let isValid = false;
        if (gt === '') {
          return true;
        }
        // console.log("year: " + year + " and val " + val.year);
        if(isNaN(gt)) {
        return false;
        }
        val.gtValues.split(',').forEach(value => {
          if(!isNaN(value) && Number(value) === Number(gt)){
            isValid = true;
          }
        })
        return isValid;
    }
  };
  return gtFilter;
});

/************************** Data Rate FILTER *******************************************/
allFilters.set('dataRate', (compareVal : any) => {
  const gtFilter = {
    filterName: "Data Rate (Mbps)",
    filterParam: (Number(compareVal) / 1000).toString(),
    filterFunction: (val : any) => {
      if(compareVal == null || compareVal === ""){
        return true;
      }
      let dataRate = compareVal;
      let isValid = false;
      if (dataRate === '') {
        return true;
      }
      if(isNaN(dataRate)) {
        return false;
      }
      if(val.dataRate >= Number(compareVal)){
        isValid = true;
      }
      return isValid;
    }
  };
  return gtFilter;
});

