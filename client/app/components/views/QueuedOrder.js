/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Header, Left, Right, Body, Title, Subtitle, Content, Spinner, List, ListItem, Button, Icon, Text } from 'native-base';
import Moment from 'moment';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import titleCase from '../../utilities/titleCase';
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
            <Header noShadow style={ [Styles.backgroundHeader] }>
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

            <View style={ [Styles.flex] }>
                <View style={ [Styles.positionAbsolute, Styles.verticalPositionTop, Styles.horizontalPositionLeft, Styles.horizontalPositionRight, styles.mapView] }>
                    <MapView
                      ref={ (map) => ( this.map = map ) }
                      provider={ (isAndroid())? PROVIDER_GOOGLE : null }
                      scrollEnabled={ (isIOS())? false : true }
                      style={ [Styles.absoluteFillObject, Styles.flex] }
                      initialRegion={ props.order.location }
                      onMapReady={ (e) => (
                          props.mapReady(this.map, this.marker, this.hotpoint_marker, this.map_directions)
                      ) }
                    >
                        <MapView.Marker
                          ref={ (marker) => ( this.marker = marker ) }
                          coordinate={ props.order.location }
                          pinColor={ Styles['textKimyaKimya' + titleCase(props.gender)].color }
                          image={ (props.gender == 'female')? require('../../assets/marker_female.png') : require('../../assets/marker_male.png') }
                        />
                        <MapView.Marker
                          ref={ (marker) => ( this.hotpoint_marker = marker ) }
                          coordinate={ props.hotpoint.location }
                          pinColor={ Styles['textKimyaKimya' + ( (props.gender == 'female')? 'Male' : 'Female' )].color }
                          image={ (props.gender == 'female')? require('../../assets/hotpoint_male.png') : require('../../assets/hotpoint_female.png') }
                          flat={ true }
                        />
                        <MapViewDirections
                          ref={ (directions) => ( this.map_directions = directions ) }
                          origin={ props.hotpoint.location }
                          destination={ props.order.location }
                          apikey={ props.GOOGLE_API_KEY }
                          strokeWidth={ 3 }
                          strokeColor={ Styles['textKimyaKimya' + titleCase(props.gender)].color }
                          onStart={ props.mapDirectionsLoading }
                          onReady={ props.mapDirectionsReady }
                          onError={ props.handleMapDirectionsError }
                        />
                    </MapView>
                </View>
                <Content contentContainerStyle={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch] }>
                    <View style={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter, Styles.backgroundWrapperTransparent, styles.mapViewOverlay] }>
                        { props.mapLoading && <Spinner color={ Styles['textKimyaKimya' + titleCase(props.gender)].color } /> }
                    </View>
                    <View style={ [Styles.flex, Styles.backgroundWrapper]}>
                        { !props.cartCollapsed && <List
                              dataArray={ props.order.products }
                              renderRow={ (product) =>
                                  <ListItem key={ product.id } style={ [Styles.doublePaddingTop, Styles.doublePaddingBottom] }>
                                      <Left>
                                          <Text numberOfLines={1} style={ [Styles.textAlignLeft] }>{ product.quantity + "  " + product.name }</Text>
                                      </Left>
                                      <Right style={ [Styles.flex, Styles.halfPaddingRight] }>
                                          <Text style={ [Styles.textAlignRight] }>{ currencyFormat(product.amount) }</Text>
                                      </Right>
                                  </ListItem>
                              }
                            />
                        }
                        <List>
                            <ListItem noIndent style={ [Styles.doublePaddingTop, Styles.doublePaddingBottom] }>
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
                            </ListItem>
                            <ListItem noIndent style={ [Styles.doublePaddingTop, Styles.doublePaddingBottom] }>
                                <Left>
                                    <Text style={ [Styles.textAlignLeft, Styles.textBold] }>Delivery</Text>
                                </Left>
                                <Right style={ [Styles.flex, Styles.paddingRight] }>
                                    <Text style={ [Styles.textAlignRight, Styles.textBold] }>
                                        { currencyFormat(props.order.delivery) }
                                    </Text>
                                </Right>
                            </ListItem>
                            <ListItem noIndent style={ [Styles.doublePaddingTop, Styles.doublePaddingBottom] }>
                                <Left>
                                    <Text style={ [Styles.textAlignLeft, Styles.textBold] }>Grand Total</Text>
                                </Left>
                                <Right style={ [Styles.flex, Styles.paddingRight] }>
                                    <Text style={ [Styles.textAlignRight, Styles.textBold] }>
                                        { currencyFormat(props.order.amount + props.order.delivery) }
                                    </Text>
                                </Right>
                            </ListItem>
                            <ListItem itemDivider></ListItem>
                            <ListItem noIndent style={ [Styles.doublePaddingTop, Styles.doublePaddingBottom] }>
                                <Left style={ [Styles.height100, Styles.flexColumn, Styles.flexJustifyStart, Styles.flexAlignStart, { maxWidth: 80 }] }>
                                    <Text style={ [Styles.textBold, Styles.textLeft, Styles.width100] }>
                                        { (!props.order.location.address)? "Delivery" : "Address" }
                                    </Text>
                                </Left>
                                { (props.order.location.address || props.order.location.duration) && <Right style={ [Styles.flex, Styles.paddingRight] }>
                                        { (props.order.location.name || props.order.location.address) && <Text>
                                                { props.order.location.name + ', ' + props.order.location.address }
                                            </Text>
                                        }
                                        { props.order.location.duration && props.order.location.duration != 0 && <Text>
                                                { ((!props.order.location.address)? "Approx. " : "Delivery in approx. ") + props.duration + " " + props.durationUnits }
                                            </Text>
                                        }
                                        { props.order.location.duration && props.order.location.duration == 0 && <Text>
                                                Order has arrived
                                            </Text>
                                        }
                                    </Right>
                                }
                                { !props.order.location.address && !props.order.location.duration && <Right style={ [Styles.flex, Styles.paddingRight] }>
                                        <Text>N/A</Text>
                                    </Right>
                                }
                            </ListItem>
                            <ListItem noIndent style={ [Styles.noBorderBottom] }>
                                <Left>
                                    <Text style={ [Styles.textAlignLeft, Styles.textBold] }>Contact Hotpoint</Text>
                                </Left>
                                <Right style={ [Styles.flex, Styles.flexRow, Styles.flexJustifyEnd, Styles.flexAlignCenter, Styles.paddingRight] }>
                                    <Button transparent onPress={ props.messageHotpoint }>
                                        <Icon name="chatbubbles" ios="ios-chatbubbles" android="md-chatbubbles" />
                                    </Button>
                                    <Button success transparent onPress={ props.callHotpoint } style={ [Styles.marginLeft] }>
                                        <Icon name="call" ios="ios-call" android="md-call" />
                                    </Button>
                                </Right>
                            </ListItem>
                        </List>
                    </View>
                </Content>
            </View>

            <View style={ [Styles.padding, Styles.borderTop] }>
                <Button block onPress={ props.confirmOrder } disabled={ props.duration > 0 }>
                    <Text>Confirm Order Delivery</Text>
                </Button>
            </View>

            <Loader visible={ props.loading && isEmpty(props.errors) } text="Confirming Delivery..." spinnerColor={ Styles['textKimyaKimya' + titleCase(props.gender)].color } />
        </Container>
    );
}

/**
 * Styles
*/
const styles = StyleSheet.create({
    mapView: { height: 200 },
    mapViewOverlay: { minHeight: 200 },
    title: { fontSize: 18 },
    time: { fontSize: 24 }
});

export default QueuedOrder;
