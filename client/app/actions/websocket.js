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

export default function websocket(data, _dispatch) {
    try {

    } catch (error) {
        return handleError(error);
    }
}
