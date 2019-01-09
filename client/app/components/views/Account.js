/**
 * Import React and React Native
 */
import React from 'react';
import { StyleSheet, RefreshControl, View } from 'react-native';
import { Container, ActionSheet, Header, Content, Spinner, List, ListItem, Left, Body, Title, Right, Button, Icon, Text } from 'native-base';
import Moment from 'moment'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import titleCase from '../../utilities/titleCase';
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

const Account = function (props) {
    return (
        <Container>
            <Header noShadow style={ [Styles.backgroundHeader, Styles.borderBottom] }>
                <Left>
                    <Button iconLeft transparent onPress={ props.back }>
                        <Icon name="arrow-back" ios="ios-arrow-back" android="md-arrow-back" style={ [isAndroid() && Styles.textDark] } />
                        { isIOS() && <Text>Settings</Text> }
                    </Button>
                </Left>
                <Body style={ [isAndroid() && Styles.marginLeft, isAndroid() && Styles.paddingLeft] }>
                    <Title style={ [Styles.textDark, Styles.textBold] }>Account</Title>
                </Body>
                <Right>
                    <Button iconRight transparent onPress={ () => {

                        ActionSheet.show({
                            options: [
                                { text: 'Log Out', icon: 'log-out', iconColor: isAndroid() && Styles.textDanger.color },
                                { text: 'Cancel', icon: (isAndroid())? 'close-circle' : 'close-circle-outline', iconColor: isAndroid() && Styles.textPrimary.color }
                            ],
                            cancelButtonIndex: 1,
                            destructiveButtonIndex: 0,
                            title: "Account Options"
                        }, (index) => {

                            if (index == 0) return props.logout();

                            return;
                        } );
                    } }>
                        <Icon name="more" ios="ios-more" android="md-more" style={ [isAndroid() && Styles.textDark] } />
                    </Button>
                </Right>
            </Header>

            <StatusBar />

            <Content
              refreshControl={
                <RefreshControl
                  refreshing={ props.refreshing }
                  onRefresh={ props.fetchUser }
                />
              }
            >
                <List>
                    { !props.loading && <ListItem itemDivider></ListItem> }
                    { props.loading && <ListItem itemDivider>
                            <View style={ [Styles.flex, Styles.flexRow, Styles.flexJustifyCenter] }>
                                <Spinner color={ Styles['textKimyaKimya' + titleCase(props.user.gender)].color } />
                            </View>
                        </ListItem>
                    }
                    <ListItem onPress={ props.changePhone } disabled={ props.loading }>
                        <Left>
                            <Text style={ [Styles.label] }>Change Phone Number</Text>
                        </Left>
                        <Right>
                            <Icon name="arrow-forward" />
                        </Right>
                    </ListItem>
                    <ListItem onPress={ props.editGender } disabled={ props.loading }>
                        <Left>
                            <Text style={ [Styles.label] }>Gender: </Text>
                            <Text style={ [Styles.textAlignRight] }>{ titleCase(props.user.gender) }</Text>
                        </Left>
                        <Right>
                            <Icon name="arrow-forward" />
                        </Right>
                    </ListItem>
                    <ListItem onPress={ props.editBirth } disabled={ props.loading }>
                        <Left>
                            <Text style={ [Styles.label] }>Birth: </Text>
                            <Text style={ [Styles.textAlignRight] }>{ props.user.birth && Moment(props.user.birth).format('dddd, MMMM DD, YYYY') }</Text>
                        </Left>
                        <Right>
                            <Icon name="arrow-forward" />
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

export default Account;
