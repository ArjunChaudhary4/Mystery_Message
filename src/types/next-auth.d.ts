import 'next-auth';
import { DefaultSession } from 'next-auth';
import { Message } from '@/model/User';

declare module 'next-auth'{
    interface User{
        name?: string;
        email?: string;
        password?: string;
        verifyCode?: string;
        verifyCodeExpiry?: Date;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        messages?: Message;
        secretCode?: String;
    }
    interface Session{
        user:{
            name?: string;
            email?: string;
            password?: string;
            verifyCode?: string;
            verifyCodeExpiry?: Date;
            isVerified?: boolean;
            isAcceptingMessage?: boolean;
            messages?: Message[];
            secretCode?: String;
        }  & DefaultSession['user']
    }
}

declare module 'next-auth/jwt'{
    interface JWT {
        name?: string;
        email?: string;
        password?: string;
        verifyCode?: string;
        verifyCodeExpiry?: Date;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        messages?: Message[];
        secretCode?: String;
    }
}