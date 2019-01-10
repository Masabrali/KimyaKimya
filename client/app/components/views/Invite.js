/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { Container, Content, Button, Text } from 'native-base'; // Version can be specified in package.json

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

const Invite = function (props) {

    return (
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

            <View style={ [Styles.flex] }>
                <View style={ [Styles.positionAbsolute, Styles.verticalPositionTop, Styles.verticalPositionBottom, Styles.horizontalPositionLeft, Styles.horizontalPositionRight, Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter] }>
                    <Image source={ require('../../assets/logo_text.png') } resizeMode="contain" style={ [Styles.marginBottom, styles.logo] } />
                    <Text style={ [Styles.marginTop, Styles.marginBottom, Styles.textAlignCenter, styles.catchPhrase] }>Just like our Wonderful World, Great things are ment to be enjoyed by all!</Text>
                    <Text style={ [Styles.textAlignCenter, styles.instruction] }>Change lives now. Share KimyaKimya with your friends</Text>
                </View>
                <View style={ [Styles.positionAbsolute, Styles.verticalPositionTop, Styles.verticalPositionBottom, Styles.horizontalPositionLeft, Styles.horizontalPositionRight, Styles.backgroundWrapperTransparent] } />
                <Content>

                </Content>
            </View>

            <View style={ [Styles.padding] }>
                <Button block onPress={ props.invite }>
                    <Text>Start Inviting</Text>
                </Button>
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
        height: 140,
        resizeMode: 'contain'
    },
    catchPhrase: { fontSize: 21, maxWidth: 220 },
    instruction: { fontSize: 18, maxWidth: 220 }
});

export default Invite;
