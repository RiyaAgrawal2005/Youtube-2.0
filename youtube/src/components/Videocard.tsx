"use clinet";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useState } from "react";

const videos = "/video/vdo.mp4";


export default function VideoCard({ video }: any) {
   const [duration, setDuration] = useState<number>(0);

    const formatDuration = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  return (
    <Link href={`/watch/${video?._id}`} className="group">
      <div className="space-y-3">
       
          <div className="relative aspect-video border-2 rounded-lg overflow-hidden bg-card transition-colors duration-300">

         


<video
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${video?.filepath}`}
            className="w-full object-cover group-hover:scale-105 transition-transform duration-200"
            preload="metadata"
            crossOrigin="anonymous" // ✅ needed if backend allows it
            muted // avoids autoplay issues
            onLoadedMetadata={(e) => {
              const el = e.currentTarget as HTMLVideoElement;
             
              setDuration(el.duration);
            }}
          />

         
          <div className="absolute bottom-2 right-2 bg-muted/80 text-muted-foreground text-xs px-1 rounded">
  {formatDuration(duration)}
        
          </div>
        </div>
        <div className="flex gap-3">
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarFallback>{video?.videochanel[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
           
              <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors duration-300">

              {video?.videotitle}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{video?.videochanel}</p>
<p className="text-sm text-muted-foreground">
  {video?.views.toLocaleString()} views • {formatDistanceToNow(new Date(video?.createdAt))} ago
</p>

          </div>
        </div>
      </div>
    </Link>
  );
}





























