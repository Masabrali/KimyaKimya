<View style={ [Styles.row] }>
    <View style={ [Styles.cell, Styles.flex3, Styles.flexRow, Styles.flexJustifyStart] }>
        <Text style={ [Styles.textAlignLeft] }>{ product.name }</Text>
    </View>
    <View style={ [Styles.cell] }>
        <Text style={ [Styles.textAlignCenter] }>{ product.quantity }</Text>
    </View>
    <View style={ [Styles.cell, Styles.flex, Styles.flexRow, Styles.flexJustifyEnd] }>
        <Text style={ [Styles.textAlignRight] }>{ currencyFormat(product.amount) }</Text>
    </View>
    <View style={ [Styles.cell, Styles.flexRow, Styles.flexJustifyEnd] }>
        <Button transparent small iconRight>
            <Icon name="more" ios="ios-more" android="md-more" />
        </Button>
    </View>
</View>
