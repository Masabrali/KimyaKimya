/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, Image, View, FlatList } from 'react-native';
import { Container, Header, Left, Body, Title, Right, Content, Spinner, Item, Input, Button, Text, Icon, ListItem, Thumbnail } from 'native-base'; // Version can be specified in package.json

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
import StatusBar from '../../components/others/StatusBar';

/**
 * Other variables and constants
*/
import Styles from '../styles';

const Invite = function (props) {
    return (
        <Container style={ [Styles.wrapper] }>
            <Header noShadow style={ [Styles.noBorder, Styles.backgroundHeader, props.searchFocused && Styles.positionAbsolute] }>
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

            <Header noShadow searchBar style={ [Styles.backgroundHeader, (!props.searchFocused || (isEmpty(props.contacts) && !props.loading)) && Styles.borderBottom, !props.searchFocused && isAndroid() && Styles.paddingBottom] }>
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
                          value={ (props.searchFocused)? props.searchKey : '' }
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

            <View style={ [Styles.flex] }>
                <View style={ [Styles.positionAbsolute, Styles.verticalPositionTop, Styles.verticalPositionBottom, Styles.horizontalPositionLeft, Styles.horizontalPositionRight, Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter, Styles.doublePaddingBottom] }>
                    <Image source={ require('../../assets/logo_text.png') } style={ [Styles.marginBottom, Styles.imageResizeModeContain, styles.logo] } />
                    <Text style={ [Styles.marginTop, Styles.doubleMarginBottom, Styles.textAlignCenter, styles.catchPhrase] }>Share KimyaKimya. Healthy and Enjoyable Moments for all.</Text>
                </View>
                <View style={ [Styles.flex, Styles.backgroundWrapperTransluscent] }>
                    <Content keyboardShouldPersistTaps="handle" contentContainerStyle={ [!props.searchFocused && isEmpty(props.selected) && Styles.flex] }>
                        { props.searchFocused && (props.loading || !isEmpty(props.contacts)) && <View style={ [Styles.flex, Styles.backgroundWrapper, Styles.borderBottom] }>
                                { props.loading && <View style={ [Styles.flexRow, Styles.flexJustifyCenter, Styles.flexAlignCenter] }>
                                        <Spinner color={ Styles['textKimyaKimya' + titleCase(props.gender)].color } />
                                    </View>
                                }
                                { !isEmpty(props.contacts) && <FlatList
                                      data={ props.contacts }
                                      keyExtractor={ (contact) => ( contact.recordID.toString() ) }
                                      contentContainerStyle={ [Styles.flex, Styles.doublePaddingLeft] }
                                      renderItem={ (contact) =>
                                          <ListItem
                                            key={ contact.item.recordID.toString() }
                                            thumbnail
                                            onPress={ () => (props.selectContact(contact.item, this.searchInput)) }
                                            style={ [Styles.paddingTop, Styles.paddingBottom] }
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
                                              <Right style={ [isAndroid() && Styles.noBorderBottom] } />
                                          </ListItem>
                                      }
                                    />
                                }
                                { props.searchFocused && !isEmpty(props.contacts) && <View style={ [{height: props.keyboardHeight}] } /> }
                            </View>
                        }
                        { !props.searchFocused && !props.loading && <View style={ [Styles.flex] }>
                                { isEmpty(props.selected) && !props.searchFocused && !props.loading  && <View style={ [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter] }>
                                        <View style={ [Styles.padding] }>
                                            <Button bordered block onPress={ () => ( props.startSearching(this.searchInput) ) }>
                                                <Text>Add Friends to Invite</Text>
                                            </Button>
                                        </View>
                                    </View>
                                }
                                { !isEmpty(props.selected) && <FlatList
                                      data={ props.selected }
                                      keyExtractor={ (contact) => ( contact.recordID.toString() ) }
                                      contentContainerStyle={ [Styles.flex] }
                                      renderItem={ (contact) =>
                                          <ListItem
                                            key={ contact.item.recordID.toString() }
                                            thumbnail
                                            onPress={ () => (props.deselectContact(contact)) }
                                            style={ [Styles.noPadding, Styles.halfMarginTop, Styles.halfMarginBottom, Styles.flexAlignStretch] }
                                          >
                                              <Left style={ [Styles.flexJustifyCenter, Styles.flexAlignCenter] }>
                                                  <Thumbnail small source={ (contact.item.hasThumbnail)? { uri: contact.item.thumbnailPath } : require('../../assets/avatar.png') } />
                                              </Left>
                                              <Body style={ [Styles.flexJustifyCenter, Styles.borderBottom] }>
                                                  <Text numberOfLines={1}>
                                                      {
                                                        ((!!contact.item.givenName)? (contact.item.givenName + " ") : '') + ((!!contact.item.middleName)? (contact.item.middleName + " ") : '') + ((!!contact.item.familyName)? contact.item.familyName : '')
                                                      }
                                                  </Text>
                                              </Body>
                                              <Right styles={ [Styles.paddingRight] }>
                                                  <Button iconLeft transparent danger onPress={ () => ( props.deselectContact(contact.item) ) }>
                                                      <Icon name="close-circle" ios="ios-close-circle" android="md-close-circle" style={ [isAndroid() && Styles.textDanger] } />
                                                      { isIOS() && <Text>Remove</Text> }
                                                  </Button>
                                              </Right>
                                          </ListItem>
                                      }
                                    />
                                }
                            </View>
                        }
                    </Content>

                    { !props.searchFocused && <View style={ [Styles.padding] }>
                            <Button block onPress={ props.invite } disabled={ isEmpty(props.selected) }>
                                <Text>
                                    { 'Invite ' + ((!isEmpty(props.selected))? (props.selected.length + ' ') : '') +  ((props.selected.length == 1)? 'Friend' : 'Friends') }
                                </Text>
                            </Button>
                        </View>
                    }
                </View>
            </View>
        </Container>
    );
}

/**
 * Styles
*/
const styles = StyleSheet.create({
    logo: {
        width: 140,
        height: 140
    },
    catchPhrase: { fontSize: 18, maxWidth: 220 }
});

export default Invite;
