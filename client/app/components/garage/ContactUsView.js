<Container>
    <Header noShadow style={ [Styles.backgroundWrapper, Styles.borderBottom] }>
        <Left>
            <Button iconLeft transparent onPress={ props.back }>
                <Icon name="arrow-back" ios="ios-arrow-back" android="md-arrow-back" style={ [isAndroid() && Styles.textDark] } />
                { isIOS() && <Text>Cancel</Text> }
            </Button>
        </Left>
        <Body style={ [isAndroid() && Styles.marginLeft, isAndroid() && Styles.paddingLeft] }>
            <Title style={ [Styles.textDark, Styles.textBold] }>Contact Us</Title>
        </Body>
        <Right />
    </Header>

    <StatusBar backgroundColor="#fbfcfc" barStyle="dark-content" />

    <Content keyboardShouldPersistTaps="handle" contentContainerStyle={ [isIOS() && props.keyboardHidden && Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch, Styles.paddingTop, Styles.paddingBottom] }>

        <Form block style={ [Styles.flex, Styles.padding, Styles.marginBottom, styles.contactUsForm] }>
            <View style={ [Styles.flex] }>

                <Item stackedLabel error={ !isEmpty(props.errors.message) } style={ [Styles.marginBottom] }>
                    <Label>Your Message:</Label>
                    <Textarea rowSpan={3} style={ [Styles.textAlignLeft, Styles.width100] } />
                </Item>

                <View style={ [Styles.flex] }>
                    <Item stackedLabel error={ !isEmpty(props.errors.screenshot) } style={ [Styles.flex, Styles.marginBottom, Styles.noBorder] }>
                        <Label>Screenshot(optional):</Label>
                        <TouchableHighlight style={ [Styles.flex, Styles.padding] } onPress={ () => {
                            if (!props.screenshot) return props.pickImage();
                            else
                                return ActionSheet.show({
                                    options: [
                                        { text: 'Remove', icon: 'trash', iconColor: isAndroid() && Styles.textDanger.color },
                                        { text: 'Cancel', icon: (isAndroid())? 'close-circle' : 'close-circle-outline', iconColor: isAndroid() && Styles.textPrimary.color }
                                    ],
                                    cancelButtonIndex: 1,
                                    destructiveButtonIndex: 0,
                                    title: "Screenshot Options"
                                }, (index) => {

                                    if (index == 0) return props.removeImage();

                                    return;
                                });
                        } }>
                            <View style={ [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter, !props.screenshot && styles.screenshotPlaceholder, props.screenshot && styles.screeshotContainer] }>
                                { !props.screenshot && <Icon name="add-circle" ios="ios-add-circle" android="md-add-circle" style={ [Styles.textLabel, styles.screeshotPlaceholderIcon] } /> }
                                { props.screenshot && <Image source={ props.screenshot } style={ [Styles.flex, styles.screenshot] } /> }
                            </View>
                        </TouchableHighlight>
                    </Item>
                </View>
            </View>

            <Button block onPress={ props.contactUs }>
                <Text>Contact Us</Text>
            </Button>
        </Form>

    </Content>
</Container>
