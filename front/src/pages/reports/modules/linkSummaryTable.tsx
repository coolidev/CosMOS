import { State } from "src/pages/home";
import { ResultsState } from "src/slices/results";
import { reportInfo } from "..";

export function linkSummaryTable(results: ResultsState, state: State, reportData: reportInfo): string {
    //Build Link Summary table
    /************************************************************/
    let antennaLinkRows = "";
    for(let i = 1; i<state.selectedItems.length; i++){
        let tempRow = antennaLinkSummaryRow;
        tempRow = tempRow.replaceAll("$INDEX", `${i+1}`);
        tempRow = tempRow.replaceAll("$ANTENNA", state.selectedItems[i].id === 0?state.selectedItems[i]?.name + ' Antenna':state.selectedItems[i].antennaName ?? '');
        tempRow = tempRow.replaceAll("$GT", results.linkBudget[state.selectedItems[i].id].filter(item => item['key'] === 'gainToNoiseTemperatureRatio_dB_K')[0]?.value.toFixed(2) + " dB/K");
        tempRow = tempRow.replaceAll("$DATAMARGIN", results.linkBudget[state.selectedItems[i].id].filter(item => item['key'] === 'margin_dB')[0]?.value.toFixed(2) + " dB");
        antennaLinkRows += tempRow;
    }
    let antennaLinkSummaryTable = (state.selectedItems.length > 0)? antennaLinkSummaryShell : "";
    if(antennaLinkSummaryTable !== ""){
        antennaLinkSummaryTable = antennaLinkSummaryTable.replaceAll("$NUMANTENNAS",state.selectedItems.length.toString());
        antennaLinkSummaryTable = antennaLinkSummaryTable.replaceAll("$ANTENNA",state.selectedItems[0].antennaId === 0?state.selectedItems[0].name + ' Antenna':state.selectedItems[0].antennaName);
        antennaLinkSummaryTable = antennaLinkSummaryTable.replaceAll("$GT",results.linkBudget[state.selectedItems[0].id].filter(item => item['key'] === 'gainToNoiseTemperatureRatio_dB_K')[0]?.value.toFixed(2) + " dB/K");
        antennaLinkSummaryTable = antennaLinkSummaryTable.replaceAll("$SYMBOLRATE",results.linkBudget[state.selectedItems[0].id].filter(item => item['key'] === 'dataRate_dBbps')[0]?.value.toFixed(2) + " dB-bps"); //Applies to all antennas
        antennaLinkSummaryTable = antennaLinkSummaryTable.replaceAll("$EIRP",results.linkBudget[state.selectedItems[0].id].filter(item => item['key'] === 'userEirp_dBW')[0]?.value.toFixed(2) + " dBW"); //Applies to all antennas
        antennaLinkSummaryTable = antennaLinkSummaryTable.replaceAll("$DATAMARGIN",results.linkBudget[state.selectedItems[0].id].filter(item => item['key'] === 'margin_dB')[0]?.value.toFixed(2) + " dB");
        antennaLinkSummaryTable = antennaLinkSummaryTable.replaceAll("$ROWSANTENNA", antennaLinkRows);
    }
    /************************************************************/

    return antennaLinkSummaryTable;
}



//Shell for Link Summary table - includes first row of antenna list
const antennaLinkSummaryShell = `

<p class=MsoNormal style='mso-margin-top-alt:auto;mso-margin-bottom-alt:auto'><span
style='font-size:12.0pt;line-height:107%;font-family:"Times New Roman",sans-serif'>Table
1-3 summarizes the $$MISSIONNAME$$/$$NETWORKNAME$$ $$FREQUENCYBAND$$ downlink margin. The
detailed link calculations can be found in the link budgets included at the end of this report.<o:p></o:p></span></p>
<center><p class=MsoNormal style='margin-bottom:0in;line-height:normal'><b><span
style='font-family:"Times New Roman",sans-serif'>Table 1-3. $$NETWORKNAME$$ Parameters<o:p></o:p></span></b></p></center>
<br>
<div align=center><table class=MsoTableGrid border=1 cellspacing=0 cellpadding=0
style='border-collapse:collapse;border:none;mso-border-alt:solid windowtext .5pt;
mso-yfti-tbllook:1184;mso-padding-alt:0in 5.4pt 0in 5.4pt'>
<tr style='mso-yfti-irow:0;mso-yfti-firstrow:yes'>
 <td width=133 style='width:100.05pt;border:solid windowtext 1.0pt;mso-border-alt:
 solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt'>
 <p class=MsoNormal align=center style='mso-margin-top-alt:auto;mso-margin-bottom-alt:
 auto;text-align:center;line-height:normal'><b><span style='font-family:"Times New Roman",sans-serif'>$$NETWORKNAME$$
 Antenna(s)<o:p></o:p></span></b></p>
 </td>
 <td width=133 style='width:100.05pt;border:solid windowtext 1.0pt;mso-border-alt:
 solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt'>
 <p class=MsoNormal align=center style='mso-margin-top-alt:auto;mso-margin-bottom-alt:
 auto;text-align:center;line-height:normal'><b><span style='font-family:"Times New Roman",sans-serif'>Frequency Band<o:p></o:p></span></b></p>
 </td>
 <td width=98 style='width:73.6pt;border:solid windowtext 1.0pt;border-left:
 none;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;
 padding:0in 5.4pt 0in 5.4pt'>
 <p class=MsoNormal align=center style='mso-margin-top-alt:auto;mso-margin-bottom-alt:
 auto;text-align:center;line-height:normal'><b><span style='font-family:"Times New Roman",sans-serif'>Ground
 Station G/T (clear sky and at $$ELEVATION$$&#186; elevation)<o:p></o:p></span></b></p>
 </td>
 <td width=98 style='width:73.6pt;border:solid windowtext 1.0pt;border-left:
 none;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;
 padding:0in 5.4pt 0in 5.4pt'>
 <p class=MsoNormal align=center style='mso-margin-top-alt:auto;mso-margin-bottom-alt:
 auto;text-align:center;line-height:normal'><b><span style='font-family:"Times New Roman",sans-serif'>Symbol
 Rate (after RS encoding applied)<o:p></o:p></span></b></p>
 </td>
 <td width=98 style='width:73.6pt;border:solid windowtext 1.0pt;border-left:
 none;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;
 padding:0in 5.4pt 0in 5.4pt'>
 <p class=MsoNormal align=center style='mso-margin-top-alt:auto;mso-margin-bottom-alt:
 auto;text-align:center;line-height:normal'><b><span style='font-family:"Times New Roman",sans-serif'>$$MISSIONNAME$$ Required
 EIRP<o:p></o:p></span></b></p>
 </td>
 <td width=98 style='width:73.6pt;border:solid windowtext 1.0pt;border-left:
 none;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;
 padding:0in 5.4pt 0in 5.4pt'>
 <p class=MsoNormal align=center style='mso-margin-top-alt:auto;mso-margin-bottom-alt:
 auto;text-align:center;line-height:normal'><b><span style='font-family:"Times New Roman",sans-serif'>Data
 Margin BER=10<sup>-5</sup> @ Viterbi Decoder<o:p></o:p></span></b></p>
 </td>
</tr>
<tr style='mso-yfti-irow:1'>
 <td width=133 style='width:100.05pt;border:solid windowtext 1.0pt;border-top:
 none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;
 padding:0in 5.4pt 0in 5.4pt'>
 <p class=MsoNormal align=center style='mso-margin-top-alt:auto;mso-margin-bottom-alt:
 auto;text-align:center;line-height:normal'><span style='font-family:"Times New Roman",sans-serif'>$ANTENNA<o:p></o:p></span></p>
 </td>
  <td width=98 rowspan=$NUMANTENNAS style='width:73.6pt;border-top:none;border-left:none;
 border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
 mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;
 mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt'>
 <p class=MsoNormal align=center style='mso-margin-top-alt:auto;mso-margin-bottom-alt:
 auto;text-align:center;line-height:normal'><span style='font-family:"Times New Roman",sans-serif'>$$FREQUENCYBAND$$<o:p></o:p></span></p>
 </td>
 <td width=98 style='width:73.6pt;border-top:none;border-left:none;border-bottom:
 solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;mso-border-top-alt:
 solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:
 solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt'>
 <p class=MsoNormal align=center style='mso-margin-top-alt:auto;mso-margin-bottom-alt:
 auto;text-align:center;line-height:normal'><span style='font-family:"Times New Roman",sans-serif'>$GT<o:p></o:p></span></p>
 </td> 
 <td width=98 rowspan=$NUMANTENNAS style='width:73.6pt;border-top:none;border-left:none;
 border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
 mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;
 mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt'>
 <p class=MsoNormal align=center style='mso-margin-top-alt:auto;mso-margin-bottom-alt:
 auto;text-align:center;line-height:normal'><span style='font-family:"Times New Roman",sans-serif'>$SYMBOLRATE<o:p></o:p></span></p>
 </td>
 <td width=68 rowspan=$NUMANTENNAS style='width:73.6pt;border-top:none;border-left:
 none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
 mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;
 mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt'>
 <p class=MsoNormal align=center style='mso-margin-top-alt:auto;mso-margin-bottom-alt:
 auto;text-align:center;line-height:normal'><span style='font-family:"Times New Roman",sans-serif'>$EIRP<o:p></o:p></span></p>
 </td>
 <td width=98 style='width:73.6pt;border-top:none;border-left:none;border-bottom:
 solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;mso-border-top-alt:
 solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:
 solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt'>
 <p class=MsoNormal align=center style='mso-margin-top-alt:auto;mso-margin-bottom-alt:
 auto;text-align:center;line-height:normal'><span style='font-family:"Times New Roman",sans-serif'>$DATAMARGIN<o:p></o:p></span></p>
 </td>
</tr>
$ROWSANTENNA
<tr style='mso-yfti-irow:4;mso-yfti-lastrow:yes'>
 <td width=638 colspan=6 style='width:6.65in;border:solid windowtext 1.0pt;
 border-top:none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;
 padding:0in 5.4pt 0in 5.4pt'>
 <p class=MsoNormal style='mso-margin-top-alt:auto;mso-margin-bottom-alt:auto;
 line-height:normal'><span style='font-family:"Times New Roman",sans-serif'>Notes:<o:p></o:p></span></p>
 <p class=MsoListParagraphCxSpFirst style='mso-margin-top-alt:auto;mso-margin-bottom-alt:
 auto;mso-add-space:auto;text-indent:-.25in;line-height:normal;mso-list:l0 level1 lfo1'><![if !supportLists]><span
 style='font-family:"Times New Roman",sans-serif;mso-fareast-font-family:Times New Roman'><span
 style='mso-list:Ignore'>1.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;
 </span></span></span><![endif]><span style='font-family:"Times New Roman",sans-serif'><span
 style='color:#4472C4;mso-themecolor:accent1'>Insert Notes Here</span><br style='mso-special-character:line-break'>
 </td>
</tr>
</table></div>`;

//Additional rows to insert into antennaLinkSummaryShell - only applies to antennas starting from the second index value
const antennaLinkSummaryRow = `
<tr style='mso-yfti-irow:$INDEX'>
<td width=133 style='width:100.05pt;border:solid windowtext 1.0pt;border-top:
none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;
padding:0in 5.4pt 0in 5.4pt'>
<p class=MsoNormal align=center style='mso-margin-top-alt:auto;mso-margin-bottom-alt:
auto;text-align:center;line-height:normal'><span style='font-family:"Times New Roman",sans-serif'>$ANTENNA<b><o:p></o:p></b></span></p>
</td>
<td width=98 style='width:73.6pt;border-top:none;border-left:none;border-bottom:
solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;mso-border-top-alt:
solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:
solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt'>
<p class=MsoNormal align=center style='mso-margin-top-alt:auto;mso-margin-bottom-alt:
auto;text-align:center;line-height:normal'><span style='font-family:"Times New Roman",sans-serif'>$GT<o:p></o:p></span></p>
</td>
<td width=98 style='width:73.6pt;border-top:none;border-left:none;border-bottom:
solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;mso-border-top-alt:
solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:
solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt'>
<p class=MsoNormal align=center style='mso-margin-top-alt:auto;mso-margin-bottom-alt:
auto;text-align:center;line-height:normal'><span style='font-family:"Times New Roman",sans-serif'>$DATAMARGIN<o:p></o:p></span></p>
</td>
</tr>`;