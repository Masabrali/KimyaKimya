/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, RefreshControl, View } from 'react-native';
import { Container, ActionSheet, Header, Body, Left, Right, Segment, Content, Spinner, List, ListItem, Button, Badge, Icon, Text, Item, Input } from 'native-base';
import Moment from 'moment'; // Version can be specified in package.json

/**
* Import Utilities
*/
import currencyFormat from '../../utilities/currencyFormat';
import shortMonth from '../../utilities/shortMonth';
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

const Orders = function (props) {
    return (
        <Container style={ [Styles.wrapper] }>
            <Header noShadow hasSegment searchBar style={ [Styles.backgroundHeader] } >
                <Body style={ [Styles.flex] }>
                    <Item style={ [isAndroid() && Styles.borderBottom, isIOS() && Styles.borderRadius, styles.searchItem] } disabled={ (props.loading || props.refreshing)? true:false } >
                        { props.searchFocused && isAndroid() && <Button iconRight transparent style={ [Styles.height100] } onPress={ () => ( props.blurSearch(this.searchInput) ) }>
                                <Icon name="arrow-back" ios="ios-arrow-back" android="md-arrow-back" style={ [Styles.textDark] } />
                            </Button>
                        }
                        { (!props.searchFocused && isAndroid()) && <Icon name="search" ios="ios-search" android="md-search" style={ [isAndroid() && Styles.textPlaceholder] } /> }
                        <Input
                          autoFocus={ props.searchFocused }
                          ref={ (input) => ( this.searchInput = input ) }
                          placeholder="Search orders..."
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
                            { isIOS() && <Text>Cancel</Text> }
                        </Button>
                    }
                </Body>
                { !props.searchFocused && <Right>
                    <Button transparent badge disabled={ (props.cartSize === 0)? true:false } onPress={ props.checkout }>
                            <Icon name="cart" ios="ios-cart" android="md-cart" style={ [isAndroid() && props.cartSize && Styles.textDark] } />
                            { props.cartSize !== 0 &&  <Badge style={ [Styles.positionAbsolute, Styles.verticalPositionTop, Styles.horizontalPositionRight, Styles.backgroundKimyaKimyaFemale] }>
                                    <Text style={ [Styles.noPadding, Styles.noMargin, Styles.textWhite, styles.cartSizeText] }>{ props.cartSize }</Text>
                                </Badge>
                            }
                        </Button>
                    </Right>
                }
            </Header>
            <Segment noShadow style={ [Styles.borderBottom, Styles.backgroundHeader] }>
                <Button active={ (props.segment == 'previous') } first style={ [Styles.border, Styles.borderPrimary, (props.segment == 'previous') && Styles.backgroundPrimary] } onPress={ () => ( props.changeSegment('previous') ) }>
                    <Text style={ [(props.segment == 'previous')? Styles.textWhite : Styles.textPrimary] }>Previous</Text>
                </Button>
                <Button active={ (props.segment == 'drafts') } style={ [Styles.border, Styles.borderPrimary, (props.segment == 'drafts') && Styles.backgroundPrimary] } onPress={ () => ( props.changeSegment('drafts') ) }>
                    <Text style={ [(props.segment == 'drafts')? Styles.textWhite : Styles.textPrimary] }>Drafts</Text>
                </Button>
                <Button active={ (props.segment == 'queued') } last style={ [Styles.border, Styles.borderPrimary, (props.segment == 'queued') && Styles.backgroundPrimary, (props.segment == 'queued')? Styles.textWhite : Styles.textPrimary] } onPress={ () => ( props.changeSegment('queued') ) }>
                    <Text style={ [(props.segment == 'queued')? Styles.textWhite : Styles.textPrimary] }>
                      Queued { !isEmpty(props.orders.queued) && (": " + Object.keys(props.orders.queued).length) }
                    </Text>
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
              contentContainerStyle={ (isEmpty(props.orders[props.segment]) && !props.loading && !props.refreshing && [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch]) || ([Styles.paddingLeft]) }
            >
                { (props.loading || (props.refreshing && isEmpty(props.orders[props.segment]))) && <View style={ [Styles.flexRow, Styles.flexJustifyCenter] }>
                        <Spinner color={ (props.gender == 'female')? Styles.textKimyaKimyaFemale.color : Styles.textKimyaKimyaMale.color } />
                    </View>
                }

                { isEmpty(props.orders[props.segment]) && !props.loading && !props.refreshing  && <View style={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter] }>
                        <Text style={ [Styles.label, Styles.textAlignCenter, Styles.padding, Styles.margin] }>You have not Ordered Anything Recently!</Text>

                        <View style={ [Styles.padding] }>
                            <Button bordered block onPress={ props.shop }>
                                <Text>Start Ordering Now</Text>
                            </Button>
                        </View>
                    </View>
                }

                { !isEmpty(props.orders[props.segment]) && <List
                      disableLeftSwipe={ (props.segment == 'queued') }
                      disableRightSwipe={ true }
                      rightOpenValue={-75}
                      dataSource={ props.dataSource.cloneWithRows(props.orders[props.segment]) }
                      renderRow={ (order) =>
                          <ListItem noIndent thumbnail key={order.id} style={ [Styles.noPaddingLeft] }>
                              <Left style={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch, Styles.paddingTop, Styles.paddingBottom] }>
                                  <View style={ [Styles.flexRow, Styles.noMarginBottom, Styles.noPaddingBottom] }>
                                      <Text style={ [styles.date] }>
                                          { Moment(order.date).format('DD') }
                                      </Text>
                                      <Text style={ [styles.month] }>
                                          { Moment(order.date).format('MMM') }
                                      </Text>
                                  </View>
                                  <Text style={ [Styles.width100, Styles.noMarginTop, Styles.noPaddingTop, Styles.borderBottom, Styles.textAlignCenter, styles.year] }>
                                      { Moment(order.date).format('YYYY') }
                                  </Text>
                                  <Text style={ [Styles.width100, Styles.textAlignCenter, styles.time] }>
                                      { Moment(order.date).format('HH:mm') }
                                  </Text>
                              </Left>
                              <Body style={ [Styles.flexColumn, Styles.flexJustifyStart, Styles.height100] }>
                                  <Text numberOfLines={1} style={ [styles.products] }>
                                      {
                                          order.products && order.products.map( (product, index) =>
                                              ( product.quantity + " " + product.name + ((index != (order.products.length - 1))? ", " : "") )
                                          )
                                      }
                                  </Text>
                                  <Text style={ [styles.location] }>
                                      { (!isEmpty(order.location))? ((order.location.name || '') + ((order.location.address)? (', ' + order.location.address) : '')) : '...' }
                                  </Text>
                              </Body>
                              <Right style={ [Styles.flexColumn, Styles.flexJustifyStart, Styles.flexAlignRight] }>
                                  <Button
                                    bordered
                                    warning={ order.queued }
                                    disabled={ props.loading || props.refreshing }
                                    onPress={ () => ( (order.queued)? props.queuedOrder(order) : props.reOrder(order) ) }
                                  >
                                      <Text style={ [styles.amount] }>
                                          { currencyFormat(order.amount + order.delivery) }
                                      </Text>
                                  </Button>
                              </Right>
                          </ListItem>
                      }
                      renderRightHiddenRow={ (order, secId, rowId, rowMap) =>
                          <Button vertical icon light onPress={ () => {

                                  let options = [
                                      { text: (props.segment == 'drafts')? 'Keep in Draft Orders' : 'Keep in Previous Orders', icon: (props.segment == 'drafts')? 'exit' : 'list', iconColor: isAndroid() && Styles.textPrimary.color },
                                      { text: 'Delete', icon: 'trash', iconColor: isAndroid() && Styles.textDanger.color },
                                      { text: 'Cancel', icon: (isAndroid())? 'close-circle' : 'close-circle-outline', iconColor: isAndroid() && Styles.textPrimary.color }
                                  ];

                                  if (props.cartSize === 0)
                                      options.unshift({ text: (props.segment == 'drafts')? 'Continue Ordering' : 'Re-Order Now for ' + currencyFormat(order.amount + order.delivery), icon: 'cart', iconColor: isAndroid() && Styles.textPrimary.color });

                                  ActionSheet.show({
                                      options,
                                      cancelButtonIndex: (props.cartSize === 0)? 3 : 2,
                                      destructiveButtonIndex: (props.cartSize === 0)? 2 : 1,
                                      title: (props.segment == 'drafts')? "Draft Order Options" : "Previous Order Options"
                                  }, (index) => {

                                      if (index == 0 && props.cartSize === 0)
                                          return props.quickReOrder(order, secId, rowId, rowMap);
                                      else if ((index == 1 && props.cartSize !== 0) || (index == 2 && props.cartSize === 0))
                                          return props.delete(order, secId, rowId, rowMap);

                                      return rowMap[`${secId}${rowId}`].props.closeRow();
                                  });
                              }
                          }>
                              <Icon name="more" ios="ios-more" android="md-more" />
                          </Button>
                      }
                    ></List>
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
    date: { fontSize: 24 },
    month: { fontSize: 14 },
    year: { fontSize: 16 },
    time: { fontSize: 16 },
    products: { fontSize: 18 },
    location: {
        fontSize: 14,
        color: '#616167'
    },
    amount: { fontSize: 14 }
});

export default Orders;
