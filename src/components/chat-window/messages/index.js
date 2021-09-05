/* eslint-disable consistent-return */
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Alert } from 'rsuite';
import { auth, database, storage } from '../../../misc/firebase';
import { groupBy, tranToArrWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const messagesRef = database.ref('/messages');

const shouldScrollToBottom = (node, threshold = 30) => {
  const precnetage =
    (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0;

  return precnetage > threshold;
};

const Messages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);
  const selfRef = useRef();

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  useEffect(() => {
    const node = selfRef.current;

    messagesRef
      .orderByChild('roomId')
      .equalTo(chatId)
      .on('value', snap => {
        const data = tranToArrWithId(snap.val());

        setMessages(data);

        if (shouldScrollToBottom(node, 45)) node.scrollTop = node.scrollHeight;
      });

    setTimeout(() => {
      node.scrollTop = node.scrollHeight;
    }, 200);

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

  const handleDelete = useCallback(
    async (msgId, file) => {
      // eslint-disable-next-line no-alert
      if (!window.confirm('Delete this Message?')) return;

      const isLast = messages[messages.length - 1].id === msgId;

      const update = {};

      update[`/messages/${msgId}`] = null;

      if (isLast && messages.length > 1) {
        update[`/rooms/${chatId}/lastMessage`] = {
          ...messages[messages.length - 2],
          msgId: messages[messages.length - 2].id,
        };
      }

      if (isLast && messages.length === 1) {
        update[`rooms/${chatId}/lastMessage`] = null;
      }

      try {
        await database.ref().update(update);
        Alert.info('Message Deleted');
      } catch (err) {
        return Alert.error(err.message);
      }

      if (file) {
        try {
          const fileRef = storage.refFromURL(file.url);
          await fileRef.delete();
        } catch (err) {
          Alert.error(err.message, 100000);
        }
      }
    },
    [chatId, messages]
  );

  const renderMessages = () => {
    const groups = groupBy(messages, item =>
      new Date(item.createdAt).toDateString()
    );
    const items = [];
    Object.keys(groups).forEach(date => {
      items.push(
        <li key={date} className="text-center mb-1 padded font-bolder">
          {date}
        </li>
      );

      const msgs = groups[date].map(msg => (
        <MessageItem
          key={msg.id}
          message={msg}
          handleAdmin={handleAdmin}
          handleLike={handleLike}
          handleDelete={handleDelete}
        />
      ));

      items.push(...msgs);
    });

    return items;
  };

  return (
    <ul ref={selfRef} className="msg-list custom-scroll">
      {isChatEmpty && <li>No Messages Yet!!</li>}
      {canShowMessages && renderMessages()}
    </ul>
  );
};

export default memo(Messages);
