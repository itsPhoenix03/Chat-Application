import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Icon,
  Modal,
  Schema,
} from 'rsuite';
import firebase from 'firebase/app';
import { useModelState } from '../misc/custom-hooks';
import { database } from '../misc/firebase';

const { StringType } = Schema.Types;
const model = Schema.Model({
  name: StringType().isRequired('Name is Required!'),
  description: StringType().isRequired('Description is Required!'),
});

const INITIAL_FORM = {
  name: '',
  description: '',
};

const CreateRoomBtnModel = () => {
  const { isOpen, open, close } = useModelState();

  const [formValue, setFormValue] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef();

  const onFormChange = useCallback(value => {
    setFormValue(value);
  }, []);

  const onSubmit = async () => {
    if (!formRef.current.check()) return;

    setIsLoading(true);

    const newRoomdata = {
      ...formValue,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
    };

    try {
      await database.ref('rooms').push(newRoomdata);
      Alert.info(`${formValue.name} has been created!`, 4000);
      setIsLoading(false);
      setFormValue(INITIAL_FORM);
      close();
    } catch (err) {
      setIsLoading(false);
      Alert.error(err.message, 4000);
    }
  };

  return (
    <div className="mt-1">
      <Button block color="orange" onClick={open}>
        <Icon icon="creative" /> Create New Chat Room
      </Button>

      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>New Chat Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            fluid
            onChange={onFormChange}
            formValue={formValue}
            model={model}
            ref={formRef}
          >
            <FormGroup>
              <ControlLabel>Room Name</ControlLabel>
              <FormControl name="name" placeholder="Enter Room Name..." />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl
                componentClass="textarea"
                rows={5}
                name="description"
                placeholder="Enter Description..."
              />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            block
            appearance="primary"
            onClick={onSubmit}
            disabled={isLoading}
          >
            Create Chat Room
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateRoomBtnModel;
