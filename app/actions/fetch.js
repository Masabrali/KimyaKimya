/**
* Import SERVER adderss
*/
import { SERVER } from '../config';

/**
* Import Utiities
*/
import isEmpty from '../utilities/isEmpty';

/**
* Import Response and Error Handlers
*/
import handleResponse from './handleResponse';
import handleError from './handleError';

export default function _fetch(url, data, _dispatch, absoluteURL, method, body, contentType) {

    return ( (dispatch) => {

        return fetch( ((!absoluteURL)? SERVER + '/api/' + url : url), {
            method: method || 'POST',
            body: body || JSON.stringify(data),
            headers: {
                'Content-Type': contentType || 'application/json',
                'Accept': contentType || 'application/json'
            }
        } )
        .then(handleResponse)
        .then( (_data) => {

            if (!isEmpty(_data.errors)) handleError(_data.errors[0]);

            if (!isEmpty(_data.error_message)) handleError(_data.error_message);

            if (_dispatch && isEmpty(_data.errors) && isEmpty(_data.error_message))
                dispatch( _dispatch(_data) );

            return _data;
        } )
        .catch(handleError);
    } );
}
