export const OVERVIEW_KEY = 'Network Overview';

export const STATION_KEY = 'Station Overview';

export const ANTENNA_KEY = 'Antenna Overview';

export const STANDARDS_MAPPING : {mask:number,name:string}[] = [
    {
        name: "CCSDS",
        mask: 0b01
    },
    {
        name: "DVB-S2",
        mask: 0b10
    }
];

export const FREQ_FILTERING_OPTIONS = [
    { label: 'HF (3 to 30 MHz)', value: '3/30', band: 'HF' },
    { label: 'VHF (30 to 300 MHz)', value: '30/300', band: 'VHF' },
    { label: 'UHF (300	to 1,000 MHz)', value: '300/1000', band: 'UHF' },
    { label: 'L-Band (1,000 to 2,000 MHz)', value: '1000/2000', band: 'L-Band' },
    { label: 'S-Band  (2,000 to 4,000 MHz)', value: '2000/4000', band: 'S-Band' },
    { label: 'C-Band  (4,000 to 7,000 MHz)', value: '4000/7000', band: 'C-Band' },
    {
        label: 'X-Band (7,000 to 12,000 MHz)',
        value: '7000/12000',
        band: 'X-Band'
    },
    {
        label: 'Ku-Band (12,000 to 20,000 MHz)',
        value: '12000/20000',
        band: 'Ku-Band'
    },
    {
        label: 'Ka-Band (20,000 to 40,000 MHz)',
        value: '20000/40000',
        band: 'Ka-Band'
    },
    {
        label: 'V-Band (40,000 to 75,000 MHz)',
        value: '40000/75000',
        band: 'V-Band'
    },
    {
        label: 'W-Band  (75,000 to 110,000 MHz)',
        value: '75000/110000',
        band: 'W-Band'
    }
];
