import CarrierInfo from 'react-native-carrier-info';
import DeviceInfo from 'react-native-device-info';

import handleError from './handleError';
import setCountry from './dispatches/setCountry';

export default function() {

    return dispatch => {
        return (
            new Promise( (resolve, reject) => {

                try {

                    return CarrierInfo.isoCountryCode().then(
                        (result) => {

                            result = ( result || DeviceInfo.getDeviceCountry() || 'TZ' ).toUpperCase();

                            resolve(result);

                            return dispatch( setCountry(result) );
                        },
                        (error) => ( resolve({ errors: [error] }) )
                    ).catch( (error) => {

                        reject(error);

                        return handleError(error);
                    } );

                } catch (error) {

                    reject(error);

                    return handleError(error);
                }

            } )
        );
    };
}
