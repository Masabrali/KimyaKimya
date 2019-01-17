export default function (token) {
    return {
        type: 'FCM_TOKEN_FETCHED',
        token
    };
}
