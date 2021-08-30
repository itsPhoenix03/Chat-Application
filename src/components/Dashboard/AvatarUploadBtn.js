import React, { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { Alert, Button, Modal } from 'rsuite';
import { useProfile } from '../../context/profile.context';
import { useModelState } from '../../misc/custom-hooks';
import { database, storage } from '../../misc/firebase';
import ProfileAvatar from '../ProfileAvatar';

const fileInputTypes = '.png, .jpeg, .jpg';

const acceptedFileTypes = ['image/png', 'image/jpeg', 'image/pjpeg'];
const isValidFile = file => acceptedFileTypes.includes(file.type);

const getBlob = canvas => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('File process error!!!'));
    });
  });
};

const AvatarUploadBtn = () => {
  const { isOpen, open, close } = useModelState();
  const { profile } = useProfile();

  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const avatarEditorRef = useRef();

  const onFileInputChange = ev => {
    const currFiles = ev.target.files;
    if (currFiles.length === 1) {
      const file = currFiles[0];

      if (isValidFile(file)) {
        setImage(file);

        open();
      } else {
        Alert.warning(
          `Not a vaild file type. Selected file type is ${file.type}`,
          4000
        );
      }
    }
  };

  const onUploadClick = async () => {
    const canvas = avatarEditorRef.current.getImageScaledToCanvas();

    setIsLoading(true);
    try {
      const blob = await getBlob(canvas);

      const avatarFileRef = storage
        .ref(`/profile/${profile.uid}`)
        .child('avatar');

      const uploadAvatarRef = await avatarFileRef.put(blob, {
        cacheControl: `public, max-age=${3600 * 24 * 3}`,
      });

      const downloadUrl = await uploadAvatarRef.ref.getDownloadURL();
      const userAvatarRef = database
        .ref(`/profiles/${profile.uid}`)
        .child('avatar');
      await userAvatarRef.set(downloadUrl);

      setIsLoading(false);
      Alert.info('Avatar has been Uploaded', 4000);
    } catch (err) {
      setIsLoading(false);
      Alert.error(err.message, 3000);
    }
  };

  return (
    <div className="mt-3 text-center">
      <ProfileAvatar
        src={profile.avatar}
        name={profile.name}
        className="width-200 height-200 img-fullsize font-huge"
      />
      <label htmlFor="avatar-upload" className="d-block cursor-pointer padded">
        Select New Avatar
        <input
          ref={avatarEditorRef}
          id="avatar-upload"
          type="file"
          className="d-none"
          accept={fileInputTypes}
          onChange={onFileInputChange}
        />
      </label>

      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>Adjust and Upload Avatar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center align-item-center h-100">
            {image && (
              <AvatarEditor
                ref={avatarEditorRef}
                image={image}
                width={200}
                height={200}
                border={10}
                borderRadius={100}
                rotate={0}
              />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            block
            appearance="ghost"
            onClick={onUploadClick}
            disabled={isLoading}
          >
            Upload Avatar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AvatarUploadBtn;
