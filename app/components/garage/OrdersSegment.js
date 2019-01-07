<Button active={ (props.segment == 'previous') } first style={ [Styles.border, isEmpty(props.selected) && Styles.borderPrimary, !isEmpty(props.selected) && Styles.borderDisabled, (props.segment == 'previous' && isEmpty(props.selected)) && Styles.backgroundPrimary, (props.segment == 'previous' && !isEmpty(props.selected)) && Styles.backgroundDisabled, (props.segment != 'previous' && !isEmpty(props.selected)) && Styles.backgroundWrapper] } disabled={ !isEmpty(props.selected) } onPress={ () => ( props.changeSegment('previous') ) }>
    <Text style={ [(props.segment == 'previous')? Styles.textWhite : Styles.textPrimary] }>Previous</Text>
</Button>
<Button active={ (props.segment == 'drafts') } style={ [Styles.border, Styles.borderPrimary, (props.segment == 'drafts') && Styles.backgroundPrimary] } disabled={ !isEmpty(props.selected) } onPress={ () => ( props.changeSegment('drafts') ) }>
    <Text style={ [(props.segment == 'drafts')? Styles.textWhite : Styles.textPrimary] }>Drafts</Text>
</Button>
<Button active={ (props.segment == 'queued') } last style={ [Styles.border, Styles.borderPrimary, (props.segment == 'queued') && Styles.backgroundPrimary, (props.segment == 'queued')? Styles.textWhite : Styles.textPrimary] } disabled={ !isEmpty(props.selected) } onPress={ () => ( props.changeSegment('queued') ) }>
    <Text style={ [(props.segment == 'queued')? Styles.textWhite : Styles.textPrimary] }>
      Queued { !isEmpty(props.orders.queued) && (": " + Object.keys(props.orders.queued).length) }
    </Text>
</Button>
