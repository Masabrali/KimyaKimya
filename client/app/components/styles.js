/**
 * Import React and React Native
 */
import { StyleSheet, Platform, StatusBar, Dimensions } from 'react-native'; // Version can be specified in package.json

/**
 * Import Utilities
*/
import isAndroid from '../utilities/isAndroid';

/**
* Get Screen Widht and Height
*/
const { width, height } = Dimensions.get('window');
const screenWidth = width;
const screenHeight = height;

/**
* Style
*/
const styles = StyleSheet.create({
    /**
     * Utilities
    */
    /**
     * FlexBox Style Utilities
    */
    flex: { flex: 1 },
    flex2: { flex: 2 },
    flex3: { flex: 3 },
    lex4: { flex: 4 },
    lex5: { flex: 5 },
    lex6: { flex: 6 },
    flexColumn: { flexDirection: 'column' },
    flexRow: { flexDirection: 'row' },
    flexJustifyStart: { justifyContent: 'flex-start' },
    flexJustifyEnd: { justifyContent: 'flex-end' },
    flexJustifyCenter: { justifyContent: 'center' },
    flexJustifySpaceAround: { justifyContent: 'space-around' },
    flexJustifySpaceBetween: { justifyContent: 'space-between' },
    flexJustifySpaceEvenly: { justifyContent: 'space-evenly' },
    flexAlignCenter: { alignItems: 'center' },
    flexAlignLeft: { alignItems: 'flex-start' },
    flexAlignStart: { alignItems: 'flex-start' },
    flexAlignRight: { alignItems: 'flex-end' },
    flexAlignEnd: { alignItems: 'flex-end' },
    flexAlignStretch: { alignItems: 'stretch' },
    // flexWrap: { flexwrap: 'wrap' },
    /**
    * Position Styles
    */
    positionAbsolute: { position: 'absolute' },
    verticalPositionTop: { top: 0 },
    verticalPositionTopStatusBar: { top: (isAndroid())? StatusBar.currentHeight : 20 },
    verticalPositionBottom: { bottom: 0 },
    verticalPositionBottomStatusBar: { bottom: (isAndroid())? StatusBar.currentHeight : 20 },
    horizontalPositionLeft: { left: 0 },
    horizontalPositionRight: { right: 0 },
    absoluteFillObject: { ...StyleSheet.absoluteFillObject },
    /**
     * Text Style Utilities
    */
    textAlignCenter: { textAlign: 'center' },
    textAlignRight: { textAlign: 'right' },
    textBold: { fontWeight: 'bold' },
    textPrimary: { color: (isAndroid())? '#3f51b5':'#007bff' },
    textSecondary: { color: '#6c757d' },
    textSuccess: { color: '#5cb85c' },
    textWarning: { color: '#f0ad4e' },
    textDanger: { color: '#d9534f' },
    textInfo: { color: '#62B1F6' },
    textLight: { color: '#f4f4f4' },
    textDark: { color: '#000000' },
    textWhite: { color: '#ffffff' },
    textWrapper: { color: '#fbfcfc' },
    textError: { color: '#f43f36' },
    textLink: { color: '#007bff' },
    textPlaceholder: { color: '#777777' },
    textLabel: { color: '#666666' },
    textCopyRight: {
        color: '#555555',
        fontSize: 14
    },
    textDisabled: { color: '#c1c1c7' },
    textKimyaKimyaMale: { color: '#06aad5' },
    textKimyaKimyaFemale: { color: '#ed2593' },
    /**
     * Border Style Utilities
     */
    noBorder: {
        borderWidth: 0,
        borderColor: 'rgba(0, 0, 0, 0)'
    },
    noBorderBottom: {
        borderBottomWidth: 0,
        borderBottomColor: 'rgba(0, 0, 0, 0)'
    },
    border: { borderWidth: 1 },
    borderTop: {
        borderTopWidth: 1,
        borderTopColor: '#c1c1c7'
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#c1c1c7',
    },
    borderPrimary: { borderColor: (isAndroid())? '#3f51b5':'#007bff' },
    borderDisabled: { borderColor: '#c1c1c7' },
    borderError: { borderColor: '#f43f36' },
    borderRadius: { borderRadius: 5 },
    /**
    * Shadow Style Utlities
    */
    noShadow: {
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 0,
        elevation: 0
    },
    shadowTop: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: -3
        },
        shadowRadius: 5,
        shadowOpacity: 0.5
    },
    /**
     * Table
     */
    table: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    cell: {
        padding: 5,
        margin: 5
    },
    /**
     * Margin Style Utilities
     */
    noMargin: { margin: 0 },
    noMarginTop: { marginTop: 0 },
    noMarginBottom: { marginBottom: 0 },
    margin: { margin: 10  },
    marginTop: { marginTop: 10 },
    marginBottom: { marginBottom: 10 },
    marginBottomStatusBar: { marginBottom: (isAndroid())? StatusBar.currentHeight : 20 },
    marginLeft: { marginLeft: 10 },
    marginRight: { marginRight: 10 },
    /**
     * Margin Style Utilities
     */
    noPadding: { padding: 0 },
    padding: { padding: 10 },
    padder: { padding: (isAndroid())? StatusBar.currentHeight : 20 },
    noPaddingLeft: { paddingLeft: 0 },
    noPaddingTop: { paddingTop: 0 },
    noPaddingBottom: { paddingBottom: 0 },
    paddingTop: { paddingTop: 10 },
    paddingTopStatusBar: { paddingTop: (isAndroid())? StatusBar.currentHeight : 20 },
    paddingBottom: { paddingBottom: 10 },
    paddingBottomStatusBar: { paddingBottom: (isAndroid())? StatusBar.currentHeight : 20 },
    paddingLeft: { paddingLeft: 10 },
    paddingRight: { paddingRight: 10 },
    noPaddingRight: { paddingRight: 0 },
    /**
     * Width Utilities
     */
    screenWidth: { width: screenWidth },
    width100: { width: '100%' },
    widthAuto: { width: 'auto' },
    maxWidth100: { maxWidth: '100%' },
    width90: { width: '90%' },
    width75: { width: '75%' },
    width60: { width: '60%' },
    width50: { width: '50%' },
    width33: { width: '33%' },
    width25: { width: '25%' },
    width10: { width: '10%' },
    /**
    * Height Utilities
    */
    screenHeight: { height: screenHeight },
    heightAuto: { height: 'auto' },
    height100: { height: '100%' },
    maxHeight100: { maxHeight: '100%' },
    height90: { height: '90%' },
    height75: { height: '75%' },
    height60: { height: '60%' },
    height50: { height: '50%' },
    height33: { height: '33%' },
    height25: { height: '25%' },
    height10: { height: '10%' },
    /**
     * Header
     */
    headerPaddingTop: { paddingTop: (isAndroid())? StatusBar.currentHeight : 20 },
    /**
     * label Stylling
     */
    label: {
        fontSize: 18,
        color: '#666666'
    },
    /**
     * Placeholder Stylling
     */
    placeholder: {
        fontSize: 18,
        color: '#666666'
    },
    /**
     * Cover Image
     */
    coverImage: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        minHeight: '100%',
        height: 'auto',
        justifyContent: 'center'
    },
    /**
     * Backgrounds
     */
    backgroundPrimary: { backgroundColor: (isAndroid())? '#3f51b5':'#007bff' },
    backgroundSecondary: { backgroundColor: '#6c757d' },
    backgroundSuccess: { backgroundColor: '#5cb85c' },
    backgroundWarning: { backgroundColor: '#f0ad4e' },
    backgroundDanger: { backgroundColor: '#d9534f' },
    backgroundInfo: { backgroundColor: '#62B1F6' },
    backgroundLight: { backgroundColor: '#f4f4f4' },
    backgroundDark: { backgroundColor: '#000000' },
    backgroundWhite: { backgroundColor: '#ffffff' },
    backgroundTransparent: { backgroundColor: 'transparent' },
    backgroundDisabled: { backgroundColor: '#c1c1c7' },
    backgroundSelected: { backgroundColor: '#f1f1f7' },
    backgroundWrapper: { backgroundColor: '#fbfcfc' },
    backgroundWrapperTransparent: { backgroundColor: 'rgba(251, 252, 252, .3)' },
    backgroundHeader: { backgroundColor: '#fbfcfc' },
    backgroundStatusBar: { backgroundColor: '#fbfcfc' },
    backgroundStatusBarTransparent: { backgroundColor: 'rgba(0, 0, 0, .3)' },
    backgroundKimyaKimyaMale: { backgroundColor: '#06aad5' },
    backgroundKimyaKimyaFemale: { backgroundColor: '#ed2593' },
    /**
     * Other Styles
     */
    loader: { backgroundColor: 'rgba(255, 255, 255, 0.8)' },
    /**
     * TabBar
     */
    tabBar: { backgroundColor: '#FFFFFF' },
    /**
     *  ModalFilterPicker
     */
    modalFilterPicker: {
        borderRadius: (isAndroid())? 0 : 5,
        backgroundColor: '#fbfcfc',
        marginBottom: (isAndroid())? StatusBar.currentHeight : 20,
        minWidth: (screenWidth <= 375)? screenWidth - ((isAndroid())? StatusBar.currentHeight : 20) : 320,
        height: (screenHeight <= 812)? screenHeight - ((isAndroid())? (7 * StatusBar.currentHeight) : 140) : 609
    },
    modalFilterPickerOptionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'normal',
        textAlign: 'left',
        paddingHorizontal: 5
    },
    modalFilterPickerSelectedOptionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingHorizontal: 5
    },
    modalFilterPickerCancelButton: {
        flex: 0,
        backgroundColor: '#fbfcfc',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: (isAndroid())? 0 : 10,
        minWidth: (screenWidth <= 375)? screenWidth - ((isAndroid())? StatusBar.currentHeight : 20) : 320
    },
    modalFilterPickerCancelButtonText: {
        fontSize: 18,
        color: (isAndroid())? '#3f51b5' : '#007bff',
        textAlign: 'center'
    },
    /**
     * Wrapper
     */
    wrapper: {
        backgroundColor: '#fbfcfc'
    },
    /**
     * Header
     */
    header: {
        backgroundColor: '#fbfcfc'
    },
    /**
     * Content
     */
    content: {
        backgroundColor: '#ffffff'
    },
    /**
     * Footer
     */
    footer: {
        backgroundColor: '#fbfcfc'
    }
});

export default styles;
