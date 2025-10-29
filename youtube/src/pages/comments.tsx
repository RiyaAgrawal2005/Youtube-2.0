// import Comments from '@/components/Comments';

// const CommentsPage = () => {
//   return (
//     <div className="min-h-screen bg-black text-white p-4">
//       <h1 className="text-2xl font-bold mb-4">Comment Section</h1>
//       <Comments />
//     </div>
//   );
// };

// export default CommentsPage;






"use client";
import Comments from '@/components/Comments';
import { useSearchParams } from 'next/navigation';

const CommentsPage = () => {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("videoId");

  return (
    <div className="min-h-screen bg-white text-black p-4 border-4">
      <h1 className="text-2xl font-bold mb-4">Comment Section</h1>
      {videoId ? <Comments videoId={videoId} /> : <p>No video selected.</p>}
    </div>
  );
};

export default CommentsPage;
