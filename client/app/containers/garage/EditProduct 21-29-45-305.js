/**
 * Import React and React Native
 */
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
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

const EditProduct = function (props) {
    return (
        <Container>
            <StatusBar barStyle="light-content" />
            <AnimatedHeader
              style={ [Styles.flex] }
              title={ props.product.name }
              titleStyle={{ fontSize: 22, left: 20, bottom: 20, color: '#ffffff' }}
              renderLeft={() => (
                  <Button light iconLeft transparent onPress={ props.back }>
                      <Icon name="arrow-back" ios="ios-arrow-back" android="md-arrow-back" style={ [styles.backIcon] } />
                      { isIOS() && <Text>Order</Text> }
                  </Button>
              )}
              renderRight={ () =>
                  <Button light iconRight transparent onPress={ props.productInformation }>
                      <Icon name={ (isAndroid())? "information-circle" : "information-circle-outline" } ios={ (isIOS())? "ios-information-circle-outline" : "" } android={ (isAndroid())? "md-information-circle" : "" } style={ [styles.headerIcon] } />
                  </Button>
              }
              headerMaxHeight={300}
              imageSource={{ uri: props.product.cover }}
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
                                <Right>
                                    <Picker
                                      mode="dropdown"
                                      iosIcon={ <Icon name="ios-arrow-down" ios="ios-arrow-down" android="md-arrow-down" /> }
                                      placeholder={ "Select " + titleCase(props.product.category) + " type" }
                                      titleIOS={ "Select " + titleCase(props.product.category) + " type" }
                                      onValueChange={ props.typeChanged }
                                      selectedValue={ props.type }
                                    >
                                        {
                                            props.product.types.map((type) => {
                                                return (<Picker.Item key={ type.id } label={ type.name } value={ type } />);
                                            })
                                        }
                                    </Picker>
                                </Right>
                            </Item>
                        }

                        <Item fixedLabel block icon style={ [Styles.marginBottom] } error={ !!props.errors.quantity }>
                            <Label>Quantity</Label>
                            <Right style={ [Styles.flexRow, Styles.flexJustifyCenter] }>
                                <Button iconRight transparent onPress={ props.decreaseQuantity }>
                                    <Icon name={ (isAndroid)? "remove-circle" : "remove-circle-outline" } ios={ (isIOS())? "ios-remove-circle-outline" : "" } android={ (isAndroid)? "md-remove-circle" : "" } />
                                </Button>

                                <Input
                                  keyboardType="number-pad"
                                  defaultValue={ props.quantity.toString() }
                                  value={ props.quantity.toString() }
                                  onChangeText={ props.quantityChanged }
                                  style={ [Styles.textBold, Styles.textAlignCenter, styles.quantityInput] }
                                />

                                <Button iconLeft transparent onPress={ props.increaseQuantity }>
                                    <Icon name={ (isAndroid)? "add-circle" : "add-circle-outline" } ios={ (isIOS())? "ios-add-circle-outline" : "" } android={ (isAndroid)? "md-add-circle" : "" } />
                                </Button>
                            </Right>
                        </Item>

                        <Text></Text>

                        <Button block onPress={ props.edit }>
                            <Text>{ "Change Amount to " + currencyFormat(props.product.price * props.quantity) }</Text>
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
    backIcon: { fontSize: 24 },
    productForm: {},
    quantityInput: { fontSize: 20 },
});

export default EditProduct;
