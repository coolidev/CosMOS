/**
 * Return value indicates whether GNSS is available at the given
 * user altitude. 
 * @param {number} userAltitude
 * @return {string  =>}
 */
export const getGNSSAvailability = (userAltitude: number): string  => {
    if (userAltitude < 8000) {
        return 'Yes';
    } else {
        return 'No';
    }
};