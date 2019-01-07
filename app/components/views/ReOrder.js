/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, ActionSheet, Header, Left, Right, Body, Title, Subtitle, Content, List, ListItem, Button, Icon, Text } from 'native-base';
import Moment from 'moment'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import isEmpty from '../../utilities/isEmpty';
import currencyFormat from '../../utilities/currencyFormat';
import titleCase from '../../utilities/titleCase';
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

const ReOrder = function (props) {
    return (
        <Container>
            <Header noShadow style={ [Styles.backgroundHeader, Styles.borderBottom] }>
                <Left>
                    <Button iconLeft transparent onPress={ props.back }>
                        <Icon name="arrow-back" ios="ios-arrow-back" android="md-arrow-back" style={ [isAndroid() && Styles.textDark] } />
                        { isIOS() && <Text>Orders</Text> }
                    </Button>
                </Left>
                <Body style={ [isAndroid() && Styles.marginLeft, isAndroid() && Styles.paddingLeft] }>
                    <Title style={ [Styles.textDark, Styles.textBold] }>{ ((props.order.draft)? "Draft":"Previous") + " Order" }</Title>
                    <Subtitle style={ [Styles.textSecondary, Styles.textBold] }>{ Moment(props.order.date).format('DD MMM YYYY') + " at " + Moment(props.order.date).format('HH:mm') }</Subtitle>
                </Body>
                <Right style={ [Styles.flex, Styles.flexRow, Styles.flexJustifyEnd, Styles.flexAlignCenter] }>
                    <Button iconRight transparent onPress={ props.toggleCart }>
                        { props.cartCollapsed && <Icon name="expand" ios="ios-expand" android="md-expand" style={ [isAndroid() && Styles.textDark] } /> }

                        { !props.cartCollapsed && <Icon name="contract" ios="ios-contract" android="md-contract" style={ [isAndroid() && Styles.textDark] } /> }
                    </Button>
                    <Button iconRight transparent onPress={ () => {

                            let options = [
                                { text: (props.order.draft)? 'Keep in Draft Orders' : 'Keep in Previous Orders', icon: (props.order.draft)? 'exit' : 'list', iconColor: isAndroid() && Styles.textPrimary.color },
                                { text: 'Delete', icon: 'trash', iconColor: isAndroid() && Styles.textDanger.color },
                                { text: 'Cancel', icon: (isAndroid())? 'close-circle' : 'close-circle-outline', iconColor: isAndroid() && Styles.textPrimary.color }
                            ];

                            if (props._order.products.length === 0)
                                options.unshift({ text: (props.order.draft)? 'Continue Ordering' : 'Re-Order Now for ' + currencyFormat(props.order.amount + props.order.delivery), icon: 'cart', iconColor: isAndroid() && Styles.textPrimary.color });

                            ActionSheet.show({
                                options,
                                cancelButtonIndex: (props._order.products.length === 0)? 3 : 2,
                                destructiveButtonIndex: (props._order.products.length === 0)? 2 : 1,
                                title: (props.order.draft)? "Draft Order Options" : "Previous Order Options"
                            }, (index) => {

                                if (index == 0 && props._order.products.length === 0) return props.reOrder(props.order);
                                else if ((index == 1 && props._order.products.length !== 0) || (index == 2 && props._order.products.length === 0))
                                    return props.delete();

                                return;
                            });
                        }
                    }>
                        <Icon name="more" ios="ios-more" android="md-more" style={ [isAndroid() && Styles.textDark] } />
                    </Button>
                </Right>
            </Header>

            <StatusBar />

            <Content contentContainerStyle={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch] }>
                { !props.cartCollapsed && <List
                      contentContainerStyle={ [Styles.table] }
                      dataArray={ props.order.products }
                      renderRow={ (product) =>
                          <ListItem key={ product.id }>
                              <View style={ [Styles.row, Styles.paddingTop, Styles.paddingBottom] }>
                                  <Left>
                                      <Text numberOfLines={1} style={ [Styles.textAlignLeft] }>{ product.quantity + "  " + product.name }</Text>
                                  </Left>
                                  <Right style={ [Styles.flex] }>
                                      <Text style={ [Styles.textAlignRight] }>{ currencyFormat(product.amount) }</Text>
                                  </Right>
                              </View>
                          </ListItem>
                      }
                    />
                }
                <List contentContainerStyle={ [Styles.table] }>
                    <ListItem noIndent>
                        <View style={ [Styles.row, Styles.paddingTop, Styles.paddingBottom] }>
                            <Left>
                                <Text style={ [Styles.textAlignLeft, Styles.textBold] }>
                                    { props.order.quantity + " Items, Totalling" }
                                </Text>
                            </Left>
                            <Right style={ [Styles.flex, Styles.paddingRight] }>
                                <Text style={ [Styles.textAlignRight, Styles.textBold] }>{ currencyFormat(props.order.amount) }</Text>
                            </Right>
                        </View>
                    </ListItem>
                    <ListItem noIndent>
                        <View style={ [Styles.row, Styles.paddingTop, Styles.paddingBottom] }>
                            <Left>
                                <Text style={ [Styles.textAlignLeft, Styles.textBold] }>Delivery</Text>
                            </Left>
                            <Right style={ [Styles.flex, Styles.paddingRight] }>
                                <Text style={ [Styles.textAlignRight, Styles.textBold] }>
                                    { currencyFormat(props.order.delivery) }
                                </Text>
                            </Right>
                        </View>
                    </ListItem>
                    <ListItem noIndent>
                        <View style={ [Styles.row, Styles.paddingTop, Styles.paddingBottom] }>
                            <Left>
                                <Text style={ [Styles.textAlignLeft, Styles.textBold] }>Grand Total</Text>
                            </Left>
                            <Right style={ [Styles.flex, Styles.paddingRight] }>
                                <Text style={ [Styles.textAlignRight, Styles.textBold] }>
                                    { currencyFormat(props.order.amount + props.order.delivery) }
                                </Text>
                            </Right>
                        </View>
                    </ListItem>
                    <ListItem itemDivider></ListItem>
                    <ListItem noIndent style={ [Styles.noBorderBottom] }>
                        <View style={ [Styles.row, Styles.paddingTop, Styles.paddingBottom] }>
                            <Left>
                                <View>
                                    <Text style={ [Styles.textBold] }>
                                        { (props.order.location && !props.order.location.address)? "Delivery Time:" : "Address:" }
                                    </Text>
                                </View>
                                { props.order.location && <View style={ [Styles.paddingLeft, Styles.flexColumn, Styles.flexJustifyStart, Styles.flexAlignStretch] }>
                                        { (props.order.location.name || props.order.location.address) && <Text style={ [Styles.marginBottom] }>
                                                { props.order.location.name + ', ' + props.order.location.address }
                                            </Text>
                                        }
                                        { props.order.location.duration && <Text style={ [Styles.paddingRight, Styles.marginRight, Styles.width100] }>
                                                { ((!props.order.location.address)? "Approx. " : "Delivered in approx. ") + props.order.location.duration + " " + props.order.location.durationUnits }
                                            </Text>
                                        }
                                    </View>
                                }
                            </Left>
                            { ( !props.order.location || (!props.order.location.address && !props.order.location.duration) ) && <Right style={ [Styles.paddingRight] }>
                                    <Text>N/A</Text>
                                </Right>
                            }
                            { ( props.order.location && (props.order.location.address || props.order.location.duration) ) && <Right /> }
                        </View>
                    </ListItem>
                </List>
            </Content>

            <View style={ [Styles.padding, Styles.borderTop] }>
                <Button block onPress={ () => ( props.reOrder(props.order) ) } disabled={ (props._order.products.length !== 0 || props.loading) }>
                    <Text>
                        { (props.order.draft)? "Continue Ordering" : "Re-Order Now for " + currencyFormat(props.order.amount + props.order.delivery) }
                    </Text>
                </Button>
            </View>

            <Loader visible={ props.loading && isEmpty(props.errors) } text="Deleting Order..." spinnerColor={ Styles.textDanger.color } />
        </Container>
    );
}

/**
 * Styles
*/
const styles = StyleSheet.create({});

export default ReOrder;
