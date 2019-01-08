import { Platform } from 'react-native';

export default function isIOS() {
    return (Platform.OS === 'ios');
}
