<Container style={ [Styles.screenHeight] }>
    <AnimatedHeader
      style={ [Styles.flex] }
      title={ props.product.name }
      titleStyle={{ fontSize: 22, left: 20, bottom: 20, color: '#ffffff' }}
      renderLeft={ () =>
          <Button light iconLeft transparent onPress={ props.back }>
              <Icon name="arrow-back" ios="ios-arrow-back" android="md-arrow-back" style={ [styles.headerIcon] } />
              { isIOS() && <Text>Shop</Text> }
          </Button>
      }
      renderRight={ () =>
          <Button light iconRight transparent onPress={ props.productInformation }>
              <Icon name={ (isAndroid())? "information-circle" : "information-circle-outline" } ios={ (isIOS())? "ios-information-circle-outline" : "" } android={ (isAndroid())? "md-information-circle" : "" } style={ [styles.headerIcon] } />
          </Button>
      }
      headerMaxHeight={300}
      imageSource={{ uri: props.product.cover }}
      toolBarColor='transparent'
    >
        <Content contentContainerStyle={ [Styles.flexColumn, Styles.flexjustifyCenter, Styles.flexAlignCenter] }>

            {
                (props.errors.global !== undefined || props.errors.quantity !== '') && <View style={ [Styles.padding, Styles.flexAlignCenter] }>
                  { !!props.errors.global && <Text style={ [Styles.textError] }>{ props.errors.global.type + " " + props.errors.global.message }</Text> }
                  { !!props.errors.quantity && <Text style={ [Styles.textError] }>{ props.errors.quantity }</Text> }
                </View>
            }

            <Form block style={ [Styles.padding, Styles.noPaddingTop, styles.productForm] }>

                { props.product.types && <Item fixedLabel block icon picker style={ [Styles.paddingLeft, Styles.marginBottom] }>
                        <Label>Type</Label>
                        <Right>
                            <Picker
                              mode="dropdown"
                              iosIcon={ <Icon name="ios-arrow-down" ios="ios-arrow-down" android="md-arrow-down" /> }
                              placeholder={ "Select " + titleCase(props.product.category) + " type" }
                              titleIOS={ "Select " + titleCase(props.product.category) + " type" }
                              onValueChange={ props.typeChanged }
                              selectedValue={ props.type }
                            >
                                {
                                    props.product.types.map((type) => {
                                        return (<Picker.Item key={ type.id } label={ type.name } value={ type } />);
                                    })
                                }
                            </Picker>
                        </Right>
                    </Item>
                }

                <Item fixedLabel block icon style={ [Styles.marginBottom] } error={ !!props.errors.quantity }>
                    <Label>Quantity</Label>
                    <Right style={ [Styles.flex, Styles.flexRow, Styles.flexJustifyCenter] }>
                        <Button iconRight transparent onPress={ props.decreaseQuantity }>
                            <Icon name={ (isAndroid)? "remove-circle" : "remove-circle-outline" } ios={ (isIOS())? "ios-remove-circle-outline" : "" } android={ (isAndroid)? "md-remove-circle" : "" } />
                        </Button>

                        <Input
                          keyboardType="number-pad"
                          defaultValue={ props.quantity.toString() }
                          value={ props.quantity.toString() }
                          onChangeText={ props.quantityChanged }
                          style={ [Styles.flex, Styles.textBold, Styles.textAlignCenter, styles.quantityInput] }
                        />

                        <Button iconLeft transparent onPress={ props.increaseQuantity }>
                            <Icon name={ (isAndroid)? "add-circle" : "add-circle-outline" } ios={ (isIOS())? "ios-add-circle-outline" : "" } android={ (isAndroid)? "md-add-circle" : "" } />
                        </Button>
                    </Right>
                </Item>

                <Text />

                <Button block onPress={ props.action }>
                    <Text>{ "Add to Order for " + currencyFormat(props.product.price * props.quantity) }</Text>
                </Button>
            </Form>
        </Content>
    </AnimatedHeader>
</Container>
