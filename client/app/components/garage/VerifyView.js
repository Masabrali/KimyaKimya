<View style={ [Styles.flex, Styles.wrapper] }>
    <KeyboardAvoidingView style={ [Styles.flex] } behavior="padding" enabled>
        <ScrollView keyboardShouldPersistTaps="handle" contentContainerStyle={ [Styles.flex, Styles.flexColumn, Styles.flexJustifyCenter, Styles.flexAlignStretch] }>

            <Text style={ [Styles.textAlignCenter, Styles.padding, Styles.marginTop, styles.instruction] }>
                A Verification SMS has been sent to the number { props.countryCode + props.phone }
            </Text>

            <View style={ [Styles.flexAlignCenter] }>
                <Text style={ [Styles.textAlignCenter, Styles.padding, styles.instruction, styles.instructionSecondary] }>
                    Please enter the 6-digit Code below to Verify:
                </Text>
            </View>

            <Form block style={ [Styles.padding, styles.verificationForm] }>
                <Item last style={ [Styles.noBorder] } error={ !!props.errors.verificationCode }>
                    <CodeInput
                        autoFocus
                        compareWithCode={ props.verificationCode }
                        codeLength={6}
                        space={5}
                        size={45}
                        inputPosition='center'
                        activeColor='rgba(0, 0, 0, 1)'
                        inactiveColor='rgba(0, 0, 0, 1)'
                        className='border-b'
                        borderType='underline'
                        cellBorderWidth={1}
                        codeInputStyle={ [styles.verificationCode] }
                        containerStyle={ [styles.verificationCodeContainer] }
                        onFulfill={ props.verificationCodeChanged }
                    />
                </Item>

                <Text></Text>

                <Button block onPress={ props.verify }>
                    <Text>Verify</Text>
                </Button>
            </Form>

            <Loader visible={ props.loading && isEmpty(props.errors) } text="Validating Code" />
        </ScrollView>
    </KeyboardAvoidingView>
</View>
