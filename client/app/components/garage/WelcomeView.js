<View style={[Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch, Styles.wrapper] }>
    <View style={ [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter] }>
        <Image style={ [Styles.margin, styles.logo] } source={ require('../../assets/logo.png') } />
    </View>
    <View style={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch, Styles.paddingBottom, styles.footer] }>
        <View style={ [Styles.padding] }>
            <Button bordered block style={ [Styles.marginTop, Styles.marginLeft, Styles.marginRight, styles.footerButton] } onPress={ props.login }>
                <Text style={ styles.buttonText }>Get Started</Text>
            </Button>
        </View>
    </View>

    <Loader visible={ (props.loading && isEmpty(props.errors)) } />
</View>
