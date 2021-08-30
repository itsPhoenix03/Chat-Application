import React, { useState } from 'react';
import firebase from 'firebase/app';
import { Alert, Button, Icon, Tag } from 'rsuite';
import { auth } from '../../misc/firebase';

const ProviderBlock = () => {
  const [isConnected, setIsConnected] = useState({
    'google.com': auth.currentUser.providerData.some(
      data => data.providerId === 'google.com'
    ),
    'facebook.com': auth.currentUser.providerData.some(
      data => data.providerId === 'facebook.com'
    ),
  });

  const updateIsConnected = (providerId, value) => {
    setIsConnected(p => {
      return {
        ...p,
        [providerId]: value,
      };
    });
  };

  const unlink = async providerId => {
    try {
      if (auth.currentUser.providerData.length === 1)
        throw new Error(`You can not diconnect from ${providerId}`);
      auth.currentUser.unlink(providerId);
      updateIsConnected(providerId, false);
      Alert.info(`Disconnected from ${providerId}`, 3000);
    } catch (err) {
      Alert.error(err.message, 3000);
    }
  };

  const unlinkFacbook = () => unlink('facebook.com');

  const unlinkGoogle = () => unlink('google.com');

  const link = async provider => {
    try {
      auth.currentUser.linkWithPopup(provider);
      Alert.info(`Connected to ${provider.providerId}`, 3000);
      updateIsConnected(provider.providerId, true);
    } catch (err) {
      Alert.error(err.message, 3000);
    }
  };

  const linkFacbook = () => link(new firebase.auth.FacebookAuthProvider());

  const linkGoogle = () => link(new firebase.auth.GoogleAuthProvider());

  return (
    <div>
      {isConnected['google.com'] && (
        <Tag color="green" closable onClose={unlinkGoogle}>
          <Icon icon="google" /> Connected
        </Tag>
      )}
      {isConnected['facebook.com'] && (
        <Tag color="blue" closable onClose={unlinkFacbook}>
          <Icon icon="facebook" /> Connected
        </Tag>
      )}

      <div className="mt-2">
        {!isConnected['google.com'] && (
          <Button block color="green" onClick={linkGoogle}>
            <Icon icon="google" /> Link to Google
          </Button>
        )}
        {!isConnected['facebook.com'] && (
          <Button block color="blue" onClick={linkFacbook}>
            <Icon icon="facebook" /> Link to Facebook
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProviderBlock;
