/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, View, TouchableOpacity  } from 'react-native';
import { Container, Header, Body, Title, Content, Button, Icon, Text, Form, Item, Right, Input, Label } from 'native-base'; // Version can be specified in package.json

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
import ModalFilterPicker from '../others/ModalFilterPicker';
import StatusBar from '../../components/others/StatusBar';

/**
 * Other variables and constants
*/
import Styles from '../styles';

const Login = function (props) {
    return (
        <Container style={ [Styles.wrapper] }>
            { (props.hideNavBar || props.action == 'login') &&  <Header noShadow style={ [Styles.backgroundHeader, Styles.borderBottom] }>
                    <Body style={ [isAndroid() && Styles.paddingLeft] }>
                        <Title style={ [Styles.textDark, Styles.textBold] }>Your Phone Number</Title>
                    </Body>
                </Header>
            }

            <StatusBar />

            <Content
              ref={ (content) => ( this.content = content ) }
              padder
              keyboardShouldPersistTaps="handle"
              contentOffset={{ x: 0, y: 100 }}
              contentContainerStyle={ [isIOS() && props.keyboardHidden && Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch, Styles.paddingTop, Styles.paddingBottom] }
            >

                <Text style={ [Styles.textAlignCenter, Styles.padding, Styles.marginTop, styles.instruction] }>
                    { (props.action == 'login') && ("Please confirm your Country Code and enter your Phone Number to continue:") }
                    { (props.action == 'edit') && "Confirm your Country Code and enter your new Phone Number:" }
                    { (props.action == 'phone') && "Confirm your Country Code and enter your current Phone Number:" }
                </Text>

                <Form block style={ [Styles.padding, Styles.marginBottom, styles.loginForm] }>

                    <Item picker icon error={ !isEmpty(props.errors.countryCode) } style={ [Styles.paddingLeft, Styles.marginBottom] } onPress={ props.toggleCountryCodePicker }>
                        {
                            (!props.country)? <Text style={ [Styles.flex, Styles.placeholder, Styles.padding] }>Tanzania, United Republic Of</Text> : <Text style={ [Styles.flex, Styles.padding] }>{ titleCase(props.country) }</Text>
                        }
                        { isEmpty(props.errors.countryCode) && <Icon name="arrow-forward" active={ false } fontSize={ 16 } /> }
                        { !isEmpty(props.errors.countryCode) && <Icon name={ (isAndroid())? "information-circle" : "information-circle-outline" } ios={ (isIOS())? "ios-information-circle-outline" : "" } android={ (isAndroid())? "md-information-circle" : "" } /> }
                    </Item>
                    { !isEmpty(props.errors.countryCode) && <Text style={ [Styles.textError, Styles.marginBottom] }>{ props.errors.countryCode }</Text> }

                    <Item fixedLabel last error={ !isEmpty(props.errors.phone) } style={ [Styles.marginBottom] }>
                        <Label style={ [styles.phoneLabel] }>{ props.countryCode }</Label>
                        <Input
                          ref={ (input) => { this.phoneInput = input; } }
                          autoFocus
                          dataDetectorType="phoneNumber"
                          keyboardType="phone-pad"
                          clearButtonMode="while-editing"
                          maxLength={10}
                          initialValue={ props.phone }
                          onFocus={ () => ( props.phoneFocused(this.content) ) }
                          onChangeText={ props.phoneChanged }
                          onKeyPress={ (e) => {
                              if (e.nativeEvent.key == "Enter")
                                  return ((props.action != 'phone')? props.confirmPhone(this.phoneInput) : props.changePhone(this.phoneInput));
                          } }
                          style={ [styles.phoneInput] }
                        />
                        { !isEmpty(props.errors.phone) && <Icon name={ (isAndroid())? "information-circle" : "information-circle-outline" } ios={ (isIOS())? "ios-information-circle-outline" : "" } android={ (isAndroid())? "md-information-circle" : "" } /> }
                    </Item>
                    { !isEmpty(props.errors.phone) && <Text style={ [Styles.textError, Styles.marginBottom] }>{ props.errors.phone }</Text> }

                    <Button block style={ [Styles.marginTop] } onPress={ () => {
                        return ((props.action != 'phone')? props.confirmPhone(this.phoneInput) : props.changePhone(this.phoneInput));
                    } }>
                        <Text>
                            { (props.action == 'login') && "Continue" }
                            { (props.action == 'phone') && "Next" }
                            { (props.action == 'edit') && "Edit" }
                        </Text>
                    </Button>

                    { (props.action == 'login') && <View style={ [Styles.padding, Styles.marginTop, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter] }>
                            <Text styles={ [Styles.padding] }>By Pressing Continue you Agree to the</Text>
                            <TouchableOpacity onPress={ props.terms }>
                                <Text style={ [Styles.textLink] }>KimyaKimya Terms and Privacy Policy</Text>
                            </TouchableOpacity>
                        </View>
                    }

                </Form>
            </Content>

            <ModalFilterPicker
              visible={ props.countryCodePickerVisible }
              onSelect={ props.countryCodeChanged }
              onCancel={ props.toggleCountryCodePicker }
              options={ props.countries }
              selectedOption={ props.countryCode }
              placeholderText="Type to Search for Country..."
              title="Select Country"
            />

            <Loader visible={ (props.loading && isEmpty(props.errors)) } title={ (isIOS())? (props.countryCode + props.phone) : false } text={ (props.action != 'phone')? "Verifying " + props.countryCode + props.phone : "Loading..." } spinnerColor={ (props.gender && props.action != 'login')? ((props.gender == 'female')? Styles.textKimyaKimyaFemale.color : Styles.textKimyaKimyaMale.color) : undefined } />
        </Container>
    );
}

/**
 * Styles
*/
const styles = StyleSheet.create({
    instruction: { fontSize: 18 },
    loginForm: {},
    phoneLabel: { fontSize: 24 },
    phoneInput: { fontSize: 24 }
});

export default Login;
