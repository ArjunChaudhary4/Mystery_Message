"use client";
import React, { useEffect } from "react";
import { Message } from "@/model/User";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import MessageCard from "@/components/components/MessageCard";
import JwtDisplay from "../../../helpers/jwtToken";

const CodeAccept = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [acceptMessages, setAcceptMessages] = useState<boolean | undefined>(
    undefined
  );
  const { userData } = JwtDisplay();
  const { toast } = useToast();

  const getLoggedIN = async (tempSecretCode: string) => {
    try {
      console.log(tempSecretCode);

      const response = await axios.get(
        `/api/login?secretCode=${tempSecretCode}`
      );
      console.log(response);

      // Assuming the response has a property 'isAcceptingMessage'
      setAcceptMessages(response.data.userData.isAcceptingMessage);
      setMessages(response.data.userData.messages);
    } catch (error) {
      console.error("Error during login:", error);
      // Optionally, set an error state or display a message to the user
    }
  };

  useEffect(() => {
    getLoggedIN(userData?.secretCode);
  }, [userData]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(userData?.secretCode);
      toast({ title: "Copied", description: "Your code has been copied" });
    } catch (error) {
      console.error(error);
      toast({ title: "Failed to copy URL." });
    }
  };

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post("/api/accept-message", {
        userId: userData?.id,
        acceptMessages: !acceptMessages,
      });
      toast({ title: response.data.message });
      setAcceptMessages(!acceptMessages);
    } catch (error) {
      console.log(acceptMessages);

      console.error(error);
      toast({ title: "Error updating message acceptance." });
    }
  };

  return (
    <div className="flex flex-col items-start w-1/2 pl-10">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Copy Your Unique Code</h2>
        <input
          type="text"
          value={userData?.secretCode}
          readOnly
          className="input m-4 h-4"
        />
        <Button onClick={copyToClipboard}>Copy</Button>
        <div className="mt-4">
          <Switch
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
          />
          <span className="ml-2">
            Accept Messages: {acceptMessages ? "On" : "Off"}
          </span>
        </div>
      </div>

      <div>
        {messages && messages.length > 0 ? (
          messages.map((message) => (
<MessageCard
  key={message._id} // Use _id for the unique key
  message={message}
/>
          ))
        ) : (
          <p>No Messages to display</p>
        )}
      </div>
    </div>
  );
};

export default CodeAccept;
