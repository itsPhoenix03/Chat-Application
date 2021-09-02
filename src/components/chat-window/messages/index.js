import React, { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { database } from '../../../misc/firebase';
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

  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>No Messages Yet!!</li>}
      {canShowMessages &&
        messages.map(msg => <MessageItem key={msg.id} message={msg} />)}
    </ul>
  );
};

export default memo(Messages);