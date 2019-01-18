/**
* Import DEV adderss
*/
import { DEV } from '../config';

export default function handleError(err) {

    let error = new Error(err);

    // if (DEV) console.error(error);

    throw error;
}
