/**
 * Import React and React Native
 */
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Container, Header, Title, Content, Spinner, List, ListItem, Left, Body, Right, Button, Icon, Text } from 'native-base';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions'; // Version can be specified in package.json

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

const AddLocation = function (props) {
    return (
        <Container>
            <Header noShadow style={ [Styles.backgroundHeader] }>
                <Left>
                    <Button iconLeft transparent onPress={ props.back }>
                        <Icon name="arrow-back" ios="ios-arrow-back" android="md-arrow-back" style={ [isAndroid() && Styles.textDark] } />
                        { isIOS() && <Text> Location</Text> }
                    </Button>
                </Left>
                <Body style={ [isAndroid() && Styles.marginLeft, isAndroid() && Styles.paddingLeft] }>
                    <Title style={ [Styles.textDark, Styles.textBold] }>Checkout</Title>
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
                          coordinate={ props.order.hotpoint.location }
                          pinColor={ Styles['textKimyaKimya' + ( (props.gender == 'female')? 'Male' : 'Female' )].color }
                          image={ (props.gender == 'female')? require('../../assets/hotpoint_male.png') : require('../../assets/hotpoint_female.png') }
                          flat={ true }
                        />
                        <MapViewDirections
                          ref={ (directions) => ( this.map_directions = directions ) }
                          origin={ props.order.hotpoint.location }
                          destination={ props.order.location }
                          apikey={ props.GOOGLE_API_KEY }
                          strokeWidth={ 3 }
                          strokeColor={ Styles['textKimyaKimya' + titleCase(props.gender)].color }
                          onStart={ props.mapDirectionsLoading }
                          onReady={ props.mapDirectionsReady }
                          onError={ props.handleError }
                        />
                    </MapView>
                </View>
                <Content contentContainerStyle={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch] }>
                    <View style={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter, Styles.backgroundWrapperTransparent, styles.mapViewOverlay] }>
                        { props.mapLoading && <Spinner color={ Styles['textKimyaKimya' + titleCase(props.gender)].color } /> }
                    </View>
                    <View style={ [Styles.flex, Styles.backgroundWrapper]}>
                        { !props.cartCollapsed &&  <List
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
                            <ListItem noIndent style={ [Styles.noBorderBottom, Styles.doublePaddingTop, Styles.doublePaddingBottom] }>
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
                                        { props.order.location.duration && <Text>
                                                { ((!props.order.location.address)? "Approx. " : "Delivery in approx. ") + props.order.location.duration + " " + props.order.location.durationUnits }
                                            </Text>
                                        }
                                    </Right>
                                }
                                { !props.order.location.address && !props.order.location.duration && <Right style={ [Styles.flex, Styles.paddingRight] }>
                                        <Text>N/A</Text>
                                    </Right>
                                }
                            </ListItem>
                        </List>
                    </View>
                </Content>
            </View>

            <View style={ [Styles.padding, Styles.borderTop] }>
                <Button block onPress={ props.checkout }>
                    <Text>
                        { "Order Now for " + currencyFormat(props.order.amount + props.order.delivery) }
                    </Text>
                </Button>
            </View>

            <Loader visible={ (props.loading && isEmpty(props.errors)) } text="Processing Order..." spinnerColor={ Styles['textKimyaKimya' + titleCase(props.gender)].color } />
        </Container>
    );
}

/**
 * Styles
*/
const styles = StyleSheet.create({
    mapView: { height: 200 },
    mapViewOverlay: { minHeight: 200 },
    locationFormContainer: {
        width: 320
    },
    locationForm: {},
});

export default AddLocation;
