"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import JwtDisplay from "../../../helpers/jwtToken";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

const SendMessage = () => {
  const [userExist, setUserExist] = useState<boolean | null>(null);
  const [secretCode, setSecretCode] = useState<string>("");
  const [content, setContent] = useState<string>(""); // Added state for message content
  const { userData } = JwtDisplay();
  const { toast } = useToast(); // Moved toast initialization outside handleSubmit
  const { data: session } = useSession();

  const handleCheck = async () => {
    if (secretCode === "user not exist") {
      setUserExist(false);
      return;
    }
    try {
      const response = await axios.get(`/api/login?secretCode=${secretCode}`);
      setUserExist(response.data.userExist);
    } catch (error) {
      console.error("Error during checking user existence:", error);
      // Optionally, handle error state
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.patch("/api/send-message", {
        secretCode: secretCode,
        content: content,
      });

      if (response.data.message == "user is not accepting the messsages") {
        toast({
          title: "User is not accepting the messsages currently",
          variant: "destructive",
        });
      } else {
        toast({ title: "Message sent successfully" });
        setContent(""); // Clear the content after sending
      }
    } catch (error) {
      console.error("Error during sending message:", error);
      toast({ title: "Error sending message", variant: "destructive" }); // Show an error toast
    }
  };

  return (
    <div className="flex flex-col items-start">
      <h2 className="text-xl font-bold">Send Message by their Secret Code</h2>
      <input
        type="text"
        className="input m-4 h-8"
        placeholder="Enter the Secret Code"
        value={secretCode}
        onChange={(e) => setSecretCode(e.target.value)}
      />
      <Button
        onClick={handleCheck}
        disabled={!userData && !Boolean(session?.user)}
      >
        Check
      </Button>

      {userExist === true ? (
        <>
          <Textarea
            placeholder="Type your message here."
            value={content} // Bind the textarea value to content
            onChange={(e) => setContent(e.target.value)} // Update content state on change
            className="m-4 h-4"
          />
          <Button
            onClick={handleSubmit}
            disabled={
              (!userData && !Boolean(session?.user)) ||
              userExist !== true ||
              !content
            }
          >
            Send Message
          </Button>
        </>
      ) : userExist === false ? (
        <p>User Not Exist</p>
      ) : null}
    </div>
  );
};

export default SendMessage;
