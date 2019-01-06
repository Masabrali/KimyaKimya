/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, RefreshControl, WebView } from 'react-native';
import { Container, Content, Spinner } from 'native-base'; // Version can be specified in package.json

/**
 * Import other components
*/
import StatusBar from '../../components/others/StatusBar';

/**
 * Other variables and constants
*/
import Styles from '../styles';

const FAQ = function (props) {
    
    return (
        <Container>
            <StatusBar />
            <Content
              refreshControl={
                <RefreshControl
                  refreshing={ props.loading }
                  onRefresh={ () => props.reload(this.webview) }
                />
              }
              contentContainerStyle={ [Styles.flex] }
            >
                <WebView
                  ref={ (webview) => ( this.webview = webview ) }
                  source={{uri: props.link}}
                  startInLoading={ true }
                  renderLoading={ () => (<Spinner color={ (props.gender == 'female')? Styles.textKimyaKimyaFemale.color : Styles.textKimyaKimyaMale.color } />) }
                  onLoad={ props.stopLoading }
                  onError={ props.handleError }
                  style={ [Styles.flex] }
                />
            </Content>
        </Container>
    );
}

/**
 * Styles
*/
const styles = StyleSheet.create({});

export default FAQ;