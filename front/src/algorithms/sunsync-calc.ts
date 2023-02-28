// Fundamental constants. Reference constants you already have defined, but some of these will be new.
const EARTH_GM = 398600.4354360959
const J2_ZONAL_HARMONIC_COEFFICIENT = 0.001082635854 // coefficient for the second zonal term related to the oblateness of the Earth
const DAYS_PER_SIDEREAL_YEAR = 365.256363004
const SECONDS_PER_DAY = 24*60*60 // 86400
const EARTH_MEAN_MOTION_RAD_PER_SEC = (2*Math.PI) / (DAYS_PER_SIDEREAL_YEAR * SECONDS_PER_DAY)
const EARTH_EQUATORIAL_RADIUS_KM = 6378.1366
const EARTH_MEAN_RADIUS_KM = 6371

const radians = function(degrees) {
	return degrees * Math.PI / 180;
}
const degrees = function(radians) {
	return radians * 180 / Math.PI;
}

// Calculate the required inclination for a sun-synchronous orbit with the given altitude and eccentricity.
// From JPL publication "A-B-Cs of Sun-Synchronous Orbit Mission Design", Equation 1.
// See https://trs.jpl.nasa.gov/handle/2014/37900
export function calculate_sun_synchronous_orbit_inclination(altitude_km, eccentricity) {
    var a = EARTH_EQUATORIAL_RADIUS_KM + altitude_km;
    var precession_rate = EARTH_MEAN_MOTION_RAD_PER_SEC;  // desired precession rate is equal to the mean motion of the Earth around the Sun
    var p = a * (1-eccentricity**2);  // semi-latus rectum
    var n = Math.sqrt(EARTH_GM/a**3); // mean motion of satellite
    return degrees(Math.acos(precession_rate / (-(3/2) * J2_ZONAL_HARMONIC_COEFFICIENT * (EARTH_EQUATORIAL_RADIUS_KM / p)**2 * n)));
}

// Calculate the required altitude for a sun-synchronous orbit with the given inclination and eccentricity.
// From JPL publication "A-B-Cs of Sun-Synchronous Orbit Mission Design", Equation 1 (solving for altitude)
// See https://trs.jpl.nasa.gov/handle/2014/37900
export function calculate_sun_synchronous_orbit_altitude(inclination, eccentricity) {
    inclination = radians(inclination);
    let precession_rate = EARTH_MEAN_MOTION_RAD_PER_SEC;  // desired precession rate is equal to the mean motion of the Earth around the Sun
    let a = ((-(3/2) * J2_ZONAL_HARMONIC_COEFFICIENT * EARTH_EQUATORIAL_RADIUS_KM**2 * Math.sqrt(EARTH_GM) * Math.cos(inclination)) / (precession_rate * (1-eccentricity**2)**2))**(2/7);
    return a - EARTH_EQUATORIAL_RADIUS_KM;
}

// Calculate the required inclination for a sun-synchronous orbit with the given apogee and perigee.
export function calculate_sun_synchronous_orbit_inclination_from_apogee_perigee(apogee, perigee) {
    var mean_altitude = (apogee + perigee) / 2;
    var eccentricity = calculate_eccentricity(apogee, perigee);
    return calculate_sun_synchronous_orbit_inclination(mean_altitude, eccentricity);
}

// Calculate eccentricity from apogee and perigee.
export function calculate_eccentricity(apogee_km, perigee_km) {
    var ra = EARTH_MEAN_RADIUS_KM + apogee_km;
    var rp = EARTH_MEAN_RADIUS_KM + perigee_km;
    var eccentricity = (ra - rp) / (ra + rp);
    return eccentricity;
}
