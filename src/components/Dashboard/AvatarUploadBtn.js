import React, { useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { Alert, Button, Modal } from 'rsuite';
import { useModelState } from '../../misc/custom-hooks';

const fileInputTypes = '.png, .jpeg, .jpg';

const acceptedFileTypes = ['image/png', 'image/jpeg', 'image/pjpeg'];
const isValidFile = file => acceptedFileTypes.includes(file.type);

const AvatarUploadBtn = () => {
  const { isOpen, open, close } = useModelState();
  const [image, setImage] = useState(null);

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

  return (
    <div className="mt-3 text-center">
      <label htmlFor="avatar-upload" className="d-block cursor-pointer padded">
        Select New Avatar
        <input
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
          <Button block appearance="ghost">
            Upload Avatar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AvatarUploadBtn;
