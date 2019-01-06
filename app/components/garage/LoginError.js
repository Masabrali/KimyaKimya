{ (!!props.errors.global || !!props.errors.countryCode || !!props.errors.phone) && <View style={ [Styles.padding, Styles.flexAlignCenter] }>
      { !!props.errors.global && <Text style={ [Styles.textError] }>{ props.errors.global.type + " " + props.errors.global.message }</Text> }
      { !!props.errors.countryCode &&  <Text style={ [Styles.textError] }>{ props.errors.countryCode }</Text> }
      { !!props.errors.phone && <Text style={ [Styles.textError] }>{ props.errors.phone }</Text> }
    </View>
}
