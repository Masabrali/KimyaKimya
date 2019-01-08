/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import { Container, Header, Body, Title, Content, Text, Spinner } from 'native-base';
import _ from 'lodash'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import isEmpty from '../../utilities/isEmpty';

/**
 * Import other components
*/

/**
 * Other variables and constants
*/
import Styles from '../styles';

const Loader = function (props) {
    return (
        <Modal animationType='none' transparent={ true } visible={ props.visible } onRequestClose={_.noop}>
            <Container style={ [Styles.loader] }>

                {
                    !isEmpty(props.title) && <Header noShadow style={ [Styles.backgroundTransparent] }>
                        <Body style={ [Styles.paddingLeft] }>
                            <Title style={ [Styles.textDark, Styles.textBold] }>{ props.title }</Title>
                        </Body>
                    </Header>
                }

                <Content padder contentContainerStyle={ [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter, Styles.padding] }>
                    <Spinner color={ props.spinnerColor || Styles.textLabel.color } />

                    <Text style={ [Styles.padding, Styles.textAlignCenter, styles.loaderText, { color: props.textColor || Styles.textLabel.color }] }>{ (props.text)? props.text : 'Loading...' }</Text>
                </Content>

            </Container>
        </Modal>
    );
}

/**
 * Styles
*/
const styles = StyleSheet.create({
    loaderText: { fontSize: 20 }
});

export default Loader;
