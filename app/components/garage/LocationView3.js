<View style={ [Styles.screenHeight] }>
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
    { !props.locationFocused &&  <Header noShadow style={ [Styles.noBorder, Styles.backgroundWrapper] }>
            <Left>
                <Button iconLeft transparent onPress={ props.back }>
                    <Icon name="arrow-back" ios="ios-arrow-back" android="md-arrow-back" style={ [isAndroid() && Styles.textDark] } />
                    { isIOS() && <Text>Order</Text> }
                </Button>
            </Left>
            <Body style={ [isAndroid() && Styles.marginLeft, isAndroid() && Styles.paddingLeft] }>
                <Title style={ [Styles.textDark, Styles.textBold] }>Delivery Location</Title>
            </Body>
            <Right>
                <Button iconRight transparent onPress={ props.refreshLocation }>
                    { isIOS() && <Text>Reset</Text> }
                    <Icon name="refresh" ios="ios-refresh" android="md-refresh" style={ [isAndroid() && Styles.textDark] } />
                </Button>
            </Right>
        </Header>
    }
    <Header noShadow searchBar style={ [Styles.backgroundWrapper, !props.locationFocused && Styles.borderBottom, !props.locationFocused && isAndroid() && Styles.paddingBottom] } onLayout={ (e) => { this.searchHeaderHeight = e.nativeEvent.layout.height; } }>
        <Body style={ [Styles.flex, !props.locationFocused && Styles.paddingLeft] }>
            <Item style={ [isAndroid() && Styles.borderBottom, (isIOS() && Styles.borderRadius), styles.searchItem] } disabled={ (props.loading || props.refreshing)? true:false }>
                <Icon name="pin" ios="ios-pin" android="md-pin" />
                { !props.locationFocused && <Text style={ [Styles.label, Styles.flex, Styles.padding] } onPress={ () => (props.focusLocation(this.locationInput)) }>
                        { (!isEmpty(props._location))? ((props._location.name || '') + ((props._location.address)? (', ' + props._location.address) : '')) : '' } Location
                    </Text>
                }
                { props.locationFocused && <Input
                  ref={ (input) => ( this.locationInput = input ) }
                  placeholder={ (props.locationLoading)? "Loading...":"Delivery Location" }
                  placeholderStyle={ [styles.locationInputPlaceholder] }
                  initialValue={ (!isEmpty(props._location))? ((props._location.name || '') + ((props._location.address)? (', ' + props._location.address) : '')) : '' }
                  onChangeText={ (key) => ( props.searchLocation(key, this.map) ) }
                  onBlur={ () => (props.blurLocation(this.locationInput)) }
                  autoCorrect={ false }
                  clearButtonMode="while-editing"
                />
                }
                { props.locationFocused && isAndroid() && <Button iconRight transparent onPress={ () => ( props.blurLocation(this.locationInput) ) }>
                        { isIOS() && <Text>Cancel</Text> }
                        { isAndroid() && <Icon name="close" ios="ios-close" android="md-close" style={ [isAndroid() && Styles.textDark] } /> }
                    </Button>
                }
            </Item>
            { props.locationFocused && isIOS() && <Button iconRight transparent onPress={ () => ( props.blurLocation(this.locationInput) ) }>
                    { isIOS() && <Text>Cancel</Text> }
                    { isAndroid() && <Icon name="close" ios="ios-close" android="md-close" style={ [isAndroid() && Styles.textDark] } /> }
                </Button>
            }
        </Body>
    </Header>

    <View style={ [Styles.flex] }>
        <MapView
          ref={ (map) => ( this.map = map ) }
          provider={ (isAndroid())? PROVIDER_GOOGLE : null }
          scrollEnabled={ (isIOS())? false : true }
          style={ [Styles.absoluteFillObject, Styles.flex] }
          initialRegion={ (!isEmpty(props._location))? props._location : props.initialRegion }
          onMapReady={ (e) => props.mapReady(this.map, this.marker) }
          onRegionChangeComplete={ props.regionChanged }
          onPress={ props.mapPressed }
          onUserLocationChange={ props.userLocationChanged }
          showsUserLocation={ true }
        >
            <MapView.Marker
              ref={ (marker) => ( this.marker = marker ) }
              coordinate={ (!isEmpty(props._location))? props._location : props.initialRegion }
              flat={ true }
              pinColor='#000000'
            />
        </MapView>

        <View style={ [Styles.positionAbsolute, Styles.verticalPositionBottomStatusBar, Styles.horizontalPositionLeft, Styles.horizontalPositionRight, Styles.backgroundTransparent, Styles.padding] }>
            <Button block onPress={ props.location }>
                <Text>Set Delivery Location</Text>
            </Button>
        </View>

        { props.locationFocused && (props.locationsLoading || !isEmpty(props.locations)) &&
            <View behavior="padding" style={ [Styles.positionAbsolute, Styles.verticalPositionTop, Styles.horizontalPositionLeft, Styles.horizontalPositionRight, Styles.backgroundWrapper, Styles.marginBottomStatusBar] } enabled>
                <Content keyboardShouldPersistTaps="handle" contentContainerStyle={ [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch, Styles.backgroundPrimary] }>
                        { props.locationsLoading && <View style={ [Styles.flexRow, Styles.flexJustifyCenter] }>
                                <Spinner color="black" />
                            </View>
                        }
                        { !isEmpty(props.locations) && <List
                              dataArray={ props.locations }
                              renderRow={ (location) =>
                                  <ListItem onPress={ () => props.selectLocation(location, this.locationInput) } key={ location.id } style={ [Styles.noPadding, Styles.noMargin] }>
                                      <Body style={ [Styles.flex, Styles.noPadding, Styles.noMargin, Styles.paddingLeft] }>
                                          <Text numberOflines={1}>{ location.name }</Text>
                                          <Text style={ [styles.locationDescription] }>{ location.address || location.formatted_address }</Text>
                                      </Body>
                                  </ListItem>
                              }
                            />
                        }
                </Content>
            </View>
        }
    </View>

    <Loader visible={ props.loading && isEmpty(props.errors) } text="Setting Location..." />
</View>
