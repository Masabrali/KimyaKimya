/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, View, WebView } from 'react-native';
import { Container, Content, Thumbnail, Text, Spinner } from 'native-base';
import AnimatedHeader from 'react-native-animated-header'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import titleCase from '../../utilities/titleCase';
import isIOS from '../../utilities/isIOS';

/**
 * Import other components
*/
import StatusBar from '../../components/others/StatusBar';

/**
 * Other variables and constants
*/
import Styles from '../styles';

const ProductInformation = function (props) {
    return (
        <Container>
            <StatusBar />
            <View style={ [Styles.flexRow, Styles.flexJustityStart, Styles.flexAlignCenter, Styles.borderBottom, Styles.paddingBottom] }>
                <View style={ [Styles.flexJustifyCenter, Styles.flexAlignCenter, Styles.paddingLeft, Styles.paddingRight] }>
                    <Thumbnail square defaultSource={ props.thumbnail } source={ (props.product.thumbnail && props.product.thumbnail != '')? { uri: props.product.thumbnail } : props.thumbnail } />
                </View>
                <View styles={ [Styles.flex, Styles.flexJustifyStart, Styles.flexAlignCenter, Styles.paddingLeft, Styles.paddingRight] }>
                    <Text style={ [styles.title] }>{ props.product.name }</Text>
                    <Text style={ [Styles.textLabel, styles.description] }>{ props.product.description }</Text>
                </View>
            </View>

            <Content contentContainerStyle={ [Styles.flex] }>
                { !props.product.details && <View style={ [Styles.flex, Styles.flexJustifyCenter, Styles.flexAlignCenter] }>
                        <Text style={ [Styles.textAlignCenter, Styles.textPlaceholder, styles.bodyText, { width: 220 }] }>{ props.product.name } information unavailable.</Text>
                    </View>
                }
                { props.product.details && <WebView
                      ref={ (webview) => ( this.webview = webview ) }
                      source={{ html: props.product.details || "" }}
                      startInLoading={ true }
                      renderLoading={ () => (<Spinner color={ Styles['textKimyaKimya' + titleCase(props.gender)].color } />) }
                      onLoad={ props.stopLoading }
                      onError={ props.handleError }
                      style={ [Styles.flex, styles.bodyText] }
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
    title: { fontSize: 24 },
    description: { fontSize: 16 },
    bodyText: { fontSize: 18 }
});

export default ProductInformation;
