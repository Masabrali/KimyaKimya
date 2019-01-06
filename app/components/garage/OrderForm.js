<View style={ [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch] }>
    <View style={ [Styles.flex] }>
        <ScrollView contentContainerStyle={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter] }>
            <View style={ [Styles.padding, styles.orderContainer] }>
                <View style={ [Styles.table, styles.orderTable] }>
                    <View style={ [Styles.row, styles.orderRow] }>
                        <View style={ [Styles.cell, Styles.flex2, styles.orderCell, styles.orderParticulars] }>
                            <Text>Durex</Text>
                        </View>
                        <View style={ [Styles.cell, Styles.flexAlignCenter, styles.orderCell, styles.orderQuantity] }>
                            <Text style={ [Styles.textAlignCenter] }>1</Text>
                        </View>
                        <View style={ [Styles.cell, Styles.flex, Styles.flexAlignRight, styles.orderCell, styles.orderAmount] }>
                            <Text style={ [Styles.textAlignRight] }>2,500</Text>
                        </View>
                        <View style={ [Styles.cell, Styles.flexAlignCenter, styles.orderCell, styles.orderAction] }>
                            <Button transparent onPress={ props.product }>
                                <Text>Edit</Text>
                            </Button>
                        </View>
                    </View>
                    <View style={ [Styles.row, styles.orderRow] }>
                        <Text></Text>
                    </View>
                    <View style={ [Styles.row, styles.orderRow] }>
                        <Button bordered block style={ [Styles.flex] } onPress={ props.shop }>
                            <Text>Add More Products</Text>
                        </Button>
                    </View>
                </View>
            </View>
        </ScrollView>
    </View>
    <View style={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter] }>
        <View style={ [Styles.padding, styles.orderContainer] }>
            <View style={ [Styles.table, styles.orderTable, Styles.paddingBottom, Styles.marginBottom] }>
                <View style={ [Styles.row, styles.orderRow] }>
                    <View style={ [Styles.cell, Styles.flex2, styles.orderCell, styles.orderTotalParticulars] }>
                        <Text style={ [Styles.textBold] }>Total</Text>
                    </View>
                    <View style={ [Styles.cell, Styles.flex, Styles.flexAlignRight, styles.orderCell, styles.orderAmount] }>
                        <Text style={ [Styles.textAlignRight, Styles.textBold] }>2,500</Text>
                    </View>
                </View>
                <View style={ [Styles.row, styles.orderRow] }>
                    <Text></Text>
                </View>
            </View>
            <Button block style={ [styles.orderButton] } onPress={ props.order }>
                <Text>Order Now</Text>
            </Button>
        </View>
    </View>
</View>

<Content padder contentContainerStyle={ [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter] }>
    <View style={ [Styles.table] }>
        {
            props.order.products.map((product) => {
                return (
                    <View key={ product.id } style={ [Styles.row] }>
                        <View style={ [Styles.cell, Styles.flex2] }>
                            <Text>{ product.name }</Text>
                        </View>
                    </View>
                );
            })
        }
    </View>
</Content>

<View style={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch, Styles.padder] }>
    <View style={ [Styles.table, Styles.paddingBottom, Styles.marginBottom] }>
        <View style={ [Styles.row] }>
            <View style={ [Styles.cell, Styles.flex2] }>
                <Text style={ [Styles.textBold] }>Total</Text>
            </View>
            <View style={ [Styles.cell, Styles.flex, Styles.flexAlignRight] }>
                <Text style={ [Styles.textAlignRight, Styles.textBold] }>{ currencyFormat(props.order.amount) }</Text>
            </View>
        </View>
    </View>

    <Text></Text>

    <Button block onPress={ props.checkout }>
        <Text>{ "Order Now for " + currencyFormat(props.order.amount) }</Text>
    </Button>
</View>

<Content padder contentContainerStyle={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter] }>

<View style={ [Styles.table] }>
    {
        props.order.products.map((product) => {
            return (
                <View key={ product.id } style={ [Styles.row] }>
                    <View style={ [Styles.cell, Styles.flex2] }>
                        <Text>{ product.name }</Text>
                    </View>
                    <View style={ [Styles.cell, Styles.flexAlignCenter] }>
                        <Text style={ [Styles.textAlignCenter] }>{ product.quantity }</Text>
                    </View>
                    <View style={ [Styles.cell, Styles.flex, Styles.flexAlignRight] }>
                        <Text style={ [Styles.textAlignRight] }>{ product.amount }</Text>
                    </View>
                </View>
            );
        })
    }
</View>
