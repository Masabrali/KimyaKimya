/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Container, Content, Button, Text } from 'native-base'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import titleCase from '../../utilities/titleCase';
import isEmpty from '../../utilities/isEmpty';
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

const Welcome = function (props) {
    return (
        <Container style={ [Styles.wrapper] }>
            <StatusBar />
            <Content scrollEnabled={ false } contentContainerStyle={ [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch] }>
                <View style={ [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter] }>
                    <View style={ [styles.logoContainer, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter] }>
                        <Image source={ require('../../assets/logo_text.png') } resizeMode="contain" style={ [Styles.imageResizeModeContain, styles.logo] } />
                        <Text style={ [Styles.textAlignCenter, Styles.textLight, styles.catchPhrase, isAndroid() && { fontFamily: 'sans-serif-thin' }] }>Healthy and Enjoyable Moments</Text>
                    </View>
                </View>
                { isEmpty(props.currentUser) && <View style={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch, Styles.padding] }>
                        <Button block onPress={ props.login }>
                            <Text style={ styles.buttonText }>Get Started</Text>
                        </Button>
                    </View>
                }
            </Content>

            <Loader visible={ (props.loading && isEmpty(props.errors)) } spinnerColor={ (props.gender)? Styles['textKimyaKimya' + titleCase(props.gender)].color : undefined } />
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
    instruction: { fontSize: 18 }
});

export default Welcome;
