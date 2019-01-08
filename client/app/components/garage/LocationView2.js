<View style={ [Styles.flex, Styles.positionAbsolute, Styles.verticalPositionTop, Styles.verticalPositionBottom, Styles.horizontalPositionLeft, Styles.horizontalPositionRight] }>

    { !isEmpty(props.region) && <MapView
          ref={ (map) => ( this.map = map ) }
          scrollEnabled={ false }
          style={ [Styles.absoluteFillObject, Styles.flex] }
          region={ props.region }
          initialRegion={ props.region }
          onMapReady={ props.mapReady }
          onRegionChangeComplete={ props.regionChanged }
          showsUserLocation={ true }
        >
            { !isEmpty(props._location) && <MapView.Marker
                  coordinate={ props._location }
                  flat={ true }
                  pinColor='#000000'
                />
            }
        </MapView>
    }

    { !props.locationFocused &&  <Header noShadow style={ [Styles.noBorder, Styles.backgroundWrapper] }>
            <Left>
                <Button iconLeft transparent onPress={ props.back }>
                    <Icon name="arrow-back" ios="ios-arrow-back" android="md-arrow-back" style={ [isAndroid() && Styles.textDark] } />
                    { isIOS() && <Text>Order</Text> }
                </Button>
            </Left>
            <Body style={ [isAndroid() && Styles.paddingLeft] }>
                <Title style={ [Styles.textDark, Styles.textBold] }>Delivery Location</Title>
            </Body>
            <Right />
        </Header>
    }
    <Header noShadow searchBar style={ [!props.locationFocused && Styles.noPaddingTop, Styles.backgroundWrapper, Styles.borderBottom] }>
        <Body style={ [Styles.flex] }>
            <Item style={ [isAndroid() && Styles.borderBottom, (isIOS() && Styles.borderRadius), styles.searchItem] } disabled={ (props.loading) }>
                <Icon name="pin" ios="ios-pin" android="md-pin" />
                <Input
                  ref={ (input) => ( this.locationInput = input ) }
                  placeholder={ (props.locationLoading)? "Loading...":"Delivery Location" }
                  placeholderStyle={ [styles.locationInputPlaceholder] }
                  initialValue={ (!isEmpty(props._location))? ((props._location.name || '') + ((props._location.address)? (', ' + props._location.address) : '')) : '' }
                  value={ (!isEmpty(props._location))? ((props._location.name || '') + ((props._location.address)? (', ' + props._location.address) : '')) : '' }
                  value={ (!isEmpty(props._location))? ((props._location.name || '') + ((props._location.address)? (', ' + props._location.address) : '')) : '' }
                  onFocus={ props.focusLocation }
                  onChangeText={ (key) => ( props.searchLocation(key, this.map) ) }
                  autoCorrect={ false }
                  clearButtonMode="while-editing"
                />
            </Item>
        </Body>
        <Right>
            { props.locationFocused && <Button transparent onPress={ () => ( props.blurLocation(this.locationInput) ) }>
                    { isIOS() && <Text>Cancel</Text> }
                    { isAndroid() && <Icon name="close" ios="ios-close" android="md-close" style={ [isAndroid() && Styles.textDark] } /> }
                </Button>
            }
        </Right>
    </Header>

    <Header noShadow searchBar style={ [Styles.backgroundWrapper, Styles.borderBottom, isAndroid() && Styles.paddingTop,  isAndroid() && Styles.paddingBottom] } onLayout={ (e) => { this.searchHeaderHeight = e.nativeEvent.layout.height; } }>
        <Body style={ [Styles.flex] }>
            <Item style={ [isAndroid() && Styles.borderBottom, isAndroid() && Styles.marginBottom, (isIOS() && Styles.borderRadius), styles.searchItem] } disabled={ (props.loading) }>
                <Icon name="pin" ios="ios-pin" android="md-pin" />
                <Input
                  ref={ (input) => ( this.locationInput = input ) }
                  placeholder={ (props.locationLoading)? "Loading...":"Delivery Location" }
                  placeholderStyle={ [styles.locationInputPlaceholder] }
                  initialValue={ (!isEmpty(props._location))? ((props._location.name || '') + ((props._location.address)? (', ' + props._location.address) : '')) : '' }
                  value={ (!isEmpty(props._location))? ((props._location.name || '') + ((props._location.address)? (', ' + props._location.address) : '')) : '' }
                  onFocus={ props.focusLocation }
                  onChangeText={ (key) => ( props.searchLocation(key, this.map) ) }
                  autoCorrect={ false }
                  clearButtonMode="while-editing"
                />
            </Item>
        </Body>
        { props.locationFocused && <Right>
                <Button iconRight transparent onPress={ () => ( props.blurLocation(this.locationInput) ) }>
                    { isIOS() && <Text>Cancel</Text> }
                    { isAndroid() && <Icon name="close" ios="ios-close" android="md-close" style={ [isAndroid() && Styles.textDark] } /> }
                </Button>
            </Right>
        }
    </Header>


    <View style={ [Styles.positionAbsolute, Styles.verticalPositionBottom, Styles.horizontalPositionLeft, Styles.horizontalPositionRight, Styles.backgroundTransparent, Styles.padding] }>
        <Button block onPress={ props.location }>
            <Text>Set Delivery Location</Text>
        </Button>
    </View>

    { props.locationFocused && (props.locationsLoading || !isEmpty(props.locations)) && <View style={ [styles.locationSearchResults] }>
            <Content padder>
                    { props.locationsLoading && <View style={ [Styles.flexRow, Styles.flexJustifyCenter] }>
                            <Spinner color="black" />
                        </View>
                    }
                    { !isEmpty(props.locations) && <List
                          dataArray={ props.locations }
                          renderRow={ (location) =>
                              <ListItem icon style={ [Styles.marginBottom] } onPress={ () => props.selectLocation(location, this.map) }>
                                  <Left>
                                      <Icon name="timer" ios="ios-timer" android="md-timer" />
                                  </Left>
                                  <Body style={ [Styles.paddingTop, Styles.paddingBottom] }>
                                      <Text>{ location.name }</Text>
                                      <Text style={ [Styles.paddingBottom, styles.locationDescription] }>{ location.address || location.formatted_address }</Text>
                                  </Body>
                              </ListItem>
                          }
                        />
                    }
            </Content>
        </View>
    }

</View>
