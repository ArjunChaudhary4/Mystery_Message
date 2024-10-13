"use client"
import {
    Card,
    CardContent,
    CardFooter,
  } from "@/components/ui/card"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import axios from "axios";  
import { useToast } from "@/hooks/use-toast";
import { useEffect , useState } from "react";
import JwtDisplay from "@/helpers/jwtToken";
import { useSession } from "next-auth/react";


interface Message {
  content: string;
  createdAt: Date;
  _id: string
  // Add any other fields that your Message type contains
}

interface MessageCardProps {
  message: Message;
}





// Your MessageCard component here
function MessageCard( { message } : MessageCardProps ) {
 
  const [userId, setUserId] = useState<string | null>(null);

  const {toast} = useToast();
  const { userData } = JwtDisplay();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchSecretCode = async () => {
      try {
        const response = await axios.get(`/api/getSecretCode?name=${session?.user.name}`);
        if (response.data.userId) {
          setUserId(response.data.userId);
        }
      } catch (error) {
        console.error("Error getting SecretCode:", error);
        setUserId(null);
        toast({ title: "Fetch Error", description: "Could not fetch your secret code." });
      }
    };
    if (session?.user.name) {
      fetchSecretCode();
    }
  }, [session]);


  const handleDeleteMessage = async (userId: string , messageId: string) => {
    try {
      console.log(userId , messageId);
        await axios.delete(`/api/deletemesage/${messageId}`, {
          data: { userId }
        });
      toast({title: "Message Successfully Deleted", description:"Changes will be shown on Refresh"});

    } catch (error) {
      console.log(error);
      toast({title: "Message Not Deleted" , variant:'destructive'} )
    
    } };

  return (
    <>
      <Card className="bg-white rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 mx-4 my-6 max-w-md">
        <CardContent className="p-4 text-gray-800">
          <p>{message.content}</p>
        </CardContent>
        <CardFooter className="flex justify-between p-4">
          <AlertDialog>
            <AlertDialogTrigger className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
              Delete
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white rounded-lg p-6 shadow-lg max-w-sm mx-auto">
              <AlertDialogHeader className="mb-4">
                <AlertDialogTitle className="text-lg font-semibold text-red-600">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600">
                This action cannot be undone. This will permanently delete this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex justify-end space-x-2">
                <AlertDialogCancel className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                  onClick={() =>handleDeleteMessage(userData?.id || userId , message._id)}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </>
  );  
}


export default MessageCard
