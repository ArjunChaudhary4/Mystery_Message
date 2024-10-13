"use client";
import React, { useEffect, useState } from "react";
import { Message } from "@/model/User";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import MessageCard from "@/components/components/MessageCard";
import JwtDisplay from "../../../helpers/jwtToken";
import { useSession } from "next-auth/react";

const CodeAccept = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [acceptMessages, setAcceptMessages] = useState<boolean | undefined>(undefined);
  const [secCod, setSecCod] = useState<string | null>(null);

  const { userData } = JwtDisplay();
  const { toast } = useToast();
  const { data: session } = useSession();


  const getLoggedIN = async (tempSecretCode: string) => {
    try {
      const response = await axios.get(`/api/login?secretCode=${tempSecretCode}`);
      console.log(response);  
      setMessages(response.data.userData.messages);
      setAcceptMessages(response.data.userData.isAcceptingMessage);
    } catch (error) {
      console.error("Error during login:", error);
      toast({ title: "Login Error", description: "Could not log you in." });
    }
  };

  useEffect(() => {
    const fetchSecretCode = async () => {
      try {
        const response = await axios.get(`/api/getSecretCode?name=${session?.user.name}`);
        if (response.data.secretCode) {
          setSecCod(response.data.secretCode);
        }
      } catch (error) {
        console.error("Error getting SecretCode:", error);
        setSecCod(null);
        toast({ title: "Fetch Error", description: "Could not fetch your secret code." });
      }
    };

    if (session?.user.name) {
      fetchSecretCode();
    }
  }, [session]);

  const copyToClipboard = async () => {
    if (secCod) {
      try {
        await navigator.clipboard.writeText(secCod);
        toast({ title: "Copied", description: "Your code has been copied" });
      } catch (error) {
        console.error(error);
        toast({ title: "Copy Error", description: "Failed to copy code." });
      }
    }
  };
  
useEffect(() => {
  if (secCod) {
    getLoggedIN(secCod);
  }
}, [secCod]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.patch("/api/accept-message", {
        secretCode : secCod,
        acceptMessages: !acceptMessages,
      });
      toast({ title: response.data.message });
      setAcceptMessages(!acceptMessages);
    } catch (error) {
      console.error("Error updating message acceptance:", error);
      toast({ title: "Update Error", description: "Could not update message acceptance." });
    }
  };

  return (
    <div className="flex flex-col items-start w-1/2 pl-10">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Copy Your Unique Code</h2>
        <input
          type="text"
          value={secCod || ""}
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
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id}
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
