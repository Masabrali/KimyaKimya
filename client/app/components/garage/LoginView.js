<View style={ [Styles.flex, Styles.wrapper] }>
    <KeyboardAvoidingView style={ [Styles.flex] } behavior="padding" enabled>
        <ScrollView keyboardShouldPersistTaps="handle" contentContainerStyle={ [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch] }>

            <Text style={ [Styles.textAlignCenter, Styles.padding, Styles.marginTop, styles.instruction] }>
                Please confirm your country code and enter your phone number to continue:
            </Text>

            <Form block style={ [Styles.padding, styles.loginForm] }>

                <Item picker icon error={!!props.errors.countryCode} style={ [Styles.paddingLeft, Styles.marginBottom] } onPress={ props.toggleCountryCodePicker }>
                    {
                        (!props.country)? <Text style={ [Styles.placeholder, Styles.padding] }>Tanzania, United Republic Of</Text> : <Text style={ [Styles.padding] }>{ titleCase(props.country) }</Text>
                    }

                    <Right>
                        <Icon name="arrow-forward" active={ false } fontSize={ 16 } />
                    </Right>
                </Item>

                <Item fixedLabel last error={!props.errors.countryCode && !!props.errors.phone} style={ [Styles.marginBottom] }>
                    <Label style={ [styles.phoneLabel] }>{ props.countryCode }</Label>
                    <Input
                      autoFocus
                      dataDetectorType="phoneNumber"
                      keyboardType="phone-pad"
                      clearButtonMode="while-editing"
                      maxLength={10}
                      onChangeText={ props.phoneChanged }
                      style={ [styles.phoneInput] }
                    />
                </Item>

                <Text></Text>

                <Button block onPress={ props.confirmPhone }>
                    <Text>Continue</Text>
                </Button>
            </Form>
        </ScrollView>
    </KeyboardAvoidingView>

    <ModalFilterPicker
      visible={ props.countryCodePickerVisible }
      onSelect={ props.countryCodeChanged }
      onCancel={ props.toggleCountryCodePicker }
      options={ props.countries }
      selectedOption={ props.countryCode }
      placeholderText="Search..."
      title="Select Country"
    />

    <Loader visible={ (props.loading && isEmpty(props.errors)) } title={ props.countryCode + props.phone } text={ "Verifying " + props.countryCode + props.phone } />
</View>
