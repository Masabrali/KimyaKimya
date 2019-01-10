/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Header, Left, Right, Body, Title, Subtitle, Content, Spinner, Button, Icon, Text } from 'native-base';
import Moment from 'moment';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions'; // Version can be specified in package.json

/**
* Import Utilities
*/
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

const OrderStatus = function (props) {
    return (
        <Container style={ [Styles.backgroundWrapper] }>
            <Header noShadow style={ [Styles.backgroundHeader] }>
                <Body style={ [isAndroid() && Styles.marginLeft, isAndroid() && Styles.paddingLeft] }>
                    <Title style={ [Styles.textDark, Styles.textBold] }>Queued Order</Title>
                    <Subtitle style={ [Styles.textSecondary, Styles.textBold] }>{ Moment(props.order.date).format('DD MMM YYYY') + " at " + Moment(props.order.date).format('HH:mm')}</Subtitle>
                </Body>
                <Right>
                    <Button iconRight transparent onPress={ props.forward }>
                        { isIOS() && <Text> Finish</Text> }
                        <Icon name="arrow-forward" ios="ios-arrow-forward" android="md-arrow-forward" style={ [isAndroid() && Styles.textDark] } />
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
                          onError={ props.handleError }
                        />
                    </MapView>
                </View>
                <Content contentContainerStyle={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch] }>
                    <View style={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter, Styles.backgroundWrapperTransparent, styles.mapViewOverlay] }>
                        { props.mapLoading && <Spinner color={ Styles['textKimyaKimya' + titleCase(props.gender)].color } /> }
                    </View>
                    <View style={ [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter, Styles.padding, Styles.backgroundWrapper] }>
                        <View style={ [Styles.flexAlignCenter, Styles.padding, Styles.marginBottom] }>
                            <Text style={ [styles.title] }>
                                { "Your order will arrive" + ((!isEmpty(props.order.location.name) || !isEmpty(props.order.location.address))? (" at " + ((props.order.location.name || '') + ((props.order.location.address)? (', ' + props.order.location.address) : ''))) : "") + " in:" }
                            </Text>
                            <Text style={ [Styles.textAlignCenter, styles.time] }>
                                { props.duration + " " + props.durationUnits }
                            </Text>
                        </View>

                        <View style={ [Styles.flexAlignCenter, Styles.marginTop] }>
                            <Text style={ [styles.title] }>Contact KimyaKimya Hotpoint:</Text>
                            <View style={ [Styles.flexRow, Styles.flexJustifySpaceEvenly, Styles.flexAlignCenter] }>
                                <View style={ [Styles.padding, Styles.width50] }>
                                    <Button block iconLeft bordered onPress={ props.messageHotpoint }>
                                        <Icon name="chatbubbles" ios="ios-chatbubbles" android="md-chatbubbles" />
                                        <Text>Message</Text>
                                    </Button>
                                </View>
                                <View style={ [Styles.padding, Styles.width50] }>
                                    <Button block iconLeft success bordered  onPress={ props.callHotpoint }>
                                        <Icon name="call" ios="ios-call" android="md-call" />
                                        <Text>Call</Text>
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </View>
                </Content>
            </View>

            <View style={ [Styles.padding, Styles.borderTop] }>
                <Button block onPress={ props.confirmOrder }>
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
    time: { fontSize: 28 }
});

export default OrderStatus;
