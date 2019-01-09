/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { Container, Header, Body, Title, Content, Button, Icon, Text, Form } from 'native-base'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import titleCase from '../../utilities/titleCase';
import isEmpty from '../../utilities/isEmpty';
import isAndroid from '../../utilities/isAndroid';
import isIOS from '../../utilities/isIOS';

/**
 * Import other components
*/
import Loader from '../others/Loader';
import StatusBar from '../../components/others/StatusBar';

/**
 * Other variables and constants
*/
import Styles from '../styles';

const Gender = function (props) {

    return (
        <Container style={ [Styles.wrapper] }>
            { (props.hideNavBar || props.action == 'gender') && <Header noShadow style={ [Styles.backgroundHeader, Styles.borderBottom] }>
                    <Body style={ [isAndroid() && Styles.paddingLeft] }>
                        <Title style={ [Styles.textDark, Styles.textBold] }>Your Gender</Title>
                    </Body>
                </Header>
            }

            <StatusBar />

            <Content padder contentContainerStyle={ [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch] }>

                <Text style={ [Styles.textAlignCenter, Styles.padding, Styles.marginTop, styles.instruction] }>
                    { (props.action != 'edit') && "Select your Gender to Continue:" }
                    { (props.action == 'edit') && "Select your Gender below:" }
                </Text>

                <Form block style={ [Styles.padding, styles.genderForm] }>

                    <View style={ [Styles.flexRow, Styles.flexJustifySpaceEvenly, Styles.padding, Styles.marginBottom, styles.genderSelect] }>
                        <TouchableWithoutFeedback onPress={ () => props.genderChanged('male') }>
                            <View style={ [Styles.textBold, styles.genderItem, (props._gender == 'male')? styles.genderMaleSelected : styles.genderMale] }>
                                <Icon name="male" active fontSize={ 24 } style={ [Styles.textBold, (props._gender == 'male')? styles.genderMaleIconSelected : styles.genderMaleIcon] } />

                                <Text style={ [Styles.textBold, (props._gender == 'male')? styles.genderMaleLabelSelected : styles.genderMaleLabel] }>Male</Text>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={ () => props.genderChanged('female') }>
                            <View style={ [Styles.textBold, styles.genderItem, (props._gender == 'female')? styles.genderFemaleSelected : styles.genderFemale] }>
                                <Icon name="female" active fontSize={ 24 } style={ [Styles.textBold, (props._gender == 'female')? styles.genderFemaleIconSelected : styles.genderFemaleIcon] } />

                                <Text style={ [Styles.textBold, (props._gender == 'female')? styles.genderFemaleLabelSelected : styles.genderFemaleLabel] }>Female</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    { !isEmpty(props.errors.gender) && <Text style={ [Styles.textError, Styles.marginBottom] }>{ props.errors.gender }</Text> }

                    <Button block style={ [Styles.marginTop] } onPress={ props.gender }>
                        <Text>{ (props.action == 'edit')? "Change" : "Continue" }</Text>
                    </Button>
                </Form>

                <Loader visible={ props.loading && isEmpty(props.errors) } text={ (props.action == 'edit')? "Changing Your Gender" : "Setting up Your Gender" } spinnerColor={ Styles['textKimyaKimya' + titleCase(props._gender)].color } />
            </Content>
        </Container>
    );
}

/**
 * Styles
*/
const styles = StyleSheet.create({
    instruction: { fontSize: 18 },
    genderForm: {},
    genderSelect: {},
    genderItem: {
        fontSize: 20,
        borderWidth: 2,
        borderRadius: 10,
        padding: 18,
        width: 100,
        alignItems: 'center'
    },
    genderMale: {
        borderColor: '#06aad5',
        marginRight: 20
    },
    genderMaleSelected: {
        borderColor: '#06aad5',
        backgroundColor: '#06aad5',
        marginRight: 20
    },
    genderFemale: {
        borderColor: '#ed2593',
        marginLeft: 20
    },
    genderFemaleSelected: {
        borderColor: '#ed2593',
        backgroundColor: '#ed2593',
        marginLeft: 20
    },
    genderMaleIcon: { color: '#06aad5' },
    genderMaleIconSelected: { color: 'white' },
    genderFemaleIcon: { color: '#ed2593' },
    genderFemaleIconSelected: { color: 'white' },
    genderMaleLabel: { color: '#06aad5' },
    genderMaleLabelSelected: { color: 'white' },
    genderFemaleLabel: { color: '#ed2593' },
    genderFemaleLabelSelected: { color: 'white' }
});

export default Gender;
