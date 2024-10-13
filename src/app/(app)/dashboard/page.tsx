import React from "react";
import CodeAccept2 from "./CodeAccept2";
import SendMessage from "./SendMessage";


function Page() {
  return (
    <>
      <div className="flex flex-col md:flex-row">
        <CodeAccept2 />
        <div>
          <SendMessage />
        </div>
      </div>
    </>
  );
}

export default Page;
