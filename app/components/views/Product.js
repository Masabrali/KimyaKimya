/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Left, Right, Content, Button, Icon, Text, Form, Item, Label, Input, Picker } from 'native-base';
import AnimatedHeader from 'react-native-animated-header'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import titleCase from '../../utilities/titleCase';
import currencyFormat from '../../utilities/currencyFormat';
import isIOS from '../../utilities/isIOS';
import isAndroid from '../../utilities/isAndroid';

/**
 * Import other components
*/

/**
 * Other variables and constants
*/
import Styles from '../styles';

const Product = function (props) {
    return (
        <Container>
            <AnimatedHeader
              style={ [Styles.flex] }
              title={ props.product.name }
              titleStyle={{ fontSize: 22, left: 20, bottom: 20, color: Styles.textDark.color }}
              renderLeft={ () =>
                  <Button light iconLeft transparent onPress={ props.back }>
                      <Icon name="arrow-back" ios="ios-arrow-back" android="md-arrow-back" style={ [Styles.textDark, styles.headerIcon] } />
                      { isIOS() && <Text styles={ [Styles.textDark] }>{ (this.props.action == 'edit')? 'Order' : 'Shop' }</Text> }
                  </Button>
              }
              headerMaxHeight={300}
              imageSource={ (props.product.cover && props.product.cover != '')? { uri: props.product.cover } : props.cover }
              toolBarColor={ (isIOS())? 'transparent' : Styles.backgroundStatusBar.backgroundColor }
            >
                <Content contentContainerStyle={ [Styles.flexColumn, Styles.flexjustifyCenter, Styles.flexAlignCenter] }>

                    {
                        (props.errors.global !== undefined || props.errors.quantity !== '') && <View style={ [Styles.padding, Styles.flexAlignCenter] }>
                          { !!props.errors.global && <Text style={ [Styles.textError] }>{ props.errors.global.type + " " + props.errors.global.message }</Text> }
                          { !!props.errors.quantity && <Text style={ [Styles.textError] }>{ props.errors.quantity }</Text> }
                        </View>
                    }

                    <Form block style={ [Styles.padding, Styles.noPaddingTop, styles.productForm] }>

                        { props.product.types && <Item fixedLabel block icon picker style={ [Styles.paddingLeft, Styles.marginBottom] }>
                                <Label>Type</Label>
                                <Picker
                                  mode="dropdown"
                                  iosIcon={ <Icon name="ios-arrow-down" ios="ios-arrow-down" android="md-arrow-down" /> }
                                  placeholder={ "Select " + titleCase(props.product.category) + " type" }
                                  titleIOS={ "Select " + titleCase(props.product.category) + " type" }
                                  onValueChange={ props.typeChanged }
                                  selectedValue={ props.type }
                                >
                                    {
                                        props.product.types.map( (type) => {

                                                type = { ...type };

                                                return (<Picker.Item key={ type.id } label={ type.name } value={ type } />);
                                            }
                                        )
                                    }
                                </Picker>
                            </Item>
                        }

                        <Item fixedLabel block icon style={ [Styles.marginBottom, Styles.marginRight] } error={ !!props.errors.quantity }>
                            <Label>Quantity</Label>
                            <Right style={ [Styles.flex, Styles.flexRow, Styles.flexJustifyCenter] }>
                                <Button iconRight transparent onPress={ props.decreaseQuantity }>
                                    <Icon name={ (isAndroid)? "remove-circle" : "remove-circle-outline" } ios={ (isIOS())? "ios-remove-circle-outline" : "" } android={ (isAndroid)? "md-remove-circle" : "" } />
                                </Button>

                                <Text style={ [Styles.flex, Styles.textBold, Styles.textAlignCenter, styles.quantityInput] }>
                                    { props.quantity.toString() }
                                </Text>

                                <Button iconLeft transparent onPress={ props.increaseQuantity }>
                                    <Icon name={ (isAndroid)? "add-circle" : "add-circle-outline" } ios={ (isIOS())? "ios-add-circle-outline" : "" } android={ (isAndroid)? "md-add-circle" : "" } />
                                </Button>
                            </Right>
                        </Item>

                        <Text />

                        <Button block onPress={ props.action }>
                            <Text>{ "Add to Order for " + currencyFormat(props.product.price * props.quantity) }</Text>
                        </Button>
                    </Form>
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
    productForm: {},
    quantityInput: {
        fontSize: 20,
        padding: 12
    }
});

export default Product;
