/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { Container, Content, Button, Text } from 'native-base'; // Version can be specified in package.json

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

const Invite = function (props) {

    return (
        <Container style={ [Styles.wrapper] }>
            <StatusBar />
            <Content scrollEnabled={ false } contentContainerStyle={ [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch] }>
                <View style={ [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter, Styles.padding, Styles.noPaddingTop] }>
                    <Image source={ require('../../assets/logo_text.png') } resizeMode="contain" style={ [Styles.marginBottom, styles.logo] } />
                    <Text style={ [Styles.marginTop, Styles.marginBottom, Styles.textAlignCenter, styles.catchPhrase] }>Just like our Wonderful World, Great things are ment to be enjoyed by all!</Text>
                    <Text style={ [Styles.textAlignCenter, styles.instruction] }>Change lives now. Share KimyaKimya with your friends</Text>
                </View>
                <View style={ [Styles.padding] }>
                    <Button block onPress={ props.invite }>
                        <Text>Start Inviting</Text>
                    </Button>
                </View>
            </Content>

            <Loader visible={ (props.inviting && isEmpty(props.errors)) } text="Inviting Friends..." spinnerColor={ Styles['textKimyaKimya' + titleCase(props.gender)].color } />
        </Container>
    );
}

/**
 * Styles
*/
const styles = StyleSheet.create({
    logo: {
        width: 140,
        height: 140,
        resizeMode: 'contain'
    },
    catchPhrase: { fontSize: 21, maxWidth: 220 },
    instruction: { fontSize: 18, maxWidth: 220 }
});

export default Invite;
