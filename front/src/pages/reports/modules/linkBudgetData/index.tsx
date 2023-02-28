import { State } from 'src/pages/home';
import { ResultsState } from 'src/slices/results';
import { reportInfo } from '../..';

export function linkBudgetData(
  results: ResultsState,
  state: State,
  reportData: reportInfo
): string {
  //Assemble link budget tables for each Station or Relay
  /************************************************************/
  let linkBudgetList = '';
  const linkBudgets = results.linkBudget;
  let stationIndex = 1;
  Object.keys(linkBudgets).forEach((stationId) => {
    let tempLink = header;
    let index = 1;
    let stationName = reportData.gsOptions.filter(
      (station) => station.id === parseInt(stationId)
    )[0]?.name;
    let EIRP = 'undefined';
    let dataRate = 'undefined';
    let range = 'undefined';

    linkBudgets[stationId].forEach((parameter, idx) => {
      try {
        let tabCt: string = Math.ceil(
          6.2 - (parameter['parameter'].length + 4) / 7
        ).toString(); //this is kind of a hack - seems to work to give proper number of tabs to keep alignment
        if ((parameter['parameter'].length + 4) % 15 === 0) {
          tabCt = (parseInt(tabCt) - 1).toString();
        } //this adjusts edge cases (primarily for margin_dB) that the above doesn't address
        //Exceptions
        if (parameter['parameter'].length === 26) {
          tabCt = (parseInt(tabCt) + 1).toString();
        }

        if (parameter['key'] === 'userEirp_dBW') {
          EIRP = parseFloat(parameter['value']).toFixed(2).toString();
        }
        if (parameter['key'] === 'dataRate_dBbps') {
          dataRate = parseFloat(parameter['value']).toFixed(3).toString();
        }
        if (parameter['key'] === 'sslDistance_km') {
          range = parseFloat(parameter['value']).toFixed(1).toString();
        }

        let notes = parameter['notes'];
        if (notes.length > 37) {
          let breakIndex = notes.substring(0, 37).lastIndexOf(' ');
          if (breakIndex < 0) {
            breakIndex = 37;
          }
          notes =
            notes.substring(0, breakIndex) +
            `<br><span style='mso-tab-count:8'></span>` +
            notes.substring(breakIndex + 1);
        }

        let noteTabsCt: number = 2;
        if (parameter['value'] >= 10000 || parameter['value'] <= -1000) {
          noteTabsCt = 1;
        }
        let lineVal = `<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
                style='font-size:8.0pt;font-family:"Courier New"'>${
                  (index < 10 ? '0' : '') + index.toString()
                }. ${
          parameter['parameter']?.split('(')[0].toUpperCase() +
          '(' +
          parameter['parameter']?.split('(')[1]
        }<span style='mso-tab-count:${tabCt}'></span>${
          parameter['value'] ? parameter['value'].toFixed(2).toString() : '0.00'
        }<span
                style='mso-tab-count:${noteTabsCt}'></span><span style='font-size:8.0pt;font-family:"Courier New"'></span>${notes}<o:p></o:p></span></p>`;

        tempLink = tempLink + lineVal;
      } catch {
        if (parameter['value'].toString() === 'HEADER') {
          let line = `<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
                    style='font-size:8.0pt;font-family:"Courier New"'>${
                      idx > 0
                        ? `-------------------------------------------------------------------------------------------------<br>`
                        : ``
                    }
                    ${parameter[
                      'parameter'
                    ].toUpperCase()}<br>-------------------------------------------------------------------------------------------------<o:p></o:p></span></p>`;
          tempLink = tempLink + line;
          index--;
        } else {
          tempLink = tempLink + parameter;
        }
      }
      index++;
    });
    try {
      tempLink = tempLink.replaceAll(
        '$GROUNDSTATION',
        state.networkType === 'relay'
          ? state.selectedItems[0]?.system
          : stationName
      );
    } catch (e) {
      console.warn(`Report station name error ${e}`);
    }
    try {
      tempLink = tempLink.replaceAll(
        '$ANTENNA',
        state.networkType === 'relay'
          ? ''
          : ' ' + (state.selectedItems[index - 1]?.antennaId === 0)
          ? ''
          : reportData.antennaOptions[state.selectedItems[index - 1]?.antennaId]
              ?.name
      );
    } catch (e) {
      console.warn(`Report antenna error ${e}`);
    }
    try {
      tempLink = tempLink.replaceAll(
        '$LATITUDE',
        state.parameters.latitude.toString()
      );
    } catch (e) {
      console.warn(`Report latitude error ${e}`);
    }
    try {
      tempLink = tempLink.replaceAll(
        '$LONGITUDE',
        state.parameters.longitude?.toString()
      );
    } catch (e) {
      console.warn(`Report longitude error ${e}`);
    }
    try {
      tempLink = tempLink.replaceAll('$INDEX', stationIndex?.toString());
    } catch (e) {
      console.warn(`Report index error ${e}`);
    }
    try {
      tempLink = tempLink.replaceAll(
        '$EIRP',
        EIRP === '-Infinity' || EIRP === 'Infinity' ? '0.00' : EIRP
      );
    } catch (e) {
      console.warn(`Report eirp error ${e}`);
    }
    try {
      tempLink = tempLink.replaceAll(
        '$FREQUENCY',
        state.networkType === 'relay'
          ? reportData.libraryOptions[stationId][
              'ssl_return_link_frequency_mhz'
            ]?.value + ' MHz'
          : reportData.libraryOptions[stationId]['antenna_frequency'].value
      );
    } catch (e) {
      console.warn(`Report frequency error ${e}`);
    }
    try {
      tempLink = tempLink.replaceAll('$CODING', state.selectedItems[0].coding);
    } catch (e) {
      console.warn(`Report coding error ${e}`);
    }
    try {
      tempLink = tempLink.replaceAll(
        '$MODULATION',
        state.selectedItems[0].modulation
      );
    } catch (e) {
      console.warn(`Report modulation error ${e}`);
    }
    try {
      tempLink = tempLink.replaceAll(
        '$INFORATE',
        dataRate === '-Infinity' || dataRate === 'Infinity' ? '0.00' : dataRate
      );
    } catch (e) {
      console.warn(`Report inforate error ${e}`);
    }
    try {
      tempLink = tempLink.replaceAll(
        '$RANGE',
        state.networkType === 'relay'
          ? `RANGE:<span style='mso-spacerun:yes'>&nbsp;</span>${range}&nbsp;km<span style='mso-tab-count:2'></span>`
          : ''
      );
    } catch (e) {
      console.warn(`Report range error ${e}`);
    }
    try {
      tempLink = tempLink.replaceAll(
        '$POLARIZATION',
        state.networkType === 'relay'
          ? 'Circular'
          : reportData.libraryOptions[stationId]['antenna_polarization']?.value
      );
    } catch (e) {
      console.warn(`Diameter error ${e}`);
    }
    try {
      tempLink = tempLink.replaceAll(
        '$DIAMETER',
        state.networkType === 'relay'
          ? ''
          : reportData.libraryOptions[stationId]['antenna_size']
          ? ' (' +
            Number.parseFloat(
              reportData.libraryOptions[stationId]['antenna_size']?.value
            ).toFixed(2) +
            'm)'
          : ''
      );
    } catch (e) {
      console.warn(`Report Diameter error ${e}`);
    }
    try {
      if (state.networkType === 'relay') {
        tempLink = tempLink.replaceAll('ELV=$$ELEVATION$$&#186;; ', '');
      }
    } catch (e) {
      console.warn(`Report elevation error ${e}`);
    }
    tempLink += footer;
    linkBudgetList += tempLink;
    stationIndex++;
  });
  linkBudgetList = linkBudgetList.substring(
    0,
    linkBudgetList.lastIndexOf('$$PAGEBREAK$$')
  ); //remove final page break
  return linkBudgetList;
}

export const header = `
<p class=MsoNormal align=center style='mso-margin-top-alt:auto;mso-margin-bottom-alt:
auto;text-align:center'><b><span style='font-family:"Times New Roman",sans-serif'>Link $INDEX.
$$MISSIONNAME$$ with $INFORATE dB-bps Information Rate via $GROUNDSTATION$DIAMETER$ANTENNA<br>(ELV=$$ELEVATION$$&#186;; S/C EIRP=$EIRP <span class=SpellE>dBW)</span><o:p></o:p></span></b></p>

<p class=MsoNormal align=center style='mso-margin-top-alt:auto;mso-margin-bottom-alt:
auto;text-align:center'><span style='font-size:8.0pt;line-height:107%;
font-family:"Courier New"'>*** DOWNLINK MARGIN CALCULATION ***<br>
ANALYSIS #001&nbsp;&nbsp;DATE &amp; TIME:&nbsp;&nbsp;$$REPORTGENERATIONDATE$$ @ $$REPORTGENERATIONTIME$$<br>PERFORMED BY: [GENERATED BY CART]&nbsp;&nbsp;
LINKID: $$MISSIONNAME$$ VIA $GROUNDSTATION<o:p></o:p></span></p>

<p class=MsoNormal align=center style='mso-margin-top-alt:auto;mso-margin-bottom-alt:
auto;text-align:center'><span style='font-size:8.0pt;
font-family:"Courier New"'>FREQUENCY:<span style='mso-spacerun:yes'>&nbsp;</span>$FREQUENCY
<span style='mso-tab-count:2'></span>$RANGEPOLARIZATION:<span style='mso-spacerun:yes'>&nbsp;</span>$POLARIZATION<o:p></o:p></span><br><br></p>

<p class=MsoNormal style='margin-top:0in;margin-right:0in;margin-bottom:0in;
margin-left:166.5pt;line-height:normal'><span style='font-size:8.0pt;
font-family:"Courier New"'>MODULATION:<span style='mso-spacerun:yes'>&nbsp;&nbsp;</span>$MODULATION<o:p></o:p></span></p>

<p class=MsoNormal style='margin-top:0in;margin-right:0in;margin-bottom:0in;
margin-left:1.5in;line-height:normal'><span style='font-size:8.0pt;font-family:
"Courier New"'>TOTAL INFORMATION RATE:<span style='mso-spacerun:yes'>&nbsp;&nbsp;</span>$INFORATE
dB-bps<o:p></o:p></span></p>

<p class=MsoNormal style='margin-top:0in;margin-right:0in;margin-bottom:0in;
margin-left:184.5pt;line-height:normal'><span style='font-size:8.0pt;
font-family:"Courier New"'>CODING:<span style='mso-spacerun:yes'>&nbsp;&nbsp;</span>$CODING
<o:p></o:p></span></p>

<p class=MsoNormal style='margin-top:0in;margin-right:0in;margin-bottom:0in;
margin-left:2.75in;line-height:normal'><span style='font-size:8.0pt;
font-family:"Courier New"'>BER:<span style='mso-spacerun:yes'>&nbsp;&nbsp;</span>1.00E-05
<o:p></o:p></span></p>

<p class=MsoNormal style='margin-top:0in;margin-right:0in;margin-bottom:0in;
margin-left:2.75in;line-height:normal'><span style='font-size:8.0pt;font-family:
"Courier New"'><o:p>&nbsp;</o:p></span></p>

<p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
line-height:normal'><span style='font-size:8.0pt;font-family:"Courier New"'><o:p></o:p></span></p>

<p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
line-height:normal'><span style='font-size:8.0pt;font-family:"Courier New"'><o:p>&nbsp;</o:p></span></p>

<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
style='font-size:8.0pt;font-family:"Courier New"'>PARAMETER<span
style='mso-tab-count:5'></span>VALUE<span
style='mso-tab-count:1'></span><span style='mso-tab-count:1'></span>REMARKS<o:p></o:p></span></p>

<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
style='font-size:8.0pt;font-family:"Courier New"'>-------------------------------------------------------------------------------------------------<o:p></o:p></span></p>`;

let footer = `
$$PAGEBREAK$$
`;
