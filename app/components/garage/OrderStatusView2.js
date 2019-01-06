<Container style={ [Styles.wrapper] }>
    <Header noShadow style={ [Styles.backgroundWrapper, Styles.borderBottom] }>
        <Left>
            <Button iconLeft transparent onPress={ props.orders }>
                <Icon name="arrow-back" ios="ios-arrow-back" android="md-arrow-back" style={ [isAndroid() && Styles.textDark] } />
                { isIOS() && <Text> Orders</Text> }
            </Button>
        </Left>
        <Body style={ [isAndroid() && Styles.paddingLeft] }>
            <Title style={ [Styles.textDark, Styles.textBold] }>Queued Order</Title>
            <Subtitle style={ [Styles.textSecondary, Styles.textBold] }>{ Moment(props.order.date).format('DD MMM YYYY') }</Subtitle>
        </Body>
        <Right>
            <Button iconRight transparent onPress={ props.shop }>
                { isAndroid() && <Icon name="pricetags" ios="ios-pricetags" android="md-pricetags" style={ [Styles.textDark] } /> }
                { isIOS() && <Text>Shop </Text> }
                { isIOS() && <Icon name="arrow-forward" ios="ios-arrow-forward" android="md-arrow-forward" /> }
            </Button>
        </Right>
    </Header>

    <Content padder contentContainerStyle={ [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch] }>
        <View style={ [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter] }>
            <Text style={ [styles.title] }>Your order has been received</Text>
            <Text style={ [styles.title] }>
                { "and will arrive" + ((!isEmpty(props.order.location.name) || !isEmpty(props.order.location.address))? (" at" + ((props.order.location.name || '') + ((props.order.location.address)? (', ' + props.order.location.address) : ''))) : "") + " in:" }
            </Text>
            <Text style={ [Styles.textAlignCenter, styles.time] }>
                { props.duration + " " + props.durationUnits }
            </Text>

            { props.duration && <View style={ [Styles.flexAlignCenter, Styles.marginTop] }>
                    <Text style={ [styles.title] }>Order has not arrived yet?</Text>
                    <View style={ [Styles.flexRow, Styles.flexJustifySpaceEvenly, Styles.flexAlignCenter, Styles.marginTop] }>
                        <View style={ [Styles.padding, Styles.width50] }>
                            <Button block iconLeft bordered onPress={ props.messageHotpoint }>
                                <Icon name="chatbubbles" ios="ios-chatbubbles" android="md-chatbubbles" />
                                <Text>Message</Text>
                            </Button>
                        </View>
                        <View style={ [Styles.padding, Styles.width50] }>
                            <Button block iconLeft success bordered  onPress={ props.callHotpoint }>
                                <Icon name="call" ios="ios-call" android="md-call" />
                                <Text>Call</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            }
        </View>

        <View style={ [Styles.padding, Styles.width100] }>
            <Button block onPress={ props.confirmOrderDelivery }>
                <Text>Confirm Order Delivery</Text>
            </Button>
        </View>
    </Content>
</Container>
