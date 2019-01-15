/**
 * Import React, { Component }, and React Native Components
*/
import React from 'react';
import { Router, Modal, Scene, Tabs, Actions } from 'react-native-router-flux';
import { Platform, Component, StatusBar } from 'react-native';
import { Text, Button, Icon } from 'native-base'; // Version can be specified in package.json

/**
* Import Utilities
*/
import isAndroid from './utilities/isAndroid';

/**
 * Import Containers
*/
import Welcome from './containers/views/Welcome';
import Login from './containers/views/Login';
import Verify from './containers/views/Verify';
import Gender from './containers/views/Gender';
import Birth from './containers/views/Birth';

import Shop from './containers/views/Shop';
import Product from './containers/views/Product';
import ProductInformation from './containers/views/ProductInformation';

import Orders from './containers/views/Orders';
import ReOrder from './containers/views/ReOrder';
import QueuedOrder from './containers/views/QueuedOrder';

import Settings from './containers/views/Settings';
import Account from './containers/views/Account';
import ChangePhone from './containers/views/Login';
import EditPhone from './containers/views/Login';
import VerifyPhone from './containers/views/Verify';
import EditGender from './containers/views/Gender';
import EditBirth from './containers/views/Birth';
import Help from './containers/views/Help';
import FAQ from './containers/views/FAQ';
import ContactUs from './containers/views/ContactUs';
import Terms from './containers/views/Terms';
import License from './containers/views/License';
import Website from './containers/views/Website';
import Invite from './containers/views/Invite';

import Order from './containers/views/Order';
import EditProduct from './containers/views/Product';
import Location from './containers/views/Location';
import OrderSummary from './containers/views/OrderSummary';
import OrderStatus from './containers/views/OrderStatus'; // Version can be specified in package.json

/**
 * NativeBase
*/

/**
 * Import Styles
 */
import Styles from './components/styles';

const navigationBarStyle = [Styles.backgroundHeader, Styles.textDark, Styles.noShadow, Styles.borderBottom];

const tabIcon = (icon, _icon) => {
    return (
        <Icon name={ icon } ios={ 'ios-' + icon } android={ 'md-' + icon } active={ (_icon.focused)? true:false } style={{ color: (_icon.focused)? _icon.activeTintColor : _icon.inactiveTintColor }} />
    );
};

const Routes = function () {
    return (
        <Router>
            <Modal>
                <Scene key="root" hideNavBar={ true }>
                    <Scene key="welcome" component={ Welcome } hideNavBar={ true } />
                    <Scene key="login" component={ Login } action="login" title="Your Phone Number" init={ true } back={ false } hideNavBar={ true } />
                    <Scene key="verify" component={ Verify } action="verify" title="Verify Phone Number" backTitle="Login" hideNavBar={ false } navigationBarStyle={ navigationBarStyle } />
                    <Scene key="gender" component={ Gender } action="gender" title="Your Gender" init={ true } back={ false } hideNavBar={ true } />
                    <Scene key="birth" component={ Birth } action="birth" title="Your Birthday" backTitle="Gender" hideNavBar={ false } navigationBarStyle={ navigationBarStyle } />
                </Scene>

                <Scene key="app" hideNavBar={ true }>
                    <Tabs key="home" tabBarPosition="bottom" swipeEnabled={ true } inactiveTintColor={ Styles.textKimyaKimyaMale.color } activeTintColor={ Styles.textKimyaKimyaFemale.color } init={ true } back={ false } tabBarStyle={ [Styles.backgroundWrapper, Styles.shadowTop, { paddingTop: 10, paddingBottom: 5, height: 60 }] } tabStyle={ [Styles.flexJustifyCenter, Styles.flexAlignCenter] } labelStyle={ [{ fontSize: 14 }] }>

                        <Scene key="orders" component={ Orders } title="Orders" tabBarLabel="Orders" icon={ (icon) => (tabIcon('list', icon)) } hideNavBar={ true } />

                        <Scene key="shop" component={ Shop } title="Shop" tabBarLabel="Shop" icon={ (icon) => (tabIcon('pricetags', icon)) } hideNavBar={ true } initial={ true } />

                        <Scene key="settings" tabBarLabel="Settings" icon={ (icon) => (tabIcon('settings', icon)) } navigationBarStyle={ navigationBarStyle }>
                            <Scene key="preferences" component={ Settings } title="Settings" />
                            <Scene key="account" component={ Account } title="Account" backTitle="Settings" hideNavBar={ true } />
                        </Scene>
                    </Tabs>

                    <Scene key="product" component={ Product } action="order" title="Product" backTitle="Shop" hideNavBar={ true } />
                    <Scene key="productInformation" component={ ProductInformation } title="" backTitle="Back" hideNavBar={ false } navigationBarStyle={ navigationBarStyle.concat([Styles.noBorderBottom]) } />

                    <Scene key="reOrder" component={ ReOrder } title="Your Previous Order" backTitle="Orders" hideNavBar={ true } />

                    <Scene key="queuedOrder" component={ QueuedOrder } title="Delivery Status" backTitle="Orders" hideNavBar={ true } />

                    <Scene key="changePhone" component={ ChangePhone } action="phone" title="Your Phone Number" backTitle="Account" hideNavBar={ false } navigationBarStyle={ navigationBarStyle } />
                    <Scene key="editPhone" component={ EditPhone } action="edit" title="New Phone Number" backTitle="Back" hideNavBar={ false } navigationBarStyle={ navigationBarStyle } />
                    <Scene key="verifyPhone" component={ VerifyPhone } action="phone" title="Verify Phone Number" backTitle="Phone" hideNavBar={ false } navigationBarStyle={ navigationBarStyle } />
                    <Scene key="editGender" component={ EditGender } action="edit" title="Change Gender" backTitle="Account" hideNavBar={ false } navigationBarStyle={ navigationBarStyle } />
                    <Scene key="editBirth" component={ EditBirth } action="edit" title="Change Birthday" backTitle="Account" hideNavBar={ false } navigationBarStyle={ navigationBarStyle } />

                    <Scene key="help">
                        <Scene key="support" component={ Help } title="Help" backTitle="Settings" hideNavBar={ true } />
                        <Scene key="faq" component={ FAQ } title="FAQ" backTitle="Back" hideNavBar={ false } navigationBarStyle={ navigationBarStyle } />
                        <Scene key="terms" component={ Terms } title="Terms and Privacy Policy" backTitle="Back" hideNavBar={ false } navigationBarStyle={ navigationBarStyle } />
                        <Scene key="license" component={ License } title="License" backTitle="Back" hideNavBar={ false } navigationBarStyle={ navigationBarStyle } />
                        <Scene key="website" component={ Website } title="kimyakimya.app" backTitle="Back" hideNavBar={ false } navigationBarStyle={ navigationBarStyle } />
                    </Scene>
                    <Scene key="invite" component={ Invite } title="Tell a Friend" backTitle="Settings" hideNavBar={ true } />
                </Scene>

                <Scene key="contactus" component={ ContactUs } title="Contact Us" backTitle="Cancel" hideNavBar={ true } />

                <Scene key="loginTerms" component={ Terms } title="Terms and Privacy Policy" backTitle="Login" hideNavBar={ false } navigationBarStyle={ navigationBarStyle } />

                <Scene key="checkout" hideNavBar={ true }>
                    <Scene key="order" component={ Order } title="Your Order" hideNavBar={ true } />
                    <Scene key="editProduct" component={ EditProduct } action="edit" title="Product" hideNavBar={ true } />

                    <Scene key="location" component={ Location } title="Select Location" hideNavBar={ true } />
                    <Scene key="orderSummary" component={ OrderSummary } title="Checkout" backTitle="Location" hideNavBar={ true } navigationBarStyle={ navigationBarStyle } />
                    <Scene key="orderStatus" component={ OrderStatus } title="Delivery Status" init={ true } back={ false } hideNavBar={ true } />
                </Scene>
            </Modal>
        </Router>
    );
}

export default Routes;
