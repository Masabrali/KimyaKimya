/**
* Import Dependancies
*/
import { Platform } from 'react-native';
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import storage from 'redux-persist/lib/storage';
import devToolsEnhancer from 'remote-redux-devtools';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

/**
* Collect Reducers
*/
import reducers from './reducers/root';
/**
* Create Store with Persisit Reducers
*/
const store = createStore(
    persistReducer( {
            key: 'root',
            storage,
            stateReconciler: hardSet
        },
        reducers
    ),
    compose(
        applyMiddleware(thunk, promise),
        devToolsEnhancer({
            realtime: true,
            name: Platform.OS,
            suppressConnectErrors: false
        })
    )
);

/**
* Create a perisistor
*/
const persistor = persistStore(store);

/**
* Export the store and persistor
*/
export { store, persistor };

/**
* Purge Persistor after export
*/
// persistor.purge();
