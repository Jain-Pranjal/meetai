import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import type { Channel as StreamChannel } from "stream-chat";
import {
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
  Thread,
  useCreateChatClient,
} from "stream-chat-react";
import { useTRPC } from "@/trpc/client";
import { Loading } from "@/components/Loading";
import "stream-chat-react/dist/css/v2/index.css";
import { EmojiPicker } from 'stream-chat-react/emojis';
import {  SearchIndex } from "emoji-mart";

interface Props {
  meetingId: string;
  userId: string;
  userName: string;
  userImage: string | undefined;
}

export const ChatUI = ({
  meetingId,
  userId,
  userName,
  userImage,
}: Props) => {


  const trpc = useTRPC();
  const { mutateAsync: generateChatToken } = useMutation(
    trpc.meetings.generateChatToken.mutationOptions()
  );

  const [channel, setChannel] = useState<StreamChannel>();

  // making a client instance of the chat and passing the token (frontend client)
  const client = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!,
    userData: {
      id: userId,
      name: userName,
      image: userImage,
    },
    tokenOrProvider: generateChatToken,
  }); 


  useEffect(() => {
    if (!client) return;

// messaging is the channel type and passing the same meetingId as the channel ID
    const channel = client.channel("messaging", meetingId, {
      members: [userId],
    });
    setChannel(channel);
  }, [client, meetingId, userId]);

  if (!client) {
    return (
      <Loading
        title="Loading chat..."
        description="Please wait while we load the chat."
      />
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <Chat client={client}>
        <Channel channel={channel} EmojiPicker={EmojiPicker} emojiSearchIndex={SearchIndex}>
          <Window>
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-23rem)] border-b">
              <MessageList />
            </div>
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};


// The channel React Context provider that wraps all the logic, functionality, and UI basically it is the context provider for the chat
