// import CategoryTabs from "@/components/category-tabs";
// import Videogrid from "@/components/Videogrid";
// import React, { Suspense } from "react";

// export default function Home() {
//   return(
//     <main className="flex-1 p-4">
//       <CategoryTabs/>
//       <Suspense fallback= {
//         <div>Loading Videos...</div>
//         }>
//       <Videogrid/>
//       </Suspense>
//     </main>
//   );
// }
"use client";

import React, { Suspense } from "react";
import CategoryTabs from "@/components/category-tabs";
import Videogrid from "@/components/Videogrid";
import ChatboxButton from "@/components/ChatboxButton"; // ✅ Make sure path is correct

const Home = () => {
  // return (
  //   <main className="flex-1 p-4 flex flex-col min-h-screen justify-between">
  //     <div>
  //       <CategoryTabs />
  //       <Suspense fallback={<div>Loading Videos...</div>}>
  //         <Videogrid />
  //       </Suspense>
  //     </div>

  //     {/* ✅ Bottom Chatbox Button */}
  //     <ChatboxButton />
  //   </main>
  // );

return (
  // bg-[#efe6e6]
  <main className="flex-1 p-4 flex flex-col min-h-screen justify-between bg-white dark:bg-[#181818] transition-colors duration-300">
    <div>
      <CategoryTabs />
      <Suspense fallback={<div>Loading Videos...</div>}>
        <Videogrid />
      </Suspense>
    </div>

    {/* ✅ Bottom Chatbox Button */}
    <ChatboxButton />
  </main>
);


};

export default Home;
