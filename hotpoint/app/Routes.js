/**
 * Import React, { Component }, and React Native Components
*/
import React from 'react';
import { Router, Modal, Scene, Tabs, Actions } from 'react-native-router-flux';
import { Platform, Component, StatusBar } from 'react-native';
import { Text, Button, Icon } from 'native-base'; // Version can be specified in package.json

/**
* Import Utilities
*/
import isAndroid from './utilities/isAndroid';

/**
 * Import Containers
*/
import Welcome from './containers/views/Welcome'; // Version can be specified in package.json

/**
 * NativeBase
*/

/**
 * Import Styles
 */
import Styles from './components/styles';

const navigationBarStyle = [Styles.backgroundHeader, Styles.textDark, Styles.noShadow, Styles.borderBottom];

const tabIcon = (icon, _icon) => {
    return (
        <Icon name={ icon } ios={ 'ios-' + icon } android={ 'md-' + icon } active={ (_icon.focused)? true:false } style={{ color: (_icon.focused)? _icon.activeTintColor : _icon.inactiveTintColor }} />
    );
};

const Routes = function () {
    return (
        <Router>
            <Modal>
                <Scene key="root" hideNavBar={ true }>
                    <Scene key="welcome" component={ Welcome } hideNavBar={ true } />
                </Scene>

                <Scene key="app" hideNavBar={ true }></Scene>

            </Modal>
        </Router>
    );
}

export default Routes;
