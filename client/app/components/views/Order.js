/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, ActionSheet, Header, Left, Right, Body, Title, Content, List, ListItem, Button, Icon, Text } from 'native-base'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import currencyFormat from '../../utilities/currencyFormat';
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

const Order = function (props) {
    return (
        <Container>
            <Header noShadow style={ [Styles.backgroundHeader, Styles.borderBottom] }>
                <Left>
                    <Button iconLeft transparent onPress={ props.back }>
                        <Icon name="close" ios="ios-close" android="md-close" style={ [isAndroid() && Styles.textDark] } />
                        { isIOS() && props._previous && <Text>{ props.previous }</Text> }
                    </Button>
                </Left>
                <Body style={ [isAndroid() && Styles.marginLeft, isAndroid() && Styles.paddingLeft] }>
                    <Title style={ [Styles.textDark, Styles.textBold] }>Your Order</Title>
                </Body>
                <Right>
                    <Button iconRight transparent onPress={ props.draft }>
                        { isIOS() && <Text>Draft</Text> }
                        <Icon name="exit" ios="ios-exit" android="md-exit" style={ [isAndroid() && Styles.textDark] } />
                    </Button>
                </Right>
            </Header>

            <StatusBar />

            <Content contentContainerStyle={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch] }>
                <List
                  disableRightSwipe={ true }
                  rightOpenValue={-75}
                  contentContainerStyle={ [Styles.table] }
                  dataArray={ props.order.products }
                  dataSource={ props.dataSource.cloneWithRows(props.order.products) }
                  renderRow={ (product) =>
                      <ListItem noIndent key={ product.id }>
                          <View style={ [Styles.row, Styles.paddingTop, Styles.paddingBottom] }>
                              <Left>
                                  <Text style={ [Styles.textAlignLeft] }>{ product.quantity + "  " + product.name }</Text>
                              </Left>
                              <Right>
                                  <Text style={ [Styles.textAlignRight] }>{ currencyFormat(product.amount) }</Text>
                              </Right>
                          </View>
                      </ListItem>
                  }
                  renderRightHiddenRow={ (product, secId, rowId, rowMap) =>
                      <Button vertical icon light onPress={ () =>
                          ActionSheet.show({
                              options: [
                                  { text: 'Edit', icon: 'create', iconColor: isAndroid() && Styles.textPrimary.color },
                                  { text: 'Remove', icon: 'trash', iconColor: isAndroid() && Styles.textDanger.color },
                                  { text: 'Cancel', icon: (isAndroid())? 'close-circle' : 'close-circle-outline', iconColor: isAndroid() && Styles.textPrimary.color }
                              ],
                              cancelButtonIndex: 2,
                              destructiveButtonIndex: 1,
                              title: "Order Item Options"
                          },
                          (index) => {

                              if (index == 0)
                                  return props.editProduct(product, secId, rowId, rowMap);
                              else if (index == 1)
                                  return props.remove(product, secId, rowId, rowMap);

                              return rowMap[`${secId}${rowId}`].props.closeRow();
                          })
                      }>
                          <Icon name="more" ios="ios-more" android="md-more" />
                      </Button>
                  }
                />

                <Text></Text>

                <View style={ [Styles.flexRow, Styles.flexJustifyCenter, Styles.padding] }>
                    <Button bordered block onPress={ props.shop }>
                        <Text>Add More Products</Text>
                    </Button>
                </View>
            </Content>

            <View style={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch] }>
                <List contentContainerStyle={ [Styles.table] }>
                    <ListItem noIndent>
                        <View style={ [Styles.row, Styles.paddingTop, Styles.paddingBottom] }>
                            <Left>
                                <Text style={ [Styles.textAlignLeft, Styles.textBold] }>
                                    { props.order.quantity + " Item" + ((props.order.quantity > 1)? "s":"") + ", Totalling" }
                                </Text>
                            </Left>
                            <Right style={ [Styles.flex, Styles.paddingRight] }>
                                <Text style={ [Styles.textAlignRight, Styles.textBold] }>{ currencyFormat(props.order.amount) }</Text>
                            </Right>
                        </View>
                    </ListItem>
                </List>
            </View>

            <View style={ [Styles.padding] }>
                <Button block onPress={ props.checkout }>
                    <Text>Set Delivery Location</Text>
                </Button>
            </View>

            <Loader visible={ props.loading && isEmpty(props.errors) } text="Drafting Order..." spinnerColor={ Styles['textKimyaKimya' + titleCase(props.gender)].color } />
        </Container>
    );
}

/**
 * Styles
*/
const styles = StyleSheet.create({});

export default Order;
