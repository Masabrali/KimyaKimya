/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { Toast } from 'native-base'; // Version can be specified in package.json

/**
 * Import other components
*/

/**
 * Other variables and constants
*/
import Styles from '../styles';

const Error = function (error, duration) {

    let text = ((!!error.type)? error.type + ': ':'') + ((!!error.message)? error.message : error);
    let index = text.indexOf('Error: ');

    if (index != -1 && index == 0) text = text.replace('Error: ', '');

    Toast.show({
        type: 'danger',
        position: 'top',
        duration: duration || 3000,
        text: text,
        buttonText: 'DISMISS'
    });
}

/**
 * Styles
*/
const styles = StyleSheet.create({});

export default Error;
