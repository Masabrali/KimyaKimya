/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Container, Header, Left, Right, Body, Title, Content, Button, Icon, Text, List, ListItem, Item, Input, Spinner } from 'native-base';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import moment from 'moment'; // Version can be specified in package.json

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

const Order = function (props) {
    return (
        <Container>
            { !props.locationFocused && props.turnOnLocationError && <Header noShadow style={ [Styles.backgroundDanger] }>
                    <Left style={ [Styles.flex, Styles.flexRow, Styles.flexJustifyStart, Styles.flexAlignCenter] }>
                        { !isEmpty(props._location) && <Button iconLeft transparent style={ [Styles.marginRight] } onPress={ props.dismissTurnOnLocationError }>
                                <Icon name="close" ios="ios-close" android="md-close" style={ [Styles.textWhite] } />
                            </Button>
                        }
                        <Text style={ [Styles.textWhite] }>Location Service Off</Text>
                    </Left>
                    <Right>
                        <Button transparent onPress={ props.turnOnLocation }>
                            <Text style={ [Styles.textWhite] }>Turn On</Text>
                        </Button>
                    </Right>
                </Header>
            }
            { !props.locationFocused && !props.turnOnLocationError && isEmpty(props.hotpoints) && <Header noShadow style={ [Styles.backgroundDanger] }>
                    <Left style={ [Styles.flex, Styles.flexRow, Styles.flexJustifyStart, Styles.flexAlignCenter] }>
                        <Text style={ [Styles.textWhite] }>Hotpoints Unavailable now</Text>
                    </Left>
                    <Right>
                        <Button transparent onPress={ props.fetchHotpoints }>
                            <Text style={ [Styles.textWhite] }>Reload</Text>
                        </Button>
                    </Right>
                </Header>
            }
            { !props.locationFocused &&  <Header noShadow style={ [Styles.noBorder, Styles.backgroundHeader] }>
                    <Left>
                        <Button iconLeft transparent onPress={ props.back }>
                            <Icon name="arrow-back" ios="ios-arrow-back" android="md-arrow-back" style={ [isAndroid() && Styles.textDark] } />
                            { isIOS() && <Text>Order</Text> }
                        </Button>
                    </Left>
                    <Body style={ [isAndroid() && Styles.marginLeft, isAndroid() && Styles.paddingLeft] }>
                        <Title style={ [Styles.textDark, Styles.textBold] }>Location</Title>
                    </Body>
                    <Right>
                        <Button iconRight transparent onPress={ props.refreshLocation }>
                            { isIOS() && <Text>Reset</Text> }
                            <Icon name="refresh" ios="ios-refresh" android="md-refresh" style={ [isAndroid() && Styles.textDark] } />
                        </Button>
                    </Right>
                </Header>
            }
            <Header noShadow searchBar style={ [Styles.backgroundHeader, !props.locationFocused && Styles.borderBottom, !props.locationFocused && isAndroid() && Styles.paddingBottom] } onLayout={ (e) => { this.searchHeaderHeight = e.nativeEvent.layout.height; } }>
                <Body style={ [Styles.flex, !props.locationFocused && Styles.paddingLeft, !props.locationFocused && Styles.paddingRight] }>
                    <Item style={ [Styles.paddingRight, isAndroid() && !props.locationFocused && Styles.borderBottom, isAndroid() && props.locationFocused && Styles.noBorder, isIOS() && Styles.borderRadius, styles.searchItem] } disabled={ (props.loading || props.refreshing)? true:false }>
                        { props.locationFocused && isAndroid() && <Button iconRight transparent style={ [Styles.height100] } onPress={ () => ( props.blurLocation(this.locationInput) ) }>
                                <Icon name="arrow-back" ios="ios-arrow-back" android="md-arrow-back" style={ [Styles.textDark] } />
                            </Button>
                        }
                        { (!props.locationFocused && isAndroid()) && <Icon name="pin" ios="ios-pin" android="md-pin" style={ [isAndroid() && (isEmpty(props._location) || (isEmpty(props._location.name) && isEmpty(props._location.address))) && Styles.textPlaceholder] } /> }
                        { !props.locationFocused && <Text numberOfLines={1} style={ [(isEmpty(props._location) || (isEmpty(props._location.name) && isEmpty(props._location.address))) && Styles.textPlaceholder, Styles.flex, Styles.padding] } onPress={ () => (props.focusLocation(this.locationInput)) }>
                                { (props.loading || props.locationLoading)? "Loading..." : (!isEmpty(props._location) && (!isEmpty(props._location.name) || !isEmpty(props._location.address)))? ((props._location.name || '') + ((props._location.address)? (', ' + props._location.address) : '')) : 'Where are you?' }
                            </Text>
                        }
                        { props.locationFocused && <Input
                          ref={ (input) => ( this.locationInput = input ) }
                          style={ [Styles.flex] }
                          placeholder={ (props.loading || props.locationLoading)? "Loading...":"Delivery Location" }
                          placeholderStyle={ [styles.locationInputPlaceholder] }
                          initialValue={ (!isEmpty(props._location))? ((props._location.name || '') + ((props._location.address)? (', ' + props._location.address) : '')) : '' }
                          defaultValue={ props.locationKey }
                          onChangeText={ (key) => ( props.searchLocation(key, this.map) ) }
                          onBlur={ () => (props.blurLocation(this.locationInput)) }
                          autoFocus={ true }
                          autoCorrect={ false }
                          clearButtonMode="while-editing"
                        /> }
                        { props.locationFocused && isAndroid() && <Button iconLeft transparent style={ [Styles.height100] } onPress={ () => ( props.clearLocation(this.locationInput) ) }>
                                <Icon name="close" ios="ios-close" android="md-close" style={ [Styles.textPlaceholder] } />
                            </Button>
                        }
                    </Item>
                    { props.locationFocused && isIOS() && <Button transparent onPress={ () => ( props.blurLocation(this.locationInput) ) }>
                            <Text>Cancel</Text>
                        </Button>
                    }
                </Body>
            </Header>

            <StatusBar />

            <Content keyboardShouldPersistTaps="handle" contentContainerStyle={ [Styles.flex] }>
                <View style={ [Styles.positionAbsolute, Styles.verticalPositionTop, Styles.verticalPositionBottom, Styles.horizontalPositionLeft, Styles.horizontalPositionRight, Styles.flexJustifyCenter, Styles.flexAlignCenter] }>
                    <MapView
                      ref={ (map) => ( this.map = map ) }
                      provider={ (isAndroid())? PROVIDER_GOOGLE : null }
                      scrollEnabled={ (isIOS())? false : true }
                      style={ [Styles.absoluteFillObject, Styles.flex] }
                      initialRegion={ (!isEmpty(props._location))? props._location : props.initialRegion }
                      onMapReady={ (e) => (
                          props.mapReady(this.map, this.hotpoint_markers)
                      ) }
                      onRegionChangeComplete={ props.regionChanged }
                      onPress={ props.mapPressed }
                      onUserLocationChange={ props.userLocationChanged }
                      showsUserLocation={ true }
                    >
                        {
                            Object.keys(props.hotpoints).map( (key) => (
                                <MapView.Marker
                                  ref={ (marker) => {

                                      if (isEmpty(this.hotpoint_markers)) this.hotpoint_markers = {};

                                      this.hotpoint_markers[key] = marker;

                                      return marker;
                                  } }
                                  key={ key }
                                  coordinate={ props.hotpoints[key].location }
                                  pinColor={ Styles['textKimyaKimya' + ( (props.gender == 'female')? 'Male' : 'Female' )].color }
                                  image={ (props.gender == 'female')? require('../../assets/hotpoint_male.png') : require('../../assets/hotpoint_female.png') }
                                  flat={ true }
                                />
                            ) )
                        }
                    </MapView>
                    <Image source={ (props.gender == 'female')? require('../../assets/marker_female.png') : require('../../assets/marker_male.png') } style={ [Styles.positionAbsolute, Styles.verticalPositionBottom50, Styles.imageResizeModeContain, styles.marker] } />
                </View>

                { !props.locationFocused && <View style={ [Styles.positionAbsolute, Styles.verticalPositionBottom, Styles.horizontalPositionLeft, Styles.horizontalPositionRight, Styles.backgroundTransparent, Styles.padding] }>
                        <Button block onPress={ props.location }>
                            <Text>Set Delivery Location</Text>
                        </Button>
                    </View>
                }

                { props.locationFocused && (props.locationsLoading || !isEmpty(props.locations)) && <View style={ [Styles.positionAbsolute, Styles.verticalPositionTop, Styles.verticalPositionBottom, Styles.horizontalPositionLeft, Styles.horizontalPositionRight, Styles.backgroundTransparent] } /> }

                { props.locationFocused && (props.locationsLoading || !isEmpty(props.locations)) && <View style={ [Styles.flexColumn, Styles.flexJustifyStart, Styles.flexAlignStretch, Styles.backgroundWrapper] }>
                        { props.locationsLoading && <View style={ [Styles.flexRow, Styles.flexJustifyCenter] }>
                                <Spinner color={ Styles['textKimyaKimya' + titleCase(props.gender)].color } />
                            </View>
                        }
                        { !isEmpty(props.locations) && <List
                              dataArray={ props.locations }
                              dataSource={ props.dataSource.cloneWithRows(props.locations) }
                              renderRow={ (location) =>
                                  <ListItem onPress={ () => (props.selectLocation(location, this.locationInput)) } key={ location.id } style={ [Styles.noPadding, Styles.noMargin] }>
                                      <Body style={ [Styles.flex, Styles.noPadding, Styles.noMargin, Styles.paddingLeft] }>
                                          <Text numberOflines={1}>{ location.name }</Text>
                                          <Text style={ [styles.locationDescription] }>{ location.address || location.formatted_address }</Text>
                                      </Body>
                                  </ListItem>
                              }
                            />
                        }
                    </View>
                }
            </Content>

            <Loader visible={ props.loading && isEmpty(props.errors) } text="Setting Location..." spinnerColor={ Styles['textKimyaKimya' + titleCase(props.gender)].color }  />
        </Container>
    );
}

/**
 * Styles
*/
const styles = StyleSheet.create({
    searchItem: { borderBottomWidth: 1.5 },
    locationDescription: {
        fontSize: 14,
        color: '#616167'
    },
    marker: {
      width: 28,
      height: 52
    }
});

export default Order;
