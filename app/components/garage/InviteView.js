<Container style={ [Styles.wrapper] }>
    { !props.searchFocused &&  <Header noShadow style={ [Styles.noBorder, Styles.backgroundHeader, Styles.backgroundKimyaKimyaMal] }>
            <Left>
                <Button iconLeft transparent onPress={ props.back }>
                    <Icon name="arrow-back" ios="ios-arrow-back" android="md-arrow-back" style={ [isAndroid() && Styles.textDark] } />
                    { isIOS() && <Text>Order</Text> }
                </Button>
            </Left>
            <Body style={ [isAndroid() && Styles.marginLeft, isAndroid() && Styles.paddingLeft] }>
                <Title style={ [Styles.textDark, Styles.textBold] }>Tell a Friend</Title>
            </Body>
            <Right />
        </Header>
    }
    <Header noShadow searchBar style={ [Styles.backgroundHeader, Styles.backgroundKimyaKimyaMal, Styles.borderBottom, !props.searchFocused && isAndroid() && Styles.paddingBottom] } >
        <Body style={ [Styles.flex, !props.searchFocused && Styles.paddingLeft, !props.searchFocused && Styles.paddingRight] }>
            <Item style={ [Styles.paddingRight, isAndroid() && !props.searchFocused && Styles.borderBottom, isAndroid() && props.searchFocused && Styles.noBorder, isIOS() && Styles.borderRadius, !props.searchFocused && isAndroid() && Styles.marginBottom, styles.searchItem] } disabled={ (props.loading || props.refreshing)? true:false } >
                { props.searchFocused && isAndroid() && <Button iconRight transparent style={ [Styles.height100] } onPress={ () => ( props.blurSearch(this.searchInput) ) }>
                        <Icon name="arrow-back" ios="ios-arrow-back" android="md-arrow-back" style={ [Styles.textDark] } />
                    </Button>
                }
                { (!props.searchFocused && isAndroid()) && <Icon name="search" ios="ios-search" android="md-search" style={ [isAndroid() && Styles.textPlaceholder] } /> }
                <Input
                  autoFocus={ false }
                  ref={ (input) => ( this.searchInput = input ) }
                  placeholder="Search friends..."
                  placeholderStyle={ [styles.searchInputPlaceholder] }
                  onFocus={ () => ( props.focusSearch(this.searchInput) ) }
                  onChangeText={ props.search }
                  autoCapitalization="none"
                  autoCorrect={ false }
                  clearButtonMode="while-editing"
                />
                { props.searchFocused && isAndroid() && <Button iconLeft transparent onPress={ () => ( props.clearSearch(this.searchInput) ) }>
                        <Icon name="close" ios="ios-close" android="md-close" style={ [Styles.textPlaceholder] } />
                    </Button>
                }
            </Item>
            { props.searchFocused && isIOS() && <Button transparent onPress={ () => ( props.blurSearch(this.searchInput) ) }>
                    <Text>Cancel</Text>
                </Button>
            }
        </Body>
    </Header>

    <StatusBar />

    <View style={ [Styles.padding] }>
        <ScrollView horizontal={ true } showsHorizontalScrollIndicator={ false } contentContainerStyle={ [Styles.flexRow, Styles.flexJustifyStart, Styles.flexAlignStart] }>
            { !isEmpty(props.selected) && props.selected.map( (contact) =>
                <TouchableOpacity
                  key={ contact.recordID.toString() }
                  style={ [styles.selectedContact] }
                  onPress={ () => ( props.toggleContactSelection(contact) ) }
                >
                    <View style={ [Styles.flexColumn, Styles.flexJustifyStart, Styles.flexAlignCenter] }>
                        <Thumbnail small source={ (contact.hasThumbnail)? { uri: contact.thumbnailPath } : require('../../assets/avatar.png') } />
                        <Text numberOfLines={2} style={ [Styles.textAlignCenter, Styles.textLabel, styles.selectedContactLabel] }>
                            {
                                ((!!contact.givenName)? (contact.givenName + " ") : '') + ((!!contact.middleName)? (contact.middleName + " ") : '') + ((!!contact.familyName)? contact.familyName : '')
                            }
                        </Text>
                        <Icon name="close-cirlce" ios="ios-close-cirlce" android="md-close-circle" style={ [Styles.textPlaceholder, Styles.positionAbsolute, Styles.verticalPositionTop, Styles.horizontalPositionRight, styles.selectedContactIcon] } />
                    </View>
                </TouchableOpacity>
            ) }

            { isEmpty(props.selected) && <TouchableOpacity style={ [styles.selectedContact] }>
                    <View style={ [Styles.flexColumn, Styles.flexJustifyStart, Styles.flexAlignCenter] }>
                        <Thumbnail small source={ require('../../assets/avatar.png') } />
                        <Text numberOfLines={2} style={ [Styles.textAlignCenter, Styles.textPlaceholder, styles.selectedContactLabel] }>Friend</Text>
                    </View>
                </TouchableOpacity>
            }
        </ScrollView>
    </View>

    <Content
      refreshControl={
        <RefreshControl
          refreshing={ props.refreshing }
          onRefresh={ props.fetchContacts }
        />
      }
      keyboardShouldPersistTaps="handle"
      contentContainerStyle={ (isEmpty(props.contacts) && !props.loading && [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch]) || ([Styles.paddingTop, Styles.paddingLeft]) }>

        { (props.loading || props.refreshing) && <View style={ [Styles.flexRow, Styles.flexJustifyCenter] }>
                <Spinner color={ (props.gender == 'female')? Styles.textKimyaKimyaFemale.color : Styles.textKimyaKimyaMale.color } />
            </View>
        }

        { isEmpty(props.contacts) && !props.loading && <View style={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter] }>
                <Text style={ [Styles.label, Styles.textAlignCenter, Styles.padding, Styles.margin] }>Contacts list Empty. Check your Contact Permissions.</Text>

                <View style={ [Styles.padding] }>
                    <Button bordered block onPress={ props.fetchContacts }>
                        <Text>Refresh Contacts</Text>
                    </Button>
                </View>
            </View>
        }

        { !isEmpty(props.contacts) && <FlatList
            data={ props.contacts }
            keyExtractor={ (contact) => ( contact.recordID.toString() ) }
            renderItem={ (contact) =>
                <ListItem
                  key={ contact.item.recordID.toString() }
                  thumbnail
                  onPress={ () => ( props.toggleContactSelection(contact.item) ) }
                >
                    <Left>
                        <Thumbnail small source={ (contact.item.hasThumbnail)? { uri: contact.item.thumbnailPath } : require('../../assets/avatar.png') } />
                    </Left>
                    <Body style={ [isAndroid() && Styles.noBorderBottom] }>
                        <Text numberOfLines={1}>
                            {
                              ((!!contact.item.givenName)? (contact.item.givenName + " ") : '') + ((!!contact.item.middleName)? (contact.item.middleName + " ") : '') + ((!!contact.item.familyName)? contact.item.familyName : '')
                            }
                        </Text>
                    </Body>
                    <Right style={ [isAndroid() && Styles.noBorderBottom] }>
                        <View style={ [Styles.paddingRight] }>
                            <CheckBox
                              color={ (contact.item.selected)? Styles.backgroundKimyaKimyaFemale.backgroundColor : Styles.backgroundKimyaKimyaMale.backgroundColor }
                              checked={ contact.item.selected }
                              onPress={ () => ( props.toggleContactSelection(contact.item) ) }
                            />
                        </View>
                    </Right>
                </ListItem>
            }
          />
        }

    </Content>

    <View style={ [Styles.padding] }>
        <Button block onPress={ props.invite }>
            <Text>Invite Friends</Text>
        </Button>
    </View>

    <Loader visible={ (props.inviting && isEmpty(props.errors)) } text="Inviting Friends..." spinnerColor={ (props.gender == 'female')? Styles.textKimyaKimyaFemale.color : Styles.textKimyaKimyaMale.color } />
</Container>

const styles = StyleSheet.create({
    selectedContact: {
        padding: 0,
        margin: 3,
        width: 50
    },
    selectedContactLabel: { fontSize: 11 },
    selectedContactIcon: { fontSize: 14 }
});
