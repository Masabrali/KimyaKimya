/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Left, Right, Content, Button, Icon, Text } from 'native-base';
import AnimatedHeader from 'react-native-animated-header'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import titleCase from '../../utilities/titleCase';
import isIOS from '../../utilities/isIOS';

/**
 * Import other components
*/

/**
 * Other variables and constants
*/
import Styles from '../styles';

const ProductInformation = function (props) {
    return (
        <Container style={ [Styles.screenHeight] }>
            <AnimatedHeader
              style={ [Styles.flex] }
              title={ props.product.name + " details" }
              titleStyle={{ fontSize: 22, left: 20, bottom: 20, color: Styles.textDark.color }}
              renderLeft={ () =>
                  <Button light iconLeft transparent onPress={ props.back }>
                      <Icon name="arrow-back" ios="ios-arrow-back" android="md-arrow-back" style={ [Styles.textDark, styles.headerIcon] } />
                      { isIOS() && <Text style={ [Styles.textDark] }>{ props.product.name }</Text> }
                  </Button>
              }
              headerMaxHeight={300}
              imageSource={ (props.product.cover && props.product.cover != '')? { uri: props.product.cover } : props.cover }
              toolBarColor={ (isIOS())? 'transparent' : Styles.backgroundStatusBar.backgroundColor }
            >
                <Content padder contentContainerStyle={ [Styles.flex, Styles.flexColumn, Styles.flexjustifyCenter, Styles.flexAlignCenter] }>
                    <Text style={ [Styles.padding, styles.bodyText] }>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
                </Content>
            </AnimatedHeader>
        </Container>
    );
}

/**
 * Styles
*/
const styles = StyleSheet.create({
    headerIcon: { fontSize: 24 },
    bodyText: { fontSize: 18 }
});

export default ProductInformation;
