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
import fetchContacts from '../../actions/contacts';
import searchContacts from '../../actions/contacts';
import invite from '../../actions/invite';

/**
 * Import Components
*/
import InviteComponent from '../../components/views/Invite';
import Error from '../../components/others/Error';

/**
* Import Conditional Libraries
*/
const AndroidKeyboardAdjust = (isAndroid())? require('react-native-android-keyboard-adjust') : undefined; // Version can be specified in package.json

type Props = {};

class Invite extends Component<Props> {

    constructor(props) {

        // Intialize props
        super(props);

        // Initialize state
        this.state = {
            inviting: false,
            loading: false,
            refreshing: false,
            done: false,
            errors: {},
            searchFocused: false,
            searchKey: undefined,
            contacts: props.contacts.map( (contact) => {

                contact.selected = false;

                return contact;
            } ),
            _contacts: props.contacts,
            selected:[]
        };

        // Initialize Class Members
        this.searchInput = undefined;

        // Bind functions to this
        this.back = this.back.bind(this);
        this.handleError = this.handleError.bind(this);
        this.focusSearch = this.focusSearch.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
        this.blurSearch = this.blurSearch.bind(this);
        this.search = this.search.bind(this);
        this.fetchContacts = this.fetchContacts.bind(this);
        this.toggleContactSelection = this.toggleContactSelection.bind(this);
        this.invite = this.invite.bind(this);
    }

    componentDidMount() {

        // if (isEmpty(this.props.contacts)) this.fetchContacts();

        return AndroidKeyboardAdjust.setAdjustPan();
    }

    componentWillReceiveProps(props) {

        let contacts = props.contacts;
        let index;

        this.state.selected.map( (contact) => {

            index = contacts.indexOf(contact);

            if (index !== -1) contacts[index].selected = true;

        } );

        if (this.state.searchKey) this.search(this.state.searchKey);

        return this.setState({ contacts: contacts, _contacts: contacts });
    }

    componentWillUnmount() {
        if (isAndroid()) return AndroidKeyboardAdjust.setAdjustResize();
    }

    back() {
        return Actions.pop();
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

            AndroidKeyboardAdjust.setAdjustPan();
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

    handleError(error) {

        let errors = this.state.errors;

        errors.global = {
            type: (error.response)? error.response.status : error.name,
            message: (error.response)? error.response.statusText : error.message
        };

        Error(errors.global, 5000);

        return this.setState({ errors, loading: false, done: false });
    }

    search(key) {

        if (!key || key === '')
            return this.setState({ _contacts: this.state.contacts, searchKey: undefined });
        else {

            /**
            * Convert the search key into lower case
            */
            let _key = key.toString().toLowerCase();

            /**
            * Filter through the available places to look for possible place
            */
            let _contacts = this.state.contacts.filter( (contact) => {
                return ( (contact.name && contact.name.toLowerCase().search(_key) !== -1) || (contact.familyName && contact.familyName.toLowerCase().search(_key) !== -1) || (contact.givenName && contact.givenName.toLowerCase().search(_key) !== -1) || (contact.middleName && contact.middleName.toLowerCase().search(_key) !== -1) );
            });

            if (isEmpty(_contacts)) {

                if (!this.state.loading && !this.state.refreshing) this.setState({ loading: true });

                return this.props.searchContacts(key).then( (_contacts) => {

                        if (_contacts.errors) {

                            this.handleError(_contacts.errors[0]);

                            return this.setState({ loading: false, refreshing: false, done: false });

                        } else
                            return this.setState({
                                _contacts: _contacts,
                                searchKey: key,
                                loading: false,
                                refreshing: false,
                                done: true
                            });

                    }, this.handleError
                ).catch(this.handleError);
            } else
                return this.setState({ _contacts: _contacts, searchKey: key });
        }
    }

    fetchContacts() {

        // Validation
        let errors = {};

        // Hand;e Data Submission to server
        if (isEmpty(errors)) {

            if (!this.state.loading && !this.state.refreshing) this.setState({ loading: true });

            return this.props.fetchContacts(undefined, this.props.user).then(
                (contacts) => {

                    if (!isEmpty(contacts.errors)) {

                        this.handleError(contacts.errors[0]);

                        return this.setState({ loading: false, refreshing: false, done: false });

                    } else
                        return this.setState({ loading: false, refreshing: false, done: true, errors: {} });
                }, this.handleError)
            .catch(this.handleError);
        }
    }

    toggleContactSelection(contact) {

        let contacts = this.state.contacts;
        let _contacts = this.state._contacts;
        let selected = this.state.selected;

        let index = contacts.indexOf(contact);
        let _index = _contacts.indexOf(contact);
        let __index = selected.indexOf(contact);

        if (__index != -1) {

            selected.splice(__index, 1);

            if (index != -1) contacts[index].selected = false;
            if (_index != -1) _contacts[_index].selected = false;

        } else {

            if (index != -1) contacts[index].selected = true;
            if (_index != -1) _contacts[_index].selected = true;

            selected.push(contact);
        }

        return this.setState({ contacts: contacts, _contacts: _contacts, selected: selected });
    }

    invite() {

        return (
            textWithoutEncoding([], 'Great things are ment to be enjoyed by all. Try the KimyaKimya experience for yourself. Click the link to download: https://kimyakimya-222006.firebaseapp.com/.')
        );

        // // Validation
        // let errors = {};
        // if (isEmpty(this.state.selected)) errors.selected = "No Friends selected.";
        //
        // this.setState({ errors: errors });
        //
        // // Hand;e Data Submission to server
        // if (!isEmpty(errors)) Error(errors[Object.keys(errors)[0]]);
        // else {

            // this.setState({ inviting: true });
            //
            // return this.props.invite(this.state.selected).then(
            //     (data) => {
            //
            //         if (!isEmpty(data.errors)) {
            //
            //             this.handleError(data.errors[0]);
            //
            //             return this.setState({ inviting: false, done: false });
            //
            //         } else {
            //
            //             this.setState({ inviting: false, done: true, errors: {} });
            //
            //             return Actions.pop();
            //         }
            //     }, this.handleError)
            // .catch(this.handleError);
        // }
    }

    render() {
        return (
            <InviteComponent
              gender={ this.props.user.gender }
              back={ this.back }
              inviting={ this.state.inviting }
              loading={ this.state.loading }
              refreshing={ this.state.refreshing }
              errors={ this.state.errors }
              contacts={ this.state._contacts }
              selected={ this.state.selected }
              searchFocused={ this.state.searchFocused }
              focusSearch={ this.focusSearch }
              clearSearch={ this.clearSearch }
              blurSearch={ this.blurSearch }
              search={ this.search }
              fetchContacts={ this.fetchContacts }
              toggleContactSelection={ this.toggleContactSelection }
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
    contacts: PropTypes.array.isRequired,
    fetchContacts: PropTypes.func.isRequired,
    searchContacts: PropTypes.func.isRequired,
    invite: PropTypes.func.isRequired
};

/**
 * Matching State to PropTypes
*/
function mapStateToProps(state) {
    return {
        languages: state.languages,
        user: state.user,
        contacts: state.contacts
    };
}

/**
 * Matching Dispatch to PropTypes
*/
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchContacts: fetchContacts,
        searchContacts: searchContacts,
        invite: invite
    }, dispatch);
}

/**
 * Exporting the Container
*/
export default connect(mapStateToProps, matchDispatchToProps)(Invite);
