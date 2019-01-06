<Container>
    <Header noShadow style={ [Styles.backgroundHeader, Styles.borderBottom] }>
        <Left>
            <Button iconLeft transparent onPress={ props.back }>
                <Icon name="arrow-back" ios="ios-arrow-back" android="md-arrow-back" style={ [isAndroid() && Styles.textDark] } />
                { isIOS() && <Text> Orders</Text> }
            </Button>
        </Left>
        <Body style={ [isAndroid() && Styles.marginLeft, isAndroid() && Styles.paddingLeft] }>
            <Title style={ [Styles.textDark, Styles.textBold] }>Queued Order</Title>
            <Subtitle style={ [Styles.textSecondary, Styles.textBold] }>{ Moment(props.order.date).format('DD MMM YYYY') + " at " + Moment(props.order.date).format('HH:mm') }</Subtitle>
        </Body>
        <Right>
            <Button iconRight transparent onPress={ props.toggleCart }>
                { props.cartCollapsed && <Icon name="expand" ios="ios-expand" android="md-expand" style={ [isAndroid() && Styles.textDark] } /> }

                { !props.cartCollapsed && <Icon name="contract" ios="ios-contract" android="md-contract" style={ [isAndroid() && Styles.textDark] } /> }
            </Button>
        </Right>
    </Header>

    <StatusBar />

    { !props.cartCollapsed && <Content contentContainerStyle={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch] }>
            <List
              contentContainerStyle={ [Styles.table] }
              dataArray={ props.order.products }
              renderRow={ (product) =>
                  <ListItem key={ product.id }>
                      <View style={ [Styles.row, Styles.paddingTop, Styles.paddingBottom] }>
                          <Left>
                              <Text numberOfLines={1} style={ [Styles.textAlignLeft] }>{ product.quantity + "  " + product.name }</Text>
                          </Left>
                          <Right style={ [Styles.flex] }>
                              <Text style={ [Styles.textAlignRight] }>{ currencyFormat(product.amount) }</Text>
                          </Right>
                      </View>
                  </ListItem>
              }
            />
        </Content>
    }

    <Content contentContainerStyle={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch] }>
        <List contentContainerStyle={ [Styles.table] }>
            <ListItem noIndent>
                <View style={ [Styles.row, Styles.paddingTop, Styles.paddingBottom] }>
                    <Left>
                        <Text style={ [Styles.textAlignLeft, Styles.textBold] }>
                            { props.order.quantity + " Item" + ((props.order.quantity > 1)? "s":"") + ", Totalling" }
                        </Text>
                    </Left>
                    <Right style={ [Styles.flex, Styles.paddingRight] }>
                        <Text style={ [Styles.textAlignRight, Styles.textBold] }>
                            { currencyFormat(props.order.amount) }
                        </Text>
                    </Right>
                </View>
            </ListItem>
            <ListItem noIndent>
                <View style={ [Styles.row, Styles.paddingTop, Styles.paddingBottom] }>
                    <Left>
                        <Text style={ [Styles.textAlignLeft, Styles.textBold] }>Delivery</Text>
                    </Left>
                    <Right style={ [Styles.flex, Styles.paddingRight] }>
                        <Text style={ [Styles.textAlignRight, Styles.textBold] }>
                            { currencyFormat(props.order.delivery) }
                        </Text>
                    </Right>
                </View>
            </ListItem>
            <ListItem noIndent>
                <View style={ [Styles.row, Styles.paddingTop, Styles.paddingBottom] }>
                    <Left>
                        <Text style={ [Styles.textAlignLeft, Styles.textBold] }>Grand Total</Text>
                    </Left>
                    <Right style={ [Styles.flex, Styles.paddingRight] }>
                        <Text style={ [Styles.textAlignRight, Styles.textBold] }>
                            { currencyFormat(props.order.amount + props.order.delivery) }
                        </Text>
                    </Right>
                </View>
            </ListItem>
        </List>

        <View style={ [Styles.paddingTop, Styles.marginTop] }>
            <View style={ [Styles.flexAlignCenter, Styles.paddingLeft, Styles.paddingRight, Styles.marginLeft, Styles.marginRight, Styles.marginBottom] }>
                <Text style={ [styles.title] }>
                    { "Your order has been received and will arrive" + ((!isEmpty(props.order.location.name) || !isEmpty(props.order.location.address))? (" at " + ((props.order.location.name || '') + ((props.order.location.address)? (', ' + props.order.location.address) : ''))) : "") + " in:" }
                </Text>
                <Text style={ [Styles.textAlignCenter, styles.time] }>
                    { props.duration + " " + props.durationUnits }
                </Text>
            </View>

            <View style={ [Styles.flexAlignCenter, Styles.marginTop] }>
                <Text style={ [styles.title] }>Contact KimyaKimya Hotpoint:</Text>
                <View style={ [Styles.flexRow, Styles.flexJustifySpaceEvenly, Styles.flexAlignCenter] }>
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
        </View>
    </Content>

    <View style={ [Styles.padding, Styles.borderTop] }>
        <Button block onPress={ props.confirmOrderDelivery }>
            <Text>Confirm Order Delivery</Text>
        </Button>
    </View>

    <Loader visible={ props.loading && isEmpty(props.errors) } text="Confirming Delivery..." spinnerColor={ (props.gender == 'female')? Styles.textKimyaKimyaFemale.color : Styles.textKimyaKimyaMale.color } />
</Container>
