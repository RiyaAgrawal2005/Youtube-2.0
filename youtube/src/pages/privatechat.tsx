// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import PrivateChat from "../components/PrivateChat";

// const PrivateChatPage = () => {
//   const router = useRouter();
//   const [partnerEmail, setPartnerEmail] = useState<string | null>(null);

//   useEffect(() => {
//     if (router.isReady) {
//       const email = router.query.chatPartnerEmail;
//       if (typeof email === "string") {
//         setPartnerEmail(email);
//       } else {
//         setPartnerEmail(null);
//       }
//     }
//   }, [router.isReady, router.query.chatPartnerEmail]);

//   if (!partnerEmail) {
//     return (
//       <div className="text-center mt-10 text-red-600 font-medium">
//         Invalid or missing chat partner. Please select a user first.
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1 className="text-2xl font-bold text-center mt-6">Private Chat with {partnerEmail}</h1>
//       <PrivateChat />
//     </div>
//   );
// };

// export default PrivateChatPage;  








import React from "react";
import PrivateChat from "@/components/PrivateChat";

const PrivateChatPage = () => {
  return (
    <div className="flex-1 p-4">
     <PrivateChat />
    </div>
  );
};

export default PrivateChatPage;
