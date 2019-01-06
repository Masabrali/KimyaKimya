<View style={ [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter] }>
    <View style={ [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter, Styles.padding] }>
        <Text style={ [styles.title] }>Your order has been received</Text>
        <Text style={ [styles.title] }>and will arrive in:</Text>
        <Text style={ [Styles.textCenter, styles.time] }>10:00</Text>
        <Text style={ [Styles.textCenter, styles.minutes] }>minutes</Text>
    </View>
    <View style={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch] }>
        <View style={ [Styles.padding, Styles.marginBottom, styles.bottomButtonContainer] }>
            <Button block bordered onPress={ props.orderStatus }>
                <Text>Go to Shop</Text>
            </Button>
        </View>
    </View>
</View>
