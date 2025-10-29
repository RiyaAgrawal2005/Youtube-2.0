import React, { useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";

const ChannelHeader = ({ channel, user }: any) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  return (
    <div className="w-full">
      {/* Banner */}
      {/* <div className="relative h-32 md:h-48 lg:h-64 bg-gradient-to-r from-blue-400 to-purple-500 overflow-hidden"></div> */}
      <div className="relative h-32 md:h-48 lg:h-64 bg-gradient-to-r from-blue-400 to-purple-500 dark:from-blue-800 dark:to-purple-900 overflow-hidden"></div>


     {/* Channel Info */}
      

<div className="px-4 py-6 bg-white dark:bg-gray-800  shadow-sm transition-colors duration-300">
  <div className="flex flex-col md:flex-row gap-6 items-start">
    
    {/* Avatar */}
    <Avatar className="w-20 h-20 md:w-32 md:h-32 border-2 border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <AvatarFallback className="text-2xl text-gray-800 dark:text-gray-200">
        {channel?.channelname[0]}
      </AvatarFallback>
    </Avatar>

    
          <div className="flex-1 space-y-2">
            {/* <h1 className="text-2xl md:text-4xl font-bold"> */}
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">

              {channel?.channelname}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>@{channel?.channelname.toLowerCase().replace(/\s+/g, "")}</span>
            </div>
            {channel?.description && (
              // <p className="text-sm text-gray-700 max-w-2xl">
                <p className="text-sm text-gray-700 dark:text-gray-300 max-w-2xl">

                {channel?.description}
              </p>
            )}
          </div>

          {user && user?._id !== channel?._id && (
            <div className="flex gap-2">
              <Button
                onClick={() => setIsSubscribed(!isSubscribed)}
                variant={isSubscribed ? "outline" : "default"}
              //   className={
              //     isSubscribed ? "bg-gray-100" : "bg-red-600 hover:bg-red-700"
              //   }
              // >
              className={
    isSubscribed
      ? "bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
      : "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
  }
>
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelHeader;