export default function (contacts, type) {
    return {
        type: type || 'CONTACTS_FETCHED',
        contacts
    };
}
