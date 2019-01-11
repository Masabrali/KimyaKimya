/**
 * Import React, { Component }, and React Native Components
*/
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { textWithoutEncoding } from 'react-native-communications';
import { BackHandler } from 'react-native'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import isEmpty from '../../utilities/isEmpty';
import isFunction from '../../utilities/isFunction';
import isAndroid from '../../utilities/isAndroid';

/**
 * Import Actions
*/
import { handlePermission } from '../../actions/contacts';
import searchContacts from '../../actions/contacts';

/**
 * Import Components
*/
import InviteComponent from '../../components/views/Invite';
import Error from '../../components/others/Error';

type Props = {};

class Invite extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize state
        this.state = {
            loading: false,
            done: false,
            errors: {},
            searchFocused: false,
            searchKey: undefined,
            contacts: [],
            selected:[]
        };

        // Initialize Class Members
        this.searchInput = undefined;

        // Bind functions to this
        this.back = this.back.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handlePermission = this.handlePermission.bind(this);
        this.startSearching = this.startSearching.bind(this);
        this.focusSearch = this.focusSearch.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
        this.blurSearch = this.blurSearch.bind(this);
        this.search = this.search.bind(this);
        this.selectContact = this.selectContact.bind(this);
        this.deselectContact = this.deselectContact.bind(this);
        this.invite = this.invite.bind(this);
    }

    componentWillMount() {
        return this.handlePermission();
    }

    back() {
        return Actions.pop();
    }

    handleError(error) {

        let errors = this.state.errors;

        errors.global = {
            type: (error.response)? error.response.status : error.name,
            message: (error.response)? error.response.statusText : error.message
        };

        Error(errors.global, 5000);

        return this.setState({ errors, loading: false, done: false });
    }

    handlePermission() {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (isEmpty(errors)) {

            if (!this.state.loading) this.setState({ loading: true });

            return handlePermission().then(
                (permission) => {

                    if (!isEmpty(permission.errors)) {

                        this.handleError(permission.errors[0]);

                        return this.setState({ loading: false, errors: {}, done: false });

                    } else
                        return this.setState({ loading: false, done: true, errors: {} });

                }, this.handleError)
            .catch(this.handleError);
        }
    }

    startSearching(searchInput) {

        if (isEmpty(this.searchInput)) this.searchInput = searchInput;

        return this.searchInput._root.focus();
    }

    focusSearch(search) {

        if (!isEmpty(search) && !isEmpty(search._root))
            if (!this.searchInput) this.searchInput = search;

        if (isAndroid()) {

            this.androidBackListener = BackHandler.addEventListener("hardwareBackPress", () => {

                if (this.state.searchFocused) {

                    this.blurSearch(this.searchInput);

                    return true;
                }

                return false;
            });
        }

        return this.setState({ searchFocused: true });
    }

    clearSearch(search) {

        if (!isEmpty(search) && !isEmpty(search._root)) {

            if (!this.searchInput) this.searchInput = search;

            search._root.clear();

            this.search();

            return this.setState({ searchKey: undefined });
        }
    }

    blurSearch(search) {

        if (this.state.searchKey) this.search();

        if (!isEmpty(search._root)) {

            search._root.clear();

            search._root.blur();

            if (!this.searchInput) this.searchInput = search;
        }

        return this.setState({ searchFocused: false, searchKey: undefined });
    }

    search(key) {

        if (!key || key === '')
            return this.setState({ searchKey: undefined });
        else {

            /**
            * Convert the search key into lower case
            */
            let _key = key.toString().toLowerCase();

            /**
            * Set loading and Search for contact
            */
            if (!this.state.loading) this.setState({ loading: true });

            return this.props.searchContacts(key, this.props.user).then( (contacts) => {

                    if (contacts.errors) {

                        this.handleError(contacts.errors[0]);

                        return this.setState({ loading: false, done: false, errors: {} });

                    } else
                        return this.setState({
                            contacts: contacts,
                            searchKey: key,
                            loading: false,
                            done: true
                        });

                }, this.handleError
            ).catch(this.handleError);
        }
    }

    selectContact(contact, searchInput) {

        let selected = this.state.selected;
        let index = selected.indexOf(contact);

        if (index == -1) selected.push(contact);

        if (isEmpty(this.searchInput)) this.searchInput = searchInput;

        this.blurSearch(this.searchInput);

        return this.setState({ selected: selected });
    }

    deselectContact(contact) {

        let selected = this.state.selected;
        let index = selected.indexOf(selected.find( (_contact) => (contact.recordID == _contact.recordID) ));

        if (index != -1) selected.splice(index, 1);

        return this.setState({ selected: selected });
    }

    invite() {

        let contacts = [];
        let _contacts = [];
        let phoneNumbers;

        this.state.selected.map( (contact) => {

            phoneNumbers = contact.phoneNumbers.map( (phoneNumber) => ( phoneNumber.number ) );

            _contacts = [ ..._contacts, ...phoneNumbers ];

            return phoneNumbers;
        } );

        _contacts.map( (contact) => {

            if (contacts.indexOf(contact) == -1) contacts.push(contact);

            return contact;
        } );

        console.log(contacts)

        return (
            textWithoutEncoding(['+255757543371', '+255652273194'], 'Great things are ment to be enjoyed by all. Try the KimyaKimya experience for yourself. Click the link to download: https://kimyakimya-222006.firebaseapp.com/.')
        );
    }

    render() {
        return (
            <InviteComponent
              gender={ this.props.user.gender }
              back={ this.back }
              loading={ this.state.loading }
              errors={ this.state.errors }
              contacts={ this.state.contacts }
              selected={ this.state.selected }
              startSearching={ this.startSearching }
              searchFocused={ this.state.searchFocused }
              focusSearch={ this.focusSearch }
              clearSearch={ this.clearSearch }
              blurSearch={ this.blurSearch }
              search={ this.search }
              selectContact={ this.selectContact }
              deselectContact={ this.deselectContact }
              invite={ this.invite }
            />
        );
    }
}

/**
 * Container PropTypes
*/
Invite.propTypes = {
    languages: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    searchContacts: PropTypes.func.isRequired
};

/**
 * Matching State to PropTypes
*/
function mapStateToProps(state) {
    return {
        languages: state.languages,
        user: state.user
    };
}

/**
 * Matching Dispatch to PropTypes
*/
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        searchContacts: searchContacts
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(Invite);
