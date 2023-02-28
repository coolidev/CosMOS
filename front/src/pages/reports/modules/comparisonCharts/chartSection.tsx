export const chartSection = `
$$RANKING_SELECTIONS$$
<table class=MsoTableGrid border=1 cellspacing=0 cellpadding=0
 style='border-collapse:collapse;border:none;mso-border-alt:solid windowtext .5pt;
 mso-yfti-tbllook:1184;mso-padding-alt:0in 5.4pt 0in 5.4pt'>
 <tr style='mso-yfti-irow:0;mso-yfti-firstrow:yes;page-break-inside:avoid;
  height:14.35pt'>
  <td width=638 colspan=$COLNUM valign=top style='width:6.65in;border:solid windowtext 1.0pt;
  mso-border-alt:solid windowtext .5pt;background:#BDD6EE;mso-background-themecolor:
  accent5;padding:0in 5.4pt 0in 5.4pt;height:14.35pt'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal;tab-stops:
  210.0pt'><b><span style='mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:
  minor-latin;color:black;mso-themecolor:background1'>$SECTIONNAME$<o:p></o:p></span></b></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:0;mso-yfti-firstrow:yes;page-break-inside:avoid;
  height:14.35pt'>
  <td width=125 valign=top style='width:93.5pt;border:solid windowtext 1.0pt;
  border-left:none;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:
  solid windowtext .5pt;background:#BDD6EE;mso-background-themecolor:accent5;
  mso-background-themetint:102;padding:0in 5.4pt 0in 5.4pt;height:14.35pt'>
  <p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
  line-height:normal'><b><o:p>Performance Metric</o:p></b></p>
  </td>
  $TITLES$
 </tr>
 $ROWTEMPLATE$
</table>
`;

export const columnTitleVertical = `
<td width=125 style='width:93.5pt;border:solid windowtext 1.0pt;
border-left:none;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:
solid windowtext .5pt;background:#BDD6EE;mso-background-themecolor:accent5;
mso-background-themetint:102;padding:0in 5.4pt 0in 5.4pt;height:14.35pt'>
<p class=MsoNormal style='margin-top:0in;margin-right:5.65pt;margin-bottom:
0in;margin-left:5.65pt;line-height:normal'><b>$COLNAME$<o:p></o:p></b></p>
</td>
`;

export const columnTitleHoriz = `
<td width=125 valign=top style='width:93.5pt;border:solid windowtext 1.0pt;
border-left:none;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:
solid windowtext .5pt;background:#BDD6EE;mso-background-themecolor:accent5;
mso-background-themetint:102;padding:0in 5.4pt 0in 5.4pt;height:14.35pt'>
<p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
line-height:normal'><b>$COLNAME$<o:p></o:p></b></p>
</td>
`;

export const rowTemplate = `
<tr style='mso-yfti-irow:9'>
$ROWTITLE$
$ROWVALS$
</tr>
`;

export const rowTitle = `
<td width=125 valign=top style='width:198.9pt;border:solid windowtext 1.0pt;
border-top:none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;
background:#D9D9D9;mso-background-themecolor:background1;mso-background-themeshade:
217;padding:0in 5.4pt 0in 5.4pt;height:13.45pt'>
<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><b>$SYSTEMNAME$<o:p></o:p></b></p>
</td>
`;

export const rowEntry = `
<td width=125 valign=top style='width:93.5pt;border-top:none;border-left:
none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;
mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt'>
<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><o:p>$VAL$</o:p></p>
</td>
`;

export const rankingSelectionTemplate = `
<br>
<table class=MsoTableGrid border=1 cellspacing=0 cellpadding=0
 style='border-collapse:collapse;border:none;mso-border-alt:solid windowtext .5pt;
 mso-yfti-tbllook:1184;mso-padding-alt:0in 5.4pt 0in 5.4pt'>
 <tr style='mso-yfti-irow:0;mso-yfti-firstrow:yes;height:13.45pt'>
  <td width=265 valign=top style='width:198.9pt;border:solid windowtext 1.0pt;
  border-left:none;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:
  solid windowtext .5pt;background:#BDD6EE;mso-background-themecolor:accent5;
  mso-background-themetint:102;padding:0in 5.4pt 0in 5.4pt;height:13.45pt'>
  <p class=MsoNormal align=center style='text-align:center;line-height:107%;
  mso-element:frame;mso-element-frame-hspace:9.0pt;mso-element-wrap:around;
  mso-element-anchor-vertical:paragraph;mso-element-anchor-horizontal:margin;
  mso-element-left:center;mso-element-top:.3pt;mso-height-rule:exactly'><b><o:p>Ranking Factor</o:p></b></p>
  </td>
  <td width=144 valign=top style='width:1.5in;border:solid windowtext 1.0pt;
  border-left:none;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:
  solid windowtext .5pt;background:#BDD6EE;mso-background-themecolor:accent5;
  mso-background-themetint:102;padding:0in 5.4pt 0in 5.4pt;height:13.45pt'>
  <p class=MsoNormal align=center style='text-align:center;line-height:107%;
  mso-element:frame;mso-element-frame-hspace:9.0pt;mso-element-wrap:around;
  mso-element-anchor-vertical:paragraph;mso-element-anchor-horizontal:margin;
  mso-element-left:center;mso-element-top:.3pt;mso-height-rule:exactly'><b><span
  style='color:gray;mso-color-alt:windowtext'>Importance</span><o:p></o:p></b></p>
  </td>
 </tr>
 $ROWS$
</table>
<br/>
`;

export const rankingRow = `
<tr style='mso-yfti-irow:7;mso-yfti-lastrow:yes;height:13.45pt'>
<td width=265 valign=top style='width:198.9pt;border:solid windowtext 1.0pt;
border-top:none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;
background:#D9D9D9;mso-background-themecolor:background1;mso-background-themeshade:
217;padding:0in 5.4pt 0in 5.4pt;height:13.45pt'>
<p class=MsoNormal style='margin-bottom:0in;line-height:normal;mso-element:
frame;mso-element-frame-hspace:9.0pt;mso-element-wrap:around;mso-element-anchor-vertical:
paragraph;mso-element-anchor-horizontal:margin;mso-element-left:center;
mso-element-top:.3pt;mso-height-rule:exactly'><b><span style='color:gray;
mso-color-alt:windowtext'>$PARAM$</span></b><b><span
style='mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:minor-latin'><o:p></o:p></span></b></p>
</td>
<td width=144 valign=top style='width:1.5in;border-top:none;border-left:none;
border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;
mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt;height:13.45pt'>
<p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
line-height:normal;mso-element:frame;mso-element-frame-hspace:9.0pt;
mso-element-wrap:around;mso-element-anchor-vertical:paragraph;mso-element-anchor-horizontal:
margin;mso-element-left:center;mso-element-top:.3pt;mso-height-rule:exactly'>$VALUE$
<span style='mso-fareast-font-family:Times New Roman;mso-fareast-theme-font:
minor-latin'><o:p></o:p></span></p>
</td>
</tr>
`;