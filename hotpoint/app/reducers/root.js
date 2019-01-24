// Import combineReducers
import { combineReducers } from 'redux';

// Import reducers
import languages from './languages';
import language from './language';
import user from './user';
import months from './months';
import countries from './countries';
import country from './country';
import products from './products';
import rate from './rate';
import speed from './speed';
import links from './links';
import invitation from './invitation';
import fcm_token from './fcm_token';

// Combiner all reducers
const reducers = combineReducers({
    languages: languages,
    language: language,
    user: user,
    months: months,
    countries: countries,
    country: country,
    products: products,
    rate: rate,
    speed: speed,
    links: links,
    invitation: invitation,
    fcm_token: fcm_token
});

export default reducers;
