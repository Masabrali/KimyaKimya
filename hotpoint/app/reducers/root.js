// Import combineReducers
import { combineReducers } from 'redux';

// Import reducers
import languages from './languages';
import user from './user';
import months from './months';
import countries from './countries';
import country from './country';
import products from './products';
import orders from './orders';
import order from './order';
import rate from './rate';
import speed from './speed';
import locations from './locations';
import places from './places';
import hotpoints from './hotpoints';
import links from './links';
import invitation from './invitation';
import fcm_token from './fcm_token';

// Combiner all reducers
const reducers = combineReducers({
    languages: languages,
    user: user,
    months: months,
    countries: countries,
    country: country,
    products: products,
    orders: orders,
    order: order,
    rate: rate,
    speed: speed,
    locations: locations,
    places: places,
    hotpoints: hotpoints,
    links: links,
    invitation: invitation,
    fcm_token: fcm_token
});

export default reducers;
