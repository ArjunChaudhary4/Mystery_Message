import * as React from 'react';

interface EmailTemplateProps {
  username: string;
  verifyCode: number
}

export default function EmailTemplate({
  username,
  verifyCode
}: EmailTemplateProps){
return(
  <div>
    <h1>Welcome, {username}</h1>
    <p>Your verification Code is {verifyCode} </p>
  </div>
)};
