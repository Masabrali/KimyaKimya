/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, RefreshControl, View } from 'react-native';
import { Container, Header, Left, Body, Title, Right, Segment, Content, Spinner, List, ListItem, Thumbnail, Button, Badge, Icon, Text, Item, Input } from 'native-base'; // Version can be specified in package.json

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
import StatusBar from '../../components/others/StatusBar';

/**
 * Other variables and constants
*/
import Styles from '../styles';

const Shop = function (props) {
    return (
        <Container style={ [Styles.wrapper] }>
            <Header noShadow hasSegment searchBar style={ [Styles.backgroundHeader] }>
                <Body style={ [Styles.flex] }>
                    <Item style={ [isAndroid() && Styles.borderBottom, isIOS() && Styles.borderRadius, styles.searchItem] } disabled={ (props.loading || props.refreshing) } >
                        { props.searchFocused && isAndroid() && <Button iconRight transparent style={ [Styles.height100] } onPress={ () => ( props.blurSearch(this.searchInput) ) }>
                                <Icon name="arrow-back" ios="ios-arrow-back" android="md-arrow-back" style={ [Styles.textDark] } />
                            </Button>
                        }
                        { (!props.searchFocused && isAndroid()) && <Icon name="search" ios="ios-search" android="md-search" style={ [isAndroid() && Styles.textPlaceholder] } /> }
                        <Input
                          autoFocus={ props.searchFocused }
                          ref={ (input) => ( this.searchInput = input ) }
                          placeholder="Search shop..."
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
                { !props.searchFocused &&  <Right>
                    <Button transparent badge disabled={ (!props.cartSize) } onPress={ props.checkout }>
                            <Icon name="cart" ios="ios-cart" android="md-cart" style={ [isAndroid() && !!props.cartSize && Styles.textDark] } />
                            { !!props.cartSize &&  <Badge style={ [Styles.positionAbsolute, Styles.verticalPositionTop, Styles.horizontalPositionRight, Styles.backgroundKimyaKimyaFemale] }>
                                    <Text style={ [Styles.noPadding, Styles.noMargin, Styles.textWhite, styles.cartSizeText] }>{ props.cartSize }</Text>
                                </Badge>
                            }
                        </Button>
                    </Right>
                }
            </Header>
            <Segment noShadow style={ [Styles.borderBottom, Styles.backgroundHeader] }>
                <Button active={ (props.segment == 'condoms') } first style={ [Styles.border, Styles.borderPrimary, (props.segment == 'condoms') && Styles.backgroundPrimary] } onPress={ () => ( props.changeSegment('condoms') ) }>
                    <Text style={ [(props.segment == 'condoms')? Styles.textWhite : Styles.textPrimary] }>Condoms</Text>
                </Button>
                <Button active={ (props.segment == 'pills') } style={ [Styles.border, Styles.borderPrimary, (props.segment == 'pills') && Styles.backgroundPrimary, (props.segment == 'pills')? Styles.textWhite : Styles.textPrimary] } onPress={ () => ( props.changeSegment('pills') ) }>
                    <Text style={ [(props.segment == 'pills')? Styles.textWhite : Styles.textPrimary] }>Pills</Text>
                </Button>
                <Button active={ (props.segment == 'emergency') } last style={ [Styles.border, Styles.borderPrimary, (props.segment == 'emergency') && Styles.backgroundPrimary, (props.segment == 'emergency')? Styles.textWhite : Styles.textPrimary] } onPress={ () => ( props.changeSegment('emergency') ) }>
                    <Text style={ [(props.segment == 'emergency')? Styles.textWhite : Styles.textPrimary] }>Emergency</Text>
                </Button>
            </Segment>

            <StatusBar />

            <Content
              refreshControl={
                <RefreshControl
                  refreshing={ props.refreshing }
                  onRefresh={ props.refresh }
                />
              }
              keyboardShouldPersistTaps="handle"
              contentContainerStyle={ (isEmpty(props.products[props.segment]) && !props.loading && !props.refreshing && [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch]) || ([Styles.paddingLeft]) }
            >
                { (props.loading || (props.refreshing && isEmpty(props.products[props.segment]))) && <View style={ [Styles.flexRow, Styles.flexJustifyCenter] }>
                        <Spinner color={ (props.gender == 'female')? Styles.textKimyaKimyaFemale.color : Styles.textKimyaKimyaMale.color } />
                    </View>
                }

                { isEmpty(props.products[props.segment]) && !props.loading && !props.refreshing  && <View style={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter] }>
                        <Text style={ [Styles.label, Styles.textAlignCenter, Styles.padding, Styles.margin] }>{titleCase(props.segment)} not available in Stock Now</Text>

                        <View style={ [Styles.padding] }>
                            <Button bordered block onPress={ props.refresh }>
                                <Text>Refresh Store</Text>
                            </Button>
                        </View>
                    </View>
                }

                { !isEmpty(props.products[props.segment]) && <List
                      dataArray={ props.products[props.segment] }
                      renderRow={ (product) =>
                          <ListItem noIndent thumbnail key={product.id} style={ [Styles.noPaddingLeft] }>
                              <Left>
                                  <Thumbnail square defaultSource={ props.thumbnail } source={ (product.thumbnail && product.thumbnail != '')? { uri: product.thumbnail } : props.thumbnail } />
                              </Left>
                              <Body>
                                  <Text numberOfLines={1} style={ [styles.productName] }>
                                      { product.name }
                                  </Text>
                                  <Text style={ [styles.productDescription] }>
                                      { product.description }
                                  </Text>
                              </Body>
                              <Right style={ [Styles.flexAlignRight] }>
                                  <Button bordered onPress={ () => ( props.shop(product) ) }>
                                      <Text style={ [styles.price] }>{ currencyFormat(product.price) }</Text>
                                  </Button>
                              </Right>
                          </ListItem>
                      }
                    />
                }

            </Content>
        </Container>
    );
}

/**
 * Styles
*/
const styles = StyleSheet.create({
    cartSizeText: { fontSize: 14 },
    searchItem: { borderBottomWidth: 1.5 },
    searchInputPlaceholder: { fontSize: 16 },
    productName: { fontSize: 18 },
    productDescription: {
        fontSize: 14,
        color: '#616167'
    },
    price: { fontSize: 14 }
});

export default Shop;
