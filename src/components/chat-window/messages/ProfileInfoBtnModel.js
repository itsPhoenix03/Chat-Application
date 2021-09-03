import React from 'react';
import { Button, Modal } from 'rsuite';
import { useModelState } from '../../../misc/custom-hooks';
import ProfileAvatar from '../../ProfileAvatar';

const ProfileInfoBtnModel = ({ profile, children, ...btnProps }) => {
  const { isOpen, open, close } = useModelState();

  const shortName = profile.name.split(' ')[0];
  const { name, avatar, createdAt } = profile;

  const memberSince = new Date(createdAt).toLocaleDateString();

  return (
    <>
      <Button {...btnProps} onClick={open}>
        {shortName}
      </Button>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>About {shortName}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <ProfileAvatar
            src={avatar}
            name={name}
            className="width-200 height-200 img-fullsize font-huge"
          />

          <h4 className="mt-2">{name}</h4>
          <p>Member Since: {memberSince}</p>
        </Modal.Body>
        <Modal.Footer>
          {children}
          <Button onClick={close} color="cyan">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileInfoBtnModel;
