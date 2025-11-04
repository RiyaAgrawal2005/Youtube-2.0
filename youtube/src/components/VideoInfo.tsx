
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import axios from "axios";

import {
  Bookmark,
  Clock,
  Download,
  MoreHorizontal,
  Scissors,
  Share,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/lib/AuthContext";
import { getLoggedInUserEmail } from "@/utils/auth";
import axiosInstance from "@/lib/axiosinstance";
import router, { useRouter } from "next/router";
import { log } from "console";
const VideoInfo = ({ video }: any) => {
  const [likes, setlikes] = useState(video.Like || 0);
  const [dislikes, setDislikes] = useState(video.Dislike || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  // const {user} = useUser();
  const userContext = useUser() as { user: any } | null;
  const user = userContext?.user;

  const [isWatchLater, setIsWatchLater] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);





  const planName = user?.subscriptionPlan || "Free";
  const planPrices: { [key: string]: number } = {
    Bronze: 10,   // ₹10
    Silver: 50,   // ₹50
    Gold: 100,    // ₹100
  };


  const openPopup = (msg: string) => {
    setPopupMessage(msg);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupMessage("");
  };


  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 900);
    handleResize(); // check on load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setlikes(video.Like || 0);
    setDislikes(video.Dislike || 0);
    setIsLiked(false);
    setIsDisliked(false);
  }, [video]);

  useEffect(() => {
    const handleviews = async () => {
      if (user) {
        try {
          return await axiosInstance.post(`/history/${video._id}`, {
            userId: user?._id,
          });
        } catch (error) {
          return console.log(error);
        }
      } else {
        return await axiosInstance.post(`/history/views/${video?._id}`);
      }
    };
    handleviews();
  }, [user]);




  const handleSubscribe = async () => {
    const email = getLoggedInUserEmail();
    const channelId = video?.snippet?.channelId || video?.channelId; // get from video data

    console.log("Debug → channelId:", channelId);
    console.log("Debug → email:", email);

    if (!email) {
      alert("Please log in to subscribe.");
      return;
    }

    try {
      const res = await axiosInstance.post("/subscribe", { channelId, email });
      console.log("Debug → API Response:", res.data);

      if (res.status === 200) {
        alert("Subscribed successfully!");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      alert("Failed to subscribe.");
    }
  };



  const handleLike = async () => {

    const email = getLoggedInUserEmail();
    if (!email) {
      alert("Please log in to like the video.");
      return;
    }
    try {
      const res = await axiosInstance.post(`/like/${video._id}`, {
        userId: user?._id,
      });
      if (res.data.liked) {
        if (isLiked) {
          setlikes((prev: any) => prev - 1);
          setIsLiked(false);
        } else {
          setlikes((prev: any) => prev + 1);
          setIsLiked(true);
          if (isDisliked) {
            setDislikes((prev: any) => prev - 1);
            setIsDisliked(false);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleWatchLater = async () => {
    const email = getLoggedInUserEmail();
    if (!email) {
      alert("Please log in to like the video.");
      return;
    }
    try {
      const res = await axiosInstance.post(`/watch/${video._id}`, {
        userId: user?._id,
      });
      if (res.data.watchlater) {
        setIsWatchLater(!isWatchLater);
      } else {
        setIsWatchLater(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDislike = async () => {
    // if (!user) return;
    const email = getLoggedInUserEmail();
    if (!email) {
      alert("Please log in to Dislike the video.");
      return;
    }
    try {
      const res = await axiosInstance.post(`/like/${video._id}`, {
        userId: user?._id,
      });
      if (!res.data.liked) {
        if (isDisliked) {
          setDislikes((prev: any) => prev - 1);
          setIsDisliked(false);
        } else {
          setDislikes((prev: any) => prev + 1);
          setIsDisliked(true);
          if (isLiked) {
            setlikes((prev: any) => prev - 1);
            setIsLiked(false);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };










  const handleDownload = async () => {
    console.log("Video object received for download:", video);

    const email = getLoggedInUserEmail();
    if (!email) {
      alert("Please log in to download videos.");
      return;
    }

    const loadRazorpayScript = () =>
      new Promise((resolve) => {
        if (document.getElementById("razorpay-script")) return resolve(true);
        const script = document.createElement("script");
        script.id = "razorpay-script";
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });


    try {
      const res = await axios.get("http://localhost:5000/api/download/can-download", {
        params: { email },
      });

      if (res.data.canDownload) {
        if (!video || !video.filepath) {
          console.log("video object:", video);
          alert("Video file is not available for download.");
          return;
        }


        const rawPath = video.filepath.replace(/\\/g, "/");
        const filename = rawPath.split("/").pop();

        const fileUrl = `http://localhost:5000/api/download/file/${filename}`;

        await axios.post("http://localhost:5000/api/download/save", {
          email,
          videoId: video._id,
          videoTitle: video.videotitle,
          fileUrl,

        });

        const a = document.createElement("a");
        a.href = fileUrl;
        a.download = `${video.videotitle || "video"}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        alert("Download started!");

      } else {


        openPopup(
          `Your ${res.data.plan} plan limit (${res.data.limit} downloads/day) is over.`
        );

        const resScript = await loadRazorpayScript();
        if (!resScript) {
          alert("Payment system not loaded. Please try again.");
          return;
        }


        const orderRes = await axios.post("http://localhost:5000/create-order", {
          amount: planPrices[planName],
          currency: "INR",
          purpose: "premium-download",
          email,
          plan: planName
        });

        const options = {
          key: orderRes.data.key,
          amount: orderRes.data.amount,
          currency: orderRes.data.currency,
          order_id: orderRes.data.orderId,
          name: "YouTube 2.0 Premium",
          description: "Premium Download Access",
          handler: async function (response: any) {


            console.log("Payment success response:", response);

            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              email,
              plan: planName, // Bronze/Silver/Gold
              purpose: "subscription",
            };

            try {
              const verifyRes = await axios.post(
                "http://localhost:5000/api/payment/verify-payment",
                verifyPayload,
                { headers: { "Content-Type": "application/json" } }
              );


              if (verifyRes.data.success) {
                alert("✅ Premium unlocked! Now you can download unlimited videos.");
              } else {
                alert("❌ Payment verification failed. Please contact support.");
              }

            } catch (err) {
              console.error("Verification failed:", err);
              alert("Something went wrong during payment verification.");
            }
          },
          theme: { color: "#3399cc" },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }


    } catch (err) {
      console.error("Download error:", err);
      openPopup("Something went wrong while downloading.");
    }
  }




  return (
    <div className="space-y-4">
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center w-[400px]">
            <h2 className="text-xl font-bold mb-3 text-black dark:text-white">
              Download Limit Reached
            </h2>
            <p className="mb-5 text-gray-600 dark:text-gray-300">
              You can only download <b>1 video per day</b> in the free plan.
              Upgrade to <span className="font-semibold">Premium</span> for unlimited downloads.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowPopup(false);
                  window.open("/subscription", "_blank");
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Go Premium
              </button>
            </div>
          </div>
        </div>
      )}







      <h1 className="text-xl font-semibold text-black dark:text-white">{video.videotitle}</h1>
      {/* <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-0">
        <div className="flex flex-wrap items-center justify-between w-full gap-3 bg-transparent py-2 border-b border-gray-300 dark:border-gray-700">

          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback>{video.videochanel[0]}</AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-medium text-black dark:text-white">
                {video.videochanel}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                1.2M subscribers
              </p>
            </div>

            <button
              onClick={handleSubscribe}
              className="ml-4 px-4 py-2 bg-black text-white dark:bg-[#272727] rounded-full text-sm font-medium"
            >
              Subscribe
            </button>
          </div>


          <div className="flex items-center gap-2 flex-wrap justify-end">

            <div className="flex items-center bg-[#e5e5e5] dark:bg-[#272727] rounded-full">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-l-full"
                onClick={handleLike}
              >
                <ThumbsUp
                  className={`w-5 h-5 mr-2 ${isLiked ? "fill-black text-black dark:fill-white" : ""
                    }`}
                />
                {likes.toLocaleString()}
              </Button>
              <div className="w-px h-6 bg-gray-400 dark:bg-gray-700" />
              <Button
                variant="ghost"
                size="sm"
                className="rounded-r-full"
                onClick={handleDislike}
              >
                <ThumbsDown
                  className={`w-5 h-5 mr-2 ${isDisliked ? "fill-black text-black dark:fill-white" : ""
                    }`}
                />
                {dislikes.toLocaleString()}
              </Button>
            </div>



            {!isSmallScreen && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-[#e5e5e5] dark:bg-[#272727] rounded-full"
                  onClick={handleWatchLater}
                >
                  <Clock className="w-5 h-5 mr-2" />
                  {isWatchLater ? "Saved" : "Watch Later"}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-[#e5e5e5] dark:bg-[#272727] rounded-full"
                  onClick={() =>
                    navigator.share && navigator.share({ url: window.location.href })
                  }
                >
                  <Share className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="bg-[#e5e5e5] dark:bg-[#272727] rounded-full"
              onClick={handleDownload}
            >
              <Download className="w-5 h-5 mr-2" />
              Download
            </Button>




            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="bg-[#e5e5e5] dark:bg-[#272727] rounded-full"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#272727] rounded-lg shadow-lg border dark:border-gray-700 z-20">

                  {isSmallScreen && (
                    <div>
                      <button
                        onClick={handleWatchLater}
                        className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Clock className="w-4 h-4 mr-2" /> {isWatchLater ? "Saved" : "Watch Later"}
                      </button>
                      <button
                        onClick={() =>
                          navigator.share && navigator.share({ url: window.location.href })
                        }
                        className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Share className="w-4 h-4 mr-2" /> Share
                      </button>
                    </div>
                  )}



                  <button
                    onClick={() => alert("Save option clicked")}
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Bookmark className="w-4 h-4 mr-2" /> Save
                  </button>
                  <button
                    onClick={() => alert("Clip option clicked")}
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Scissors className="w-4 h-4 mr-2" /> Clip
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div> */}





<div className="w-full flex justify-center">
  <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-0">
    <div className="flex flex-nowrap items-center justify-between gap-2 bg-transparent py-2 border-b border-gray-300 dark:border-gray-700 overflow-x-auto no-scrollbar">
      
      {/* LEFT SECTION */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
          <AvatarFallback>{video.videochanel[0]}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col leading-tight">
          <h3 className="text-sm sm:text-base font-medium text-black dark:text-white">
            {video.videochanel}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            1.2M subscribers
          </p>
        </div>

        <button
          onClick={handleSubscribe}
          className="px-3 sm:px-4 py-1 sm:py-1.5 bg-black text-white dark:bg-[#272727] rounded-full text-xs sm:text-sm font-medium flex-shrink-0"
        >
          Subscribe
        </button>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-1 sm:gap-2 flex-nowrap overflow-x-auto no-scrollbar">

        {/* Like / Dislike */}
        <div className="flex items-center bg-[#e5e5e5] dark:bg-[#272727] rounded-full flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-l-full px-2 sm:px-3 text-xs sm:text-sm"
            onClick={handleLike}
          >
            <ThumbsUp
              className={`w-4 h-4 mr-1 ${
                isLiked ? "fill-black text-black dark:fill-white" : ""
              }`}
            />
            {likes.toLocaleString()}
          </Button>
          <div className="w-px h-5 bg-gray-400 dark:bg-gray-700" />
          <Button
            variant="ghost"
            size="sm"
            className="rounded-r-full px-2 sm:px-3 text-xs sm:text-sm"
            onClick={handleDislike}
          >
            <ThumbsDown
              className={`w-4 h-4 mr-1 ${
                isDisliked ? "fill-black text-black dark:fill-white" : ""
              }`}
            />
            {dislikes.toLocaleString()}
          </Button>
        </div>

        {/* Watch Later & Share – visible only on large screens */}
        <div className="hidden md:flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="bg-[#e5e5e5] dark:bg-[#272727] rounded-full text-xs sm:text-sm px-2 sm:px-3"
            onClick={handleWatchLater}
          >
            <Clock className="w-4 h-4 mr-1" />
            {isWatchLater ? "Saved" : "Watch Later"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="bg-[#e5e5e5] dark:bg-[#272727] rounded-full text-xs sm:text-sm px-2 sm:px-3"
            onClick={() =>
              navigator.share && navigator.share({ url: window.location.href })
            }
          >
            <Share className="w-4 h-4 mr-1" />
            Share
          </Button>
        </div>

        {/* ✅ Download — always visible */}
        <Button
          variant="ghost"
          size="sm"
          className="bg-[#e5e5e5] dark:bg-[#272727] rounded-full text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4 mr-1" />
          Download
        </Button>

        {/* ⋯ Menu (always visible) */}
        <div className="relative flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="bg-[#e5e5e5] dark:bg-[#272727] rounded-full"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>

          {showMenu && (
            <div className="absolute right-0 mt-2  w-44 bg-white dark:bg-[#272727] rounded-lg shadow-lg border dark:border-gray-700 z-20">
              {/* Watch Later & Share (inside menu for small screens) */}
              <div className="md:hidden">
                <button
                  onClick={handleWatchLater}
                  className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Clock className="w-4 h-4 mr-2" />{" "}
                  {isWatchLater ? "Saved" : "Watch Later"}
                </button>
                <button
                  onClick={() =>
                    navigator.share &&
                    navigator.share({ url: window.location.href })
                  }
                  className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Share className="w-4 h-4 mr-2" /> Share
                </button>
              </div>

              {/* Save & Clip always inside menu */}
              <button
                onClick={() => alert("Save option clicked")}
                className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Bookmark className="w-4 h-4 mr-2" /> Save
              </button>
              <button
                onClick={() => alert("Clip option clicked")}
                className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Scissors className="w-4 h-4 mr-2" /> Clip
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</div>















      <div className="bg-[#e5e5e5] dark:bg-[#272727] rounded-lg p-4">

        <div className="flex gap-4 text-sm font-medium mb-2 text-black dark:text-white">

          <span>{video.views.toLocaleString()} views</span>
          <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
        </div>
        <div className={`text-sm ${showFullDescription ? "" : "line-clamp-3"} text-black dark:text-white`}>
          <p>
            Sample video description. This would contain the actual video description from the database.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 p-0 h-auto font-medium text-black dark:text-white"
          onClick={() => setShowFullDescription(!showFullDescription)}
        >
          {showFullDescription ? "Show less" : "Show more"}
        </Button>
      </div>
    </div>
  );


}




export default VideoInfo;