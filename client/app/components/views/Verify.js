/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, View  } from 'react-native';
import { Container, Content, Button, Text, Form, Item, Icon, Spinner } from 'native-base';
import CodeInput from 'react-native-code-input';
import moment from 'moment';
import momentDurationFormat from 'moment-duration-format'; // Version can be specified in package.json

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

const Login = function (props) {

    return (
        <Container style={ [Styles.wrapper] }>
            <StatusBar />
            <Content
              ref={ (content) => ( this.content = content ) }
              padder
              keyboardShouldPersistTaps="handle"
              contentContainerStyle={ [isIOS() && props.keyboardHidden && Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch, Styles.paddingBottom] }
            >

                <Text style={ [Styles.textAlignCenter, Styles.paddingLeft, Styles.paddingRight, Styles.marginTop, styles.instruction] }>
                    { (props.action == 'verify')? 'Please Enter' : 'Enter' } the received 6-digit Verification Code below:
                </Text>

                <Form block style={ [Styles.paddingLeft, Styles.paddingRight, Styles.marginBottom, styles.verificationForm] }>

                    <Item last style={ [Styles.noBorder, Styles.noPaddingLeft, !isEmpty(props.errors.verificationCode) && Styles.noPaddingRight, Styles.marginBottom] } error={ !isEmpty(props.errors.verificationCode) }>
                        <CodeInput
                            ref={ (input) => { this.codeInput = input; } }
                            autoFocus={ isIOS() }
                            keyboardType="numeric"
                            initialValue={ props._verificationCode }
                            codeLength={6}
                            space={8}
                            size={40}
                            inputPosition='center'
                            activeColor={ Styles.textDark.color }
                            inactiveColor={ Styles.textPlaceholder.color }
                            className='border-b'
                            borderType='underline'
                            cellBorderWidth={1}
                            codeInputStyle={ [Styles.marginBottom, !isEmpty(props.errors.verificationCode) && Styles.borderError, styles.verificationCode] }
                            containerStyle={ [styles.verificationCodeContainer] }
                            placeholder="-"
                            onFulfill={ props.verificationCodeChanged }
                        />
                    </Item>
                    { !isEmpty(props.errors.verificationCode) && <Text style={ [Styles.textError, Styles.marginBottom] }>{ props.errors.verificationCode }</Text> }

                    { !!props.smsWaitTime && <View style={ [Styles.flexRow, Styles.flexJustifySpaceBetween, Styles.flexAlignCenter, Styles.paddingLeft, Styles.paddingRight, Styles.marginTop, Styles.marginBottom] }>
                            <View style={ [Styles.flex, Styles.flexRow, Styles.flexJustifySpaceEvently, Styles.flexAlignCenter] }>
                                <Spinner size="small" color={ (props.action != 'verify')? Styles['textKimyaKimya' + titleCase(props.gender)].color : undefined } style={ [Styles.marginRight, Styles.heightAuto] } />
                                <Text style={ [styles.instruction] }>Waiting for SMS</Text>
                            </View>
                            <Text style={ [Styles.paddingRight, styles.instruction] }>
                                { ((props.smsWaitTime < 60)? '00:' : '') + moment.duration(props.smsWaitTime, 'seconds').format('mm:ss') }
                            </Text>
                        </View>
                    }

                    <Button block style={ [Styles.marginTop, Styles.marginBottom] } onPress={ () => (props.verify(this.codeInput)) }>
                        <Text>Verify</Text>
                    </Button>

                    { !props.smsWaitTime && <View style={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter, Styles.padding] }>
                            <Button block transparent onPress={ () => props.resend(this.codeInput) }>
                                <Text>Request Another Code</Text>
                            </Button>
                        </View>
                    }

                </Form>
            </Content>

            <Loader visible={ (props.loading || props.resending) && isEmpty(props.errors) } text={ (props.loading)? "Validating Code" : (props.resending)? "Resending Code" : "Loading..." } spinnerColor={ (props.action != 'verify')? Styles['textKimyaKimya' + titleCase(props.gender)].color : undefined } />
        </Container>
    );
}

/**
 * Styles
*/
const styles = StyleSheet.create({
    instruction: { fontSize: 18 },
    instructionSecondary: { width: 270 },
    verificationForm: {},
    verificationCodeContainer: {},
    verificationCode: { fontSize: 24 }
});

export default Login;
