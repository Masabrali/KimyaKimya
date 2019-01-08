<Button active={ (props.segment == 'condoms') } first style={ [Styles.border, Styles.borderPrimary, (props.segment == 'condoms') && Styles.backgroundPrimary] } onPress={ () => ( props.changeSegment('condoms') ) }>
    <Text style={ [(props.segment == 'condoms')? Styles.textWhite : Styles.textPrimary] }>Condoms</Text>
</Button>
<Button active={ (props.segment == 'pills') } style={ [Styles.border, Styles.borderPrimary, (props.segment == 'pills') && Styles.backgroundPrimary, (props.segment == 'pills')? Styles.textWhite : Styles.textPrimary] } onPress={ () => ( props.changeSegment('pills') ) }>
    <Text style={ [(props.segment == 'pills')? Styles.textWhite : Styles.textPrimary] }>Pills</Text>
</Button>
<Button active={ (props.segment == 'emergency') } last style={ [Styles.border, Styles.borderPrimary, (props.segment == 'emergency') && Styles.backgroundPrimary, (props.segment == 'emergency')? Styles.textWhite : Styles.textPrimary] } onPress={ () => ( props.changeSegment('emergency') ) }>
    <Text style={ [(props.segment == 'emergency')? Styles.textWhite : Styles.textPrimary] }>Emergency</Text>
</Button>
