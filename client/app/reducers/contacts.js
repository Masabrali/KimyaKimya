/**
* Import Utilities
*/
import isEmpty from './../utilities/isEmpty';

/**
* Define the reducer
*/
export default function (state = [], action = {}) {

    let contacts = [];

    let sortContacts = (contacts) => (
        contacts.sort( (contactA, contactB) => {

            if (contactA.givenName && contactB.givenName) {
                if (contactA.givenName < contactB.givenName) return -1;
                else return 1;
            } else if (contactA.middleName && contactB.middleName) {
                if (contactA.middleName < contactB.middleName) return -1;
                else return 1;
            } else if (contactA.familyName && contactB.familyName) {
                if (contactA.familyName < contactB.familyName) return -1;
                else return 1;
            } else {
                if (contactA < contactB) return -1;
                else return 1;
            }

        } )
    );

    switch(action.type) {

        case 'CONTACTS_FETCHED':

            return sortContacts(action.contacts);

        case 'CONTACTS_SEARCHED':

            action.contacts.map( (contact) => {
              if (isEmpty(state.find( (_contact) => (contact.recordID == _contact.recordID) )))
                  return contacts.push(contact);
            } );

            return sortContacts([ ...state, ...contacts ]);

        case 'USER_LOGGED_OUT':

            return [];

        default: return state;
    }
}
