/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Content, Button, Icon, Text, Form, Item, Input, Body, Right } from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Moment from 'moment'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import titleCase from '../../utilities/titleCase';
import isEmpty from '../../utilities/isEmpty';
import isIOS from '../../utilities/isIOS';
import isAndroid from '../../utilities/isAndroid';

/**
 * Import other components
*/
import Loader from '../others/Loader';
import StatusBar from '../../components/others/StatusBar';

/**
 * Other variables and constants
*/
import Styles from '../styles';

const Birth = function (props) {
    return (
        <Container style={ [Styles.wrapper] }>
            <StatusBar />
            <Content padder contentContainerStyle={ [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch] }>

                <Text style={ [Styles.textAlignCenter, Styles.padding, Styles.marginTop, styles.instruction] }>
                    { (props.action != 'edit') && "Pick your Birthday to Finish Setup:" }
                    { (props.action == 'edit') && "Pick your Birthday below:" }
                </Text>

                <Form block style={ [Styles.padding, styles.birthForm] }>

                    <Item block icon last style={ [Styles.marginBottom, { paddingLeft: 7 }] } onPress={ props.toggleBirthPicker } error={ !isEmpty(props.errors.birth) }>
                        <Icon active name='calendar' />
                        {
                            (!props._birth)? <Text style={ [Styles.flex, Styles.placeholder, Styles.padding] }>Pick Your Birthday</Text> : <Text style={ [Styles.flex, Styles.padding, styles.instruction] }>{ Moment(props._birth).format('dddd, MMMM DD, YYYY') }</Text>
                        }
                        { !isEmpty(props.errors.birth) &&  <Icon name={ (isAndroid())? "information-circle" : "information-circle-outline" } ios={ (isIOS())? "ios-information-circle-outline" : "" } android={ (isAndroid())? "md-information-circle" : "" } style={ [Styles.textError] } /> }
                    </Item>
                    { !isEmpty(props.errors.birth) && <Text style={ [Styles.textError, Styles.marginBottom] }>{ props.errors.birth }</Text> }

                    <Button block style={ [Styles.marginTop] } onPress={ props.birth }>
                        <Text>{ (props.action == 'edit')? "Change" : "Finish" }</Text>
                    </Button>
                </Form>

                <DateTimePicker
                  isVisible={ props.isBirthPickerVisible }
                  onConfirm={ props.birthChanged }
                  onCancel={ props.toggleBirthPicker }
                  date={ new Date(Moment(props._birth)) || new Date(Moment().subtract(14, 'y')) }
                  maximumDate={ new Date(Moment().subtract(14, 'y')) }
                  titleIOS="Pick Your Birthday"
                />

                <Loader visible={ props.loading && isEmpty(props.errors) } text={ (props.action == 'edit')? "Changing Your Birthday" : "Setting up Your Birthday" } spinnerColor={ Styles['textKimyaKimya' + titleCase(props.gender)].color } />
            </Content>
        </Container>
    );
}

/**
 * Styles
*/
const styles = StyleSheet.create({
    instruction: { fontSize: 18 },
    birthForm: {}
});

export default Birth;
