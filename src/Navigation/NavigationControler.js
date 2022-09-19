import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    Alert,
    PermissionsAndroid,
    Platform,
    Text,
} from 'react-native';
import { CredentialsContext } from '../Components/Context/CredentialsContext';
import StackNavigation from './StackNavigation/StackNavigation';
import TabNavigation from './AppNavigation/TabNavigation/TabNavigation';
import AppStackNavigation from './AppNavigation/AppStackNavigation/AppStackNavigation';

const NavigationController = () => {
    const [userData, setUserData] = useState('');
    const [userLoginState, setUserLoginState] = useState('');

    return (
        <CredentialsContext.Consumer>
            {({ storedCredentials }) => (
                <>
                    {storedCredentials ? <AppStackNavigation /> : <StackNavigation />}
                </>
            )}
        </CredentialsContext.Consumer>
    );


};

export default NavigationController;
