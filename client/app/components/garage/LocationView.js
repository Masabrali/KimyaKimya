<Body>
    <Title>Delivery Location</Title>
</Body>
<Right>
    <Button iconLeft transparent onPress={ props.addLocation }>
        <Icon active name="add" />
    </Button>
</Right>

v<Header noShadow hasSegment>
    <Left>
        <Button transparent onPress={ props.back }>
            <Icon name="arrow-back" />
        </Button>
    </Left>
</Header>
<Form block style={ [Styles.paddingLeft, styles.locationForm] }>
    <Item style={ [Styles.marginLeft, Styles.borderRadius, styles.locationItem] }>
        <Icon name="pin" ios="ios-pin" android="md-pin" />
        <Input
          autoFocus={ false }
          ref={ (input) => ( this.searchInput = input ) }
          placeholder="Delivery Location"
          placeholderStyle={ [styles.searchInputPlaceholder] }
          onFocus={ props.focusSearch }
          onChangeText={ props.search }
          autoCorrect={ false }
          clearButtonMode="while-editing"
        />
    </Item>
</Form>
<List>
    <ListItem first icon style={ [Styles.marginBottom] } onPress={ props.location }>
        <Left>
            <Icon name="pin" ios="ios-pin" android="md-pin" />
        </Left>
        <Body style={ [Styles.paddingTop, Styles.paddingBottom] }>
            <Text>
                Block 22, Mafere Street,
            </Text>
            <Text>
                Mwananyamala, Kinondoni, Dar es salaam
            </Text>
        </Body>
        <Right>
            <Icon name="arrow-forward" />
        </Right>
    </ListItem>
    <ListItem icon style={ [Styles.marginBottom] } onPress={ props.location }>
        <Left>
            <Icon name="pin" ios="ios-pin" android="md-pin" />
        </Left>
        <Body style={ [Styles.paddingTop, Styles.paddingBottom] }>
            <Text>
                Block 22, Mafere Street,
            </Text>
            <Text>
                Mwananyamala, Kinondoni, Dar es salaam
            </Text>
        </Body>
        <Right>
            <Icon name="arrow-forward" />
        </Right>
    </ListItem>
    <ListItem icon style={ [Styles.marginBottom] } onPress={ props.location }>
        <Left>
            <Icon name="pin" ios="ios-pin" android="md-pin" />
        </Left>
        <Body style={ [Styles.paddingTop, Styles.paddingBottom] }>
            <Text>
                Block 22, Mafere Street,
            </Text>
            <Text>
                Mwananyamala, Kinondoni, Dar es salaam
            </Text>
        </Body>
        <Right>
            <Icon name="arrow-forward" />
        </Right>
    </ListItem>
</List>
