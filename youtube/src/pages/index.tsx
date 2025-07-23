import CategoryTabs from "@/components/category-tabs";
import Videogrid from "@/components/Videogrid";
import React, { Suspense } from "react";

export default function Home() {
  return(
    <main className="flex-1 p-4">
      <CategoryTabs/>
      <Suspense fallback= {
        <div>Loading Videos...</div>
        }>
      <Videogrid/>
      </Suspense>
    </main>
  );
}
