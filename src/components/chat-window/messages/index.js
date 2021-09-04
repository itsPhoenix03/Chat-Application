import React, { memo, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Alert } from 'rsuite';
import { auth, database } from '../../../misc/firebase';
import { tranToArrWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const Messages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  useEffect(() => {
    const messagesRef = database.ref('/messages');

    messagesRef
      .orderByChild('roomId')
      .equalTo(chatId)
      .on('value', snap => {
        const data = tranToArrWithId(snap.val());

        setMessages(data);
      });

    return () => messagesRef.off('value');
  }, [chatId]);

  const handleAdmin = useCallback(
    async uid => {
      const adminRef = database.ref(`/rooms/${chatId}/admins`);
      let alertMsg;

      await adminRef.transaction(admins => {
        if (admins) {
          if (admins[uid]) {
            admins[uid] = null;
            alertMsg = `Removed Admin Permission`;
          } else {
            admins[uid] = true;
            alertMsg = `Granted Admin Permission`;
          }
        }
        return admins;
      });
      Alert.info(alertMsg, 4000);
    },
    [chatId]
  );

  const handleLike = useCallback(async msgId => {
    const { uid } = auth.currentUser;
    const messageRef = database.ref(`/messages/${msgId}`);

    await messageRef.transaction(msg => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          --msg.likeCount;
          msg.likes[uid] = null;
        } else {
          ++msg.likeCount;
          if (!msg.likes) msg.likes = {};
          msg.likes[uid] = true;
        }
      }
      return msg;
    });
  }, []);

  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>No Messages Yet!!</li>}
      {canShowMessages &&
        messages.map(msg => (
          <MessageItem
            key={msg.id}
            message={msg}
            handleAdmin={handleAdmin}
            handleLike={handleLike}
          />
        ))}
    </ul>
  );
};

export default memo(Messages);
