/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Container, ActionSheet, Header, Left, Body, Right, Title, Content, Form, Text, Button, Item, Label, Input, Textarea, Icon } from 'native-base'; // Version can be specified in package.json

/**
* Import Utilities
*/
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

const ContactUs = function (props) {
    return (
        <Container>
            <Header noShadow style={ [Styles.backgroundHeader, Styles.borderBottom] }>
                <Left>
                    <Button iconLeft transparent onPress={ props.back }>
                        <Icon name="arrow-back" ios="ios-arrow-back" android="md-arrow-back" style={ [isAndroid() && Styles.textDark] } />
                        { isIOS() && <Text>Cancel</Text> }
                    </Button>
                </Left>
                <Body style={ [isAndroid() && Styles.marginLeft, isAndroid() && Styles.paddingLeft] }>
                    <Title style={ [Styles.textDark, Styles.textBold] }>Contact Us</Title>
                </Body>
                <Right />
            </Header>

            <StatusBar />

            <Content padder keyboardShouldPersistTaps="handle" contentContainerStyle={ [isIOS() && props.keyboardHidden && Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch, Styles.paddingTop, Styles.paddingBottom] }>

                <Form block style={ [Styles.padding, Styles.marginBottom, styles.contactUsForm] }>

                    <Item stackedLabel error={ !isEmpty(props.errors.message) } style={ [Styles.marginBottom, Styles.marginRight] }>
                        <Label>Your Message:</Label>
                        <Textarea
                          ref={ (textarea) => ( this.messageInput = textarea ) }
                          rowSpan={3}
                          style={ [Styles.textAlignLeft, Styles.width100] }
                          onFocus={ props.focusMessage }
                          onChangeText={ props.messageChanged }
                        />
                    </Item>
                    { !isEmpty(props.errors.message) && <Text style={ [Styles.textError, Styles.marginBottom, Styles.marginLeft] }> { props.errors.message }</Text> }

                    <View style={ [Styles.padding, !isEmpty(props.errors.screenshot) && Styles.borderError] }>

                        <Text style={ [Styles.textPlaceholder] }> Screenshot(optional):</Text>

                        <TouchableOpacity style={ [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter, Styles.padding] } onPress={ () => {
                            if (!props.screenshot) return props.pickImage();
                            else
                                return ActionSheet.show({
                                    options: [
                                        { text: 'Change', icon: 'create', iconColor: isAndroid() && Styles.textPrimary.color },
                                        { text: 'Remove', icon: 'trash', iconColor: isAndroid() && Styles.textDanger.color },
                                        { text: 'Cancel', icon: (isAndroid())? 'close-circle' : 'close-circle-outline', iconColor: isAndroid() && Styles.textPrimary.color }
                                    ],
                                    cancelButtonIndex: 2,
                                    destructiveButtonIndex: 1,
                                    title: "Screenshot Options"
                                }, (index) => {

                                    if (index == 0) return props.pickImage();
                                    else if (index == 1) return props.removeImage();

                                    return;
                                });
                        } }>
                            <View style={ [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, !props.screenshot && Styles.flexAlignCenter, props.screenshot && Styles.flexAlignStretch, Styles.margin, !props.screenshot && styles.screenshotPlaceholder, props.screenshot && styles.screeshotContainer] }>
                                { !props.screenshot && <Icon name="add-circle" ios="ios-add-circle" android="md-add-circle" style={ [Styles.textPlaceholder, styles.screeshotPlaceholderIcon] } /> }

                                { props.screenshot && <Image source={ props.screenshot } resizeMode="contain" style={ [Styles.flex, styles.screenshot] } /> }
                            </View>
                        </TouchableOpacity>

                    </View>

                    <Button block onPress={ () => ( props.contactUs(this.messageInput) ) }>
                        <Text>Contact Us</Text>
                    </Button>
                </Form>

            </Content>

            <Loader visible={ (props.loading && isEmpty(props.errors)) } text="Contacting KimyaKimya..." spinnerColor={ (props.gender == 'female')? Styles.textKimyaKimyaFemale.color : Styles.textKimyaKimyaMale.color } />
        </Container>
    );
}

/**
 * Styles
*/
const styles = StyleSheet.create({
    screenshotPlaceholder: {
        borderColor: Styles.textPlaceholder.color,
        borderWidth: 1,
        borderRadius: 5,
        padding: 70
    },
    screenshotPlaceholderIcon: {},
    screenshotContainer: {},
    screenshot: {
        width: 180,
        height: 160,
        resizeMode: 'contain'
    }
});

export default ContactUs;
