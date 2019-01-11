/**
* Import Libraries
*/
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';

/**
* Import Utilities
*/
import isEmpty from '../utilities/isEmpty';
import isIOS from '../utilities/isIOS';
import isAndroid from '../utilities/isAndroid';

/**
* Import Error handler
*/
import handleError from './handleError';

/**
* Import dispatcher
*/
import setContacts from './dispatches/setContacts';

export function handlePermission() {

    return (

        new Promise( (resolve, reject) => {

            let _reject = (err) => {

                reject(err);

                throw err;
            };

            try {

                return Contacts.checkPermission( (err, permission) => {

                    if (err) return reject(err);
                    else {

                        if (permission === 'denied') {

                            let permissionError = () => {

                                let _err = {
                                    name: 'PERMISSION_DENIED',
                                    message: 'Permission to Access Contacts denied'
                                };

                                return resolve({ errors: [_err] });
                            };

                            if (isAndroid())
                                return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS).then( (permission) => {

                                    if (permission === 'denied') return permissionError();
                                    else if (permission === 'authorized' || permission === 'granted')
                                        return resolve(permission);

                                }, _reject)
                                .catch(_reject);
                            else
                                return Contacts.requestPermission( (err, permission) => {

                                    if (err) return reject(err);
                                    else {

                                        if (permission === 'denied')permissionError();
                                        else if (permission === 'authorized' || permission === 'granted')
                                            return resolve(permission);
                                    }
                                } );
                        } else if (permission === 'authorized') return resolve(permission);
                    }
                } );

            } catch(err) {
                return _reject(err);
            }
        } )
    );
}

export default function contacts(key, user) {

    return ( (dispatch) => {
        return (
            new Promise( (resolve, reject) => {
                try {

                    let _resolve = (contacts) => {

                        contacts = contacts.map( (contact) => {

                                contact.phoneNumbers = contact.phoneNumbers.map( (phoneNumber) => {

                                    if (phoneNumber.number.charAt(0) == '0')
                                        phoneNumber.number = (user.countryCode + phoneNumber.number.substr(1))

                                    phoneNumber.number = phoneNumber.number.replace(/\s/g,'');

                                    return phoneNumber;
                                } );

                                return contact;
                            }
                        ).sort( (contactA, contactB) => (
                            (contactA.givenName + contactA.middleName + contactA.familyName) - (contactB.givenName + contactB.middleName + contactB.familyName)
                        ) );

                        if (!isEmpty(contacts.errors)) return handleError(contacts.errors[0].message);

                        resolve(contacts);

                        return contacts;
                    };

                    let _reject = (err) => {

                        reject(err);

                        throw err;
                    };

                    return handlePermission().then( (permission) => {

                        if (!isEmpty(permission.errors)) return resolve(permission);
                        else if (permission == 'authorized' || permission == 'granted') {
                            return Contacts.getContactsMatchingString(key, (err, contacts) => (
                                (err)? _reject(err) : _resolve(contacts)
                            ) );
                        } else return _resolve(permission);

                    }, _reject)
                    .catch(_reject);

                } catch(err) {

                    _reject(err);

                    return handleError(err);
                }
            } )
        );
    } );
}
