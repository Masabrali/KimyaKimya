import fetch from './fetch';

export default function(message) {

    let form = new FormData();
    form.append("message", message.message);
    form.append("screenshot", message.screenshot);

    return fetch('contactUs.php', undefined, undefined, undefined, 'PUT', form, 'multipart/form-data');
}
