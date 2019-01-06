/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Header, Left, Right, Body, Title, Subtitle, Content, List, ListItem, Button, Icon, Text } from 'native-base';
import Moment from 'moment'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import currencyFormat from '../../utilities/currencyFormat';
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

const QueuedOrder = function (props) {
    return (
        <Container>
            <Header noShadow style={ [Styles.backgroundHeader, Styles.borderBottom] }>
                <Left>
                    <Button iconLeft transparent onPress={ props.back }>
                        <Icon name="arrow-back" ios="ios-arrow-back" android="md-arrow-back" style={ [isAndroid() && Styles.textDark] } />
                        { isIOS() && <Text> Orders</Text> }
                    </Button>
                </Left>
                <Body style={ [isAndroid() && Styles.marginLeft, isAndroid() && Styles.paddingLeft] }>
                    <Title style={ [Styles.textDark, Styles.textBold] }>Queued Order</Title>
                    <Subtitle style={ [Styles.textSecondary, Styles.textBold] }>{ Moment(props.order.date).format('DD MMM YYYY') + " at " + Moment(props.order.date).format('HH:mm') }</Subtitle>
                </Body>
                <Right>
                    <Button iconRight transparent onPress={ props.toggleCart }>
                        { props.cartCollapsed && <Icon name="expand" ios="ios-expand" android="md-expand" style={ [isAndroid() && Styles.textDark] } /> }

                        { !props.cartCollapsed && <Icon name="contract" ios="ios-contract" android="md-contract" style={ [isAndroid() && Styles.textDark] } /> }
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
                                    { props.order.quantity + " Item" + ((props.order.quantity > 1)? "s":"") + ", Totalling" }
                                </Text>
                            </Left>
                            <Right style={ [Styles.flex, Styles.paddingRight] }>
                                <Text style={ [Styles.textAlignRight, Styles.textBold] }>
                                    { currencyFormat(props.order.amount) }
                                </Text>
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
                                        { (!props.order.location.address)? "Delivery Time:" : "Address:" }
                                    </Text>
                                </View>
                                <View style={ [Styles.paddingLeft, Styles.flexColumn, Styles.flexJustifyStart, Styles.flexAlignStretch] }>
                                    { (props.order.location.name || props.order.location.address) && <Text style={ [Styles.marginBottom] }>
                                            { props.order.location.name + ', ' + props.order.location.address }
                                        </Text>
                                    }
                                    { props.order.location.duration && <Text style={ [Styles.paddingRight, Styles.marginRight, Styles.marginBottom, Styles.width100] }>
                                            { ((!props.order.location.address)? "Approx. " : "Delivery in approx. ") + props.duration + " " + props.durationUnits }
                                        </Text>
                                    }
                                    <View style={ [Styles.marginTop, Styles.paddingRight, Styles.marginRight, Styles.width100, Styles.flexRow, Styles.flexJustifyEnd, Styles.flexAlignCenter, { marginLeft: -5 }] }>
                                        <Text style={ [Styles.flex] }>Contact:</Text>
                                        <Button transparent onPress={ props.messageHotpoint }>
                                            <Icon name="chatbubbles" ios="ios-chatbubbles" android="md-chatbubbles" />
                                        </Button>
                                        <Button success transparent onPress={ props.callHotpoint } style={ [Styles.marginLeft] }>
                                            <Icon name="call" ios="ios-call" android="md-call" />
                                        </Button>
                                    </View>
                                </View>
                            </Left>
                            { !props.order.location.address && !props.order.location.duration && <Right style={ [Styles.paddingRight] }>
                                    <Text>N/A</Text>
                                </Right>
                            }
                            { (props.order.location.address && props.order.location.duration) && <Right /> }
                        </View>
                    </ListItem>
                </List>
            </Content>

            <View style={ [Styles.padding, Styles.borderTop] }>
                <Button block onPress={ props.confirmOrderDelivery }>
                    <Text>Confirm Order Delivery</Text>
                </Button>
            </View>

            <Loader visible={ props.loading && isEmpty(props.errors) } text="Confirming Delivery..." spinnerColor={ (props.gender == 'female')? Styles.textKimyaKimyaFemale.color : Styles.textKimyaKimyaMale.color } />
        </Container>
    );
}

/**
 * Styles
*/
const styles = StyleSheet.create({
    title: { fontSize: 18 },
    time: { fontSize: 24 }
});

export default QueuedOrder;
