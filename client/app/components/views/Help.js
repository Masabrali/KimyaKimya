/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Subtitle, Content, List, ListItem, Button, Icon, Text, Spinner } from 'native-base'; // Version can be specified in package.json

/**
* Import Utilities
*/
import isIOS from '../../utilities/isIOS';
import isAndroid from '../../utilities/isAndroid';
import titleCase from '../../utilities/titleCase';
import isEmpty from '../../utilities/isEmpty';

/**
 * Import other components
*/
import StatusBar from '../../components/others/StatusBar';

/**
 * Other variables and constants
*/
import Styles from '../styles';

const Help = function (props) {
    return (
        <Container style={ [Styles.wrapper] }>
            <Header noShadow style={ [Styles.backgroundHeader, Styles.borderBottom] }>
                <Left>
                    <Button iconLeft transparent onPress={ props.back }>
                        <Icon name="arrow-back" ios="ios-arrow-back" android="md-arrow-back" style={ [isAndroid() && Styles.textDark] } />
                        { isIOS() && <Text>Settings</Text> }
                    </Button>
                </Left>
                <Body style={ [isAndroid() && Styles.marginLeft, isAndroid() && Styles.paddingLeft] }>
                    <Title style={ [Styles.textDark, Styles.textBold] }>KimyaKimya</Title>
                    <Subtitle style={ [Styles.textSecondary, Styles.textBold] }>Version 1.0.0</Subtitle>
                </Body>
                <Right />
            </Header>

            <StatusBar />

            <Content>
                <View style={ [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter] }>
                    <View style={ [styles.logoContainer, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter, Styles.marginTop] }>
                        <Image source={ require('../../assets/logo_text.png') } resizeMode="contain" style={ [Styles.imageResizeModeContain, styles.logo] } />
                        <Text style={ [Styles.textAlignCenter, styles.catchPhrase, isAndroid() && { fontFamily: 'sans-serif-thin' }] }>Healthy and Enjoyable Moments</Text>
                    </View>
                </View>
                <View>
                    <List>
                        <ListItem noIndent />
                        <ListItem noIndent onPress={ props.faq } disabled={ props.loading }>
                            <Left style={ [Styles.flex] }>
                                <Text style={ [Styles.textLink, styles.padding] }>FAQ</Text>
                            </Left>
                            <Right style={ [Styles.halfPaddingRight] }>
                                { props.loading && <Spinner size="small" color={ Styles['textKimyaKimya' + titleCase(props.gender)].color } style={ [Styles.heightAuto] }  /> }
                            </Right>
                        </ListItem>
                        <ListItem noIndent onPress={ props.contactus }>
                            <Left style={ [Styles.flex] }>
                                <Text style={ [Styles.textLink, styles.padding] }>Contact Us</Text>
                            </Left>
                            <Right />
                        </ListItem>
                        <ListItem noIndent onPress={ props.terms } disabled={ props.loading }>
                            <Left style={ [Styles.flex] }>
                                <Text style={ [Styles.textLink, styles.padding] }>Terms and Privacy Policy</Text>
                            </Left>
                            <Right style={ [Styles.halfPaddingRight] }>
                                { props.loading && <Spinner size="small" color={ Styles['textKimyaKimya' + titleCase(props.gender)].color } style={ [Styles.heightAuto] }  /> }
                            </Right>
                        </ListItem>
                        <ListItem noIndent onPress={ props.licenses } disabled={ props.loading }>
                            <Left style={ [Styles.flex] }>
                                <Text style={ [Styles.textLink, styles.padding] }>License</Text>
                            </Left>
                            <Right style={ [Styles.halfPaddingRight] }>
                                { props.loading && <Spinner size="small" color={ Styles['textKimyaKimya' + titleCase(props.gender)].color } style={ [Styles.heightAuto] }  /> }
                            </Right>
                        </ListItem>
                        <ListItem noIndent onPress={ props.website } disabled={ props.loading }>
                            <Left style={ [Styles.flex] }>
                                <Text style={ [Styles.textLink, styles.padding] }>Visit Site</Text>
                            </Left>
                            <Right style={ [Styles.halfPaddingRight] }>
                                { props.loading && <Spinner size="small" color={ Styles['textKimyaKimya' + titleCase(props.gender)].color } style={ [Styles.heightAuto] }  /> }
                            </Right>
                        </ListItem>
                    </List>

                    <View style={ [Styles.padding] }>
                        <Text style={ [Styles.textCopyRight, Styles.padding, isAndroid() && { fontFamily: 'sans-serif-thin' }] }>
                            { '\u00A9' + (new Date()).getFullYear() + " KimyaKimya Co Ltd, All rights reseved" }
                        </Text>
                    </View>
                </View>
            </Content>
        </Container>
    );
}

/**
 * Styles
*/
const styles = StyleSheet.create({
    logoContainer: { padding: StatusBar.currentHeight },
    logo: {
        width: 140,
        height: 140
    },
    catchPhrase: { fontSize: 13 },
    padding: { padding: 5 }
});

export default Help;
