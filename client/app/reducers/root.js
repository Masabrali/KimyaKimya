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
import locations from './locations';
import places from './places';
import hotpoints from './hotpoints';
import contacts from './contacts';
import links from './links';

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
    locations: locations,
    places: places,
    hotpoints: hotpoints,
    contacts: contacts,
    links: links
});

export default reducers;
