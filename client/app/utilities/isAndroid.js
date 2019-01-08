import { Platform } from 'react-native';

export default function isAnroid() {
    return (Platform.OS === 'android');
}
