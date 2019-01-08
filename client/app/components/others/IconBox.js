/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'native-base'; // Version can be specified in package.json

/**
 * Import other components
*/

/**
 * Other variables and constants
*/
import Styles from '../styles';

const IconBox = function (props) {
    return (
        <View style={ [Styles.borderRadius, Styles.flexRow, Styles.flexJustifyCenter, Styles.flexAlignCenter, Styles.textAlignCenter, { backgroundColor: (props.backgroundColor || '#007bff'), padding: 3 }] }>
            <Icon name={ props.name } ios={ props.ios } android={ props.android } style={ [Styles.textWhite, Styles.textAlignCenter] } />
        </View>
    );
}

/**
 * Styles
*/
const styles = StyleSheet.create({});

export default IconBox;
