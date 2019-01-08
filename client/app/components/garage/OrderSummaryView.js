<View style={ [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch] }>
    <View style={ [Styles.flex] }>
        <ScrollView contentContainerStyle={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter] }>
            <View style={ [Styles.padding, Styles.padding, styles.locationFormContainer] }>
                <Form style={ styles.locationForm }>
                    <Item picker fixedLabel style={ [Styles.paddingBottom, Styles.marginBottom] }>
                        <Label>City:</Label>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="ios-arrow-down-outline" />}
                          style={ styles.locationCity }
                          placeholder="City e.g Dar es salaam"
                          placeholderStyle={{ color: "#a1a1a7" }}
                          placeholderIconColor="#007aff"
                          onValueChange={ props.citySelected }
                          selectedValue="1"
                        >
                            <Picker.Item label="Dar es salaam" value="1" />
                            <Picker.Item label="Tanga" value="2" />
                            <Picker.Item label="Arusha" value="3" />
                        </Picker>
                    </Item>
                    <Item picker fixedLabel style={ [Styles.paddingBottom, Styles.marginBottom] }>
                        <Label>Area:</Label>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="ios-arrow-down-outline" />}
                          style={ styles.locationArea }
                          placeholder="Area e.g Kinondoni"
                          placeholderStyle={{ color: "#a1a1a7" }}
                          placeholderIconColor="#007aff"
                          onValueChange={ props.areaSelected }
                          selectedValue="1"
                        >
                            <Picker.Item label="Kinondoni" value="1" />
                            <Picker.Item label="Mwananyamala" value="2" />
                            <Picker.Item label="Magomeni" value="3" />
                        </Picker>
                    </Item>
                    <Item picker fixedLabel style={ [] }>
                        <Label>Street:</Label>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="ios-arrow-down-outline" />}
                          style={ styles.locationCity }
                          placeholder="Street e.g Hanasifu"
                          placeholderStyle={{ color: "#a1a1a7" }}
                          placeholderIconColor="#007aff"
                          onValueChange={ props.citySelected }
                          selectedValue="1"
                        >
                            <Picker.Item label="Hanasifu" value="1" />
                            <Picker.Item label="Shamba" value="2" />
                            <Picker.Item label="Mkwajuni" value="3" />
                        </Picker>
                    </Item>
                    <Item floatingLabel style={ [Styles.paddingBottom, Styles.marginBottom] }>
                        <Label>More Address Details:</Label>
                        <Input multiline={ true } style={ styles.locationDetails } />
                    </Item>
                    <Text></Text>
                    <Button iconLeft transparent>
                        <Icon name="pin" />
                        <Text>Use My Current Location</Text>
                    </Button>
                </Form>
            </View>
        </ScrollView>
    </View>
    <View style={ [Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignCenter] }>
        <View style={ [Styles.padding, styles.locationFormContainer] }>
            <Button block onPress={ props.location }>
                <Text>Save</Text>
            </Button>
        </View>
    </View>
</View>
