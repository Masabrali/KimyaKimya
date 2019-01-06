{ !props.searchFocused &&  <Left>
        <Button dark transparent disabled={ (props.products[props.segment].length < 1)? true:false } onPress={ props.focusSearch }>
            <Icon name="search" ios="ios-search" android="md-search" />
        </Button>
    </Left>
}
{ !props.searchFocused && <Body>
        <Title>Shop</Title>
    </Body>
}
{ props.searchFocused && <Item>
        <Icon name="search" ios="ios-search" android="md-search" />
        <Input
          autoFocus={ true }
          ref={ (input) => ( this.searchInput = input ) }
          placeholder="Search Shop..."
          onChangeText={ props.search }
          autoCapitalization="none"
          autoCorrect={ false }
          clearButtonMode="while-editing"
        />
    </Item>
}
{ props.searchFocused && <Button transparent onPress={ () => ( props.blurSearch(this.searchInput) ) }>
            <Text>Cancel</Text>
    </Button>
}
{ !props.searchFocused && <Right>
        <Button dark transparent badge disabled={ (props.cartSize === 0)? true:false } onPress={ props.checkout }>
            <Icon name="cart" ios="ios-cart" android="md-cart" />
            { props.cartSize !== 0 &&  <Badge primary style={ [Styles.positionAbsolute, Styles.verticalPositionTop, Styles.horizontalPositionRight, styles.cartSizeBadge] }>
                    <Text style={ [Styles.noPadding, Styles.noMargin, styles.cartSizeText] }>{ props.cartSize }</Text>
                </Badge>
            }
        </Button>
    </Right>
}
