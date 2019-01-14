/**
 * Import React, { Component }, and React Native Components
*/
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Root } from 'native-base'; // Version can be specified in package.json

/**
 * Import Store
*/
import { store, persistor } from './store'; // Version can be specified in package.json
import STORE from './store';

/**
 * Import Routes
*/
import Routes from './Routes';

type Props = {};

export default class App extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize state
        this.state = {};

        // Bind functions to this
    }

    render() {

        // return (
        //     <Root>
        //         <Provider store={ store }>
        //             <Routes />
        //         </Provider>
        //     </Root>
        // );

        return (
            <Root>
                <Provider store={ store }>
                    <PersistGate loading={ null } persistor={ persistor }>
                        <Routes />
                    </PersistGate>
                </Provider>
            </Root>
        );
    }
}
