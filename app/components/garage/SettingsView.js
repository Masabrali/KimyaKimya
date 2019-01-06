<Container style={ [Styles.wrapper] }>
    <StatusBar backgroundColor="#fbfcfc" barStyle="dark-content" />
    <Content>
        <List>
            <ListItem itemDivider></ListItem>
            <ListItem onPress={ props.account }>
                <Left>
                    <IconBox name="key" ios="ios-key" android="md-key" />
                    <Text style={ [Styles.paddingLeft] }>Account</Text>
                </Left>
                <Right>
                    <Icon name="arrow-forward" ios="ios-arrow-forward" android="md-arrow-forward" />
                </Right>
            </ListItem>
            <ListItem>
                <Left>
                    <IconBox name="notifications" ios="ios-notifications" android="md-notifications" backgroundColor="#dc3545" />
                    <Text style={ [Styles.paddingLeft] }>Notifications</Text>
                </Left>
                <Right>
                    <Switch value={ true } onValueChange={ props.notifications } />
                </Right>
            </ListItem>
            <ListItem itemDivider></ListItem>
            <ListItem onPress={ props.help }>
                <Left>
                    <IconBox name="information" ios="ios-information" android="md-information" backgroundColor="#12a2b8" />
                    <Text style={ [Styles.paddingLeft] }>Need Help</Text>
                </Left>
                <Right>
                    <Icon name="arrow-forward" ios="ios-arrow-forward" android="md-arrow-forward" />
                </Right>
            </ListItem>
            <ListItem onPress={ props.invite }>
                <Left>
                    <IconBox name="heart" ios="ios-heart" android="md-heart" backgroundColor="#ec407a" />
                    <Text style={ [Styles.paddingLeft] }>Tell a Friend</Text>
                </Left>
                <Right>
                    <Icon name="arrow-forward" ios="ios-arrow-forward" android="md-arrow-forward" />
                </Right>
            </ListItem>
        </List>
    </Content>
</Container>
