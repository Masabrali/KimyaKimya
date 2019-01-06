/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, List, ListItem, Left, Body, Right, Icon, Text, Switch } from 'native-base'; // Version can be specified in package.json

/**
 * Import other components
*/
import IconBox from './../others/IconBox';
import StatusBar from '../../components/others/StatusBar';

/**
 * Other variables and constants
*/
import Styles from '../styles';

const Settings = function (props) {
    return (
        <Container style={ [Styles.wrapper] }>
            <StatusBar />
            <Content>
                <List>
                    <ListItem itemDivider></ListItem>
                    <ListItem thumbnail onPress={ props.account }>
                        <Left>
                            <IconBox name="key" ios="ios-key" android="md-key" />
                        </Left>
                        <Body>
                            <Text>Account</Text>
                        </Body>
                        <Right>
                            <Icon name="arrow-forward" ios="ios-arrow-forward" android="md-arrow-forward" />
                        </Right>
                    </ListItem>
                    <ListItem itemDivider></ListItem>
                    <ListItem thumbnail onPress={ props.help }>
                        <Left>
                            <IconBox name="information" ios="ios-information" android="md-information" backgroundColor="#12a2b8" />
                        </Left>
                        <Body>
                            <Text>Need Help</Text>
                        </Body>
                        <Right>
                            <Icon name="arrow-forward" ios="ios-arrow-forward" android="md-arrow-forward" />
                        </Right>
                    </ListItem>
                    <ListItem thumbnail onPress={ props.invite }>
                        <Left>
                            <IconBox name="heart" ios="ios-heart" android="md-heart" backgroundColor="#ec407a" />
                        </Left>
                        <Body>
                            <Text>Tell a Friend</Text>
                        </Body>
                        <Right>
                            <Icon name="arrow-forward" ios="ios-arrow-forward" android="md-arrow-forward" />
                        </Right>
                    </ListItem>
                </List>
            </Content>
        </Container>
    );
}

/**
 * Styles
*/
const styles = StyleSheet.create({});

export default Settings;
