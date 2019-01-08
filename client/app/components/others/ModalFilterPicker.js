/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import ModalFilterPicker from 'react-native-modal-filter-picker'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import isEmpty from '../../utilities/isEmpty';
import isAndroid from '../../utilities/isAndroid';

/**
 * Import other components
*/

/**
 * Other variables and constants
*/
import Styles from '../styles';

const _ModalFilterPicker = function (props) {

    return (
        <ModalFilterPicker
          visible={ props.visible }
          onSelect={ props.onSelect }
          onCancel={ props.onCancel }
          options={ props.options }
          selectedOption={ props.selectedOption }
          placeholderText={ props.placeholderText }
          placeholderTextColor="#666666"
          title={ props.title }
          keyboardShouldPersistTaps="handle"
          listContainerStyle={ Styles.modalFilterPicker }
          optionTextStyle={ Styles.modalFilterPickerOptionText }
          selectedOptionTextStyle={ Styles.modalFilterPickerSelectedOptionText }
          cancelButtonText={ (!isEmpty(props.cancelText))? (isAndroid())? props.cancelText.toUpperCase() : props.cancelText : (isAndroid())? 'CANCEL' : 'Cancel' }
          cancelButtonStyle={ Styles.modalFilterPickerCancelButton }
          cancelButtonTextStyle={ Styles.modalFilterPickerCancelButtonText }
        />
    );
}

/**
 * Styles
*/
const styles = StyleSheet.create({});

export default _ModalFilterPicker;
