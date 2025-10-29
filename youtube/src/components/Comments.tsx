// import React, { useEffect, useState } from 'react'
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
// import { Textarea } from './ui/textarea';
// import { Button } from './ui/button';
// import { formatDistanceToNow } from 'date-fns';
// import { useUser } from '@/lib/AuthContext';
// import axiosInstance from '@/lib/axiosinstance';

// interface Comment {
//     _id: string;
//     videoid: string;
//     userid: string;
//     commentbody: string;
//     usercommented: string;
//     commentedon: string;
// }
// const Comments = ({ videoId }: any) => {
//     const [comments, setComments] = useState<Comment[]>([]);
//     const [newComment, setNewComment] = useState("");
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
//     const [editText, setEditText] = useState("");
//      const { user } = useUser();
//       const [loading, setLoading] = useState(true);

//     const fetchedComments = [
//         {
//             _id: "1",
//             videoid: videoId,
//             userid: "1",
//             commentbody: "Great video! Really enjoyed watching this.",
//             usercommented: "John Doe",
//             commentedon: new Date(Date.now() - 3600000).toISOString(),
//         },
//         {
//             _id: "2",
//             videoid: videoId,
//             userid: "2",
//             commentbody: "Thanks for sharing this amazing content!",
//             usercommented: "Jane Smith",
//             commentedon: new Date(Date.now() - 7200000).toISOString(),
//         },
//     ];
//     useEffect(() => {
//         loadComments();
//     }, [videoId]);

//     const loadComments = async () => {
//          try {
//       const res = await axiosInstance.get(`/comment/${videoId}`);
//     //   setComments(fetchedComments);
//       setComments(res.data);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//     }
//  if (loading) {
//     return <div>Loading history...</div>;
//   }

//     const handleSubmitComment = async () => {
//         if (!user || !newComment.trim()) return;

//         setIsSubmitting(true);
//         try {
//             const res = await axiosInstance.post("/comment/postcomment", {
//         videoid: videoId,
//         userid: user._id,
//         commentbody: newComment,
//         usercommented: user.name,
//       });

//        if (res.data.comment) {
//         const newCommentObj: Comment = {
//           _id: Date.now().toString(),
//           videoid: videoId,
//           userid: user._id,
//           commentbody: newComment,
//           usercommented: user.name || "Anonymous",
//           commentedon: new Date().toISOString(),
//         };

//             setComments([newCommentObj, ...comments]);
//     }
//             setNewComment("");
//         } catch (error) {
//             console.error("Error adding comment:", error);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleEdit = (comment: Comment) => {
//         setEditingCommentId(comment._id);
//         setEditText(comment.commentbody);
//     };




//     const handleUpdateComment = async () => {
//     if (!editText.trim()) return;
//     try {
//       const res = await axiosInstance.post(
//         `/comment/editcomment/${editingCommentId}`,
//         { commentbody: editText }
//       );
//       if (res.data) {
//         setComments((prev) =>
//           prev.map((c) =>
//             c._id === editingCommentId ? { ...c, commentbody: editText } : c
//           )
//         );
//         setEditingCommentId(null);
//         setEditText("");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };



//     const handleDelete = async (id: string) => {
//     try {
//       const res = await axiosInstance.delete(`/comment/deletecomment/${id}`);
//       if (res.data.comment) {
//         setComments((prev) => prev.filter((c) => c._id !== id));
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
//     return (
//     <div className="space-y-6">
//       <h2 className="text-xl font-semibold">{comments.length} Comments</h2>

//       {user && (
//         <div className="flex gap-4">
//           <Avatar className="w-10 h-10">
//             <AvatarImage src={user.image || ""} />
//             <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
//           </Avatar>
//           <div className="flex-1 space-y-2">
//             <Textarea
//               placeholder="Add a comment..."
//               value={newComment}
//               onChange={(e: any) => setNewComment(e.target.value)}
//               className="min-h-[80px] resize-none border-0 border-b-2 rounded-none focus-visible:ring-0"
//             />
//             <div className="flex gap-2 justify-end">
//               <Button
//                 variant="ghost"
//                 onClick={() => setNewComment("")}
//                 disabled={!newComment.trim()}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleSubmitComment}
//                 disabled={!newComment.trim() || isSubmitting}
//               >
//                 Comment
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//       <div className="space-y-4">
//         {comments.length === 0 ? (
//           <p className="text-sm text-gray-500 italic">
//             No comments yet. Be the first to comment!
//           </p>
//         ) : (
//           comments.map((comment) => (
//             <div key={comment._id} className="flex gap-4">
//               <Avatar className="w-10 h-10">
//                 <AvatarImage src="/placeholder.svg?height=40&width=40" />
//                 <AvatarFallback>{comment.usercommented[0]}</AvatarFallback>
//               </Avatar>
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-1">
//                   <span className="font-medium text-sm">
//                     {comment.usercommented}
//                   </span>
//                   <span className="text-xs text-gray-600">
//                     {formatDistanceToNow(new Date(comment.commentedon))} ago
//                   </span>
//                 </div>

//                 {editingCommentId === comment._id ? (
//                   <div className="space-y-2">
//                     <Textarea
//                       value={editText}
//                       onChange={(e) => setEditText(e.target.value)}
//                     />
//                     <div className="flex gap-2 justify-end">
//                       <Button
//                         onClick={handleUpdateComment}
//                         disabled={!editText.trim()}
//                       >
//                         Save
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         onClick={() => {
//                           setEditingCommentId(null);
//                           setEditText("");
//                         }}
//                       >
//                         Cancel
//                       </Button>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <p className="text-sm">{comment.commentbody}</p>
//                     {comment.userid === user?._id && (
//                       <div className="flex gap-2 mt-2 text-sm text-gray-500">
//                         <button onClick={() => handleEdit(comment)}>
//                           Edit
//                         </button>
//                         <button onClick={() => handleDelete(comment._id)}>
//                           Delete
//                         </button>
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Comments;
















// import React, { useEffect, useState } from 'react';
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
// import { Textarea } from './ui/textarea';
// import { Button } from './ui/button';
// import { formatDistanceToNow } from 'date-fns';
// import { useUser } from '@/lib/AuthContext';
// import axiosInstance from '@/lib/axiosinstance';
// import axios from 'axios';

// interface Comment {
//   _id: string;
//   videoid: string;
//   userid: string;
//   commentbody: string;
//   usercommented: string;
//   commentedon: string;
//   likes?: number;
//   dislikes?: number;
//   city?: string;
// }

// const Comments = ({ videoId }: any) => {
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [newComment, setNewComment] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
//   const [editText, setEditText] = useState('');
//   const { user } = useUser();
//   const [loading, setLoading] = useState(true);
//   const [city, setCity] = useState('');
//   const [targetLanguage, setTargetLanguage] = useState('en');
//   const [targetLanguageForInput, setTargetLanguageForInput] = useState('en');
//   const [commentLangMap, setCommentLangMap] = useState<{ [key: string]: string }>({});

//   useEffect(() => {
//     loadComments();
//     getUserCity();
//   }, [videoId]);

//   const loadComments = async () => {
//     try {
//       const res = await axiosInstance.get(`/comment/${videoId}`);
//       setComments(res.data);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getUserCity = async () => {
//     try {
//       const res = await axios.get('https://ipapi.co/json/');
//       setCity(res.data.city);
//     } catch (err) {
//       console.error('Failed to fetch city', err);
//     }
//   };

//   const containsSpecialChars = (str: string) => /[^a-zA-Z0-9\s.,!?'"()@-]/.test(str);

//   const handleSubmitComment = async () => {
//     if (!user || !newComment.trim()) return;

//     if (containsSpecialChars(newComment)) {
//       alert("Don't comment in special characters");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const res = await axiosInstance.post('/comment/postcomment', {
//         videoid: videoId,
//         userid: user._id,
//         commentbody: newComment,
//         usercommented: user.name,
//         city,
//         likes: 0,
//         dislikes: 0,
//       });

//       if (res.data.comment) {
//         const newCommentObj: Comment = {
//           _id: Date.now().toString(),
//           videoid: videoId,
//           userid: user._id,
//           commentbody: newComment,
//           usercommented: user.name || 'Anonymous',
//           commentedon: new Date().toISOString(),
//           likes: 0,
//           dislikes: 0,
//           city,
//         };
//         setComments([newCommentObj, ...comments]);
//       }
//       setNewComment('');
//     } catch (error) {
//       console.error('Error adding comment:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleLike = (id: string) => {
//     setComments((prev) =>
//       prev.map((c) => (c._id === id ? { ...c, likes: (c.likes || 0) + 1 } : c))
//     );
//   };

//   const handleDislike = (id: string) => {
//     const updatedComments = comments.map((c) => {
//       if (c._id === id) {
//         const newDislikes = (c.dislikes || 0) + 1;
//         return { ...c, dislikes: newDislikes };
//       }
//       return c;
//     });

//     setComments(updatedComments);

//     const dislikedComment = updatedComments.find((c) => c._id === id);
//     if (dislikedComment?.dislikes! >= 2) {
//       handleDelete(id);
//     }
//   };

//   const handleTranslate = async (text: string, targetLang: string = 'en') => {
//   try {
//     const params = new URLSearchParams();
//     params.append('q', text);
//     params.append('source', 'auto');
//     params.append('target', targetLang);
//     params.append('format', 'text');

//     const res = await axios.post(
//       'https://libretranslate.de/translate', // more stable mirror
//       params,
//       {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       }
//     );
//       // return res.data.translatedText;
//        return res.data?.translatedText || text;
//     } catch (error) {
//       console.error('Translation error:', error);
//       return text;
//     }
//   };

//   const handleEdit = (comment: Comment) => {
//     setEditingCommentId(comment._id);
//     setEditText(comment.commentbody);
//   };

//   const handleUpdateComment = async () => {
//     if (!editText.trim() || containsSpecialChars(editText)) {
//       alert("Don't comment in special characters");
//       return;
//     }

//     try {
//       const res = await axiosInstance.post(
//         `/comment/editcomment/${editingCommentId}`,
//         {
//           commentbody: editText,
//         }
//       );

//       if (res.data) {
//         setComments((prev) =>
//           prev.map((c) =>
//             c._id === editingCommentId ? { ...c, commentbody: editText } : c
//           )
//         );
//         setEditingCommentId(null);
//         setEditText('');
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       const res = await axiosInstance.delete(`/comment/deletecomment/${id}`);
//       if (res.data.comment) {
//         setComments((prev) => prev.filter((c) => c._id !== id));
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const LANG_OPTIONS = [
//     { code: 'en', label: 'English' },
//     { code: 'hi', label: 'Hindi' },
//     { code: 'es', label: 'Spanish' },
//     { code: 'fr', label: 'French' },
//     { code: 'de', label: 'German' },
//     { code: 'zh', label: 'Chinese' },
//     { code: 'ja', label: 'Japanese' },
//     { code: 'ar', label: 'Arabic' },
//   ];

//   if (loading) return <div>Loading comments...</div>;

//   return (
//     <div className="space-y-6">
//       <h2 className="text-xl font-semibold">{comments.length} Comments</h2>

//       <div className="flex gap-4 items-center flex-wrap">
//         <label className="text-sm font-medium">Translate To:</label>
//         <select
//           value={targetLanguageForInput}
//           onChange={(e) => setTargetLanguageForInput(e.target.value)}
//           className="border px-2 py-1 rounded"
//         >
//           {LANG_OPTIONS.map((lang) => (
//             <option key={lang.code} value={lang.code}>{lang.label}</option>
//           ))}
//         </select>

//         <Button
//           size="sm"
//           className="ml-2"
//           onClick={async () => {
//             const translated = await handleTranslate(newComment, targetLanguageForInput);
//             setNewComment(translated);
//           }}
//         >
//           🌐 Translate
//         </Button>
//       </div>

//       {user && (
//         <div className="flex gap-4">
//           <Avatar className="w-10 h-10">
//             <AvatarImage src={user.image || ''} />
//             <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
//           </Avatar>
//           <div className="flex-1 space-y-2">
//             <Textarea
//               placeholder="Add a comment..."
//               value={newComment}
//               onChange={(e: any) => setNewComment(e.target.value)}
//               className="min-h-[80px] resize-none border-0 border-b-2 rounded-none focus-visible:ring-0"
//             />
//             <div className="flex gap-2 justify-end">
//               <Button variant="ghost" onClick={() => setNewComment('')} disabled={!newComment.trim()}>
//                 Cancel
//               </Button>
//               <Button onClick={handleSubmitComment} disabled={!newComment.trim() || isSubmitting}>
//                 Comment
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="space-y-4">
//         {comments.length === 0 ? (
//           <p className="text-sm text-gray-500 italic">No comments yet. Be the first to comment!</p>
//         ) : (
//           comments.map((comment) => (
//             <div key={comment._id} className="flex gap-4">
//               <Avatar className="w-10 h-10">
//                 <AvatarImage src="/placeholder.svg?height=40&width=40" />
//                 <AvatarFallback>{comment.usercommented[0]}</AvatarFallback>
//               </Avatar>
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-1">
//                   <span className="font-medium text-sm">{comment.usercommented}</span>
//                   <span className="text-xs text-gray-600">
//                     {formatDistanceToNow(new Date(comment.commentedon))} ago
//                   </span>
//                   <span className="text-xs text-blue-600 ml-auto">
//                     {comment.city || 'Unknown City'}
//                   </span>
//                 </div>

//                 {editingCommentId === comment._id ? (
//                   <div className="space-y-2">
//                     <Textarea value={editText} onChange={(e) => setEditText(e.target.value)} />
//                     <div className="flex gap-2 justify-end">
//                       <Button onClick={handleUpdateComment} disabled={!editText.trim()}>
//                         Save
//                       </Button>
//                       <Button variant="ghost" onClick={() => setEditingCommentId(null)}>
//                         Cancel
//                       </Button>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <p className="text-sm">{comment.commentbody}</p>
//                     <div className="flex gap-2 items-center mt-2 text-sm text-gray-500 flex-wrap">
//                       <button onClick={() => handleLike(comment._id)}>👍 {comment.likes || 0}</button>
//                       <button onClick={() => handleDislike(comment._id)}>👎 {comment.dislikes || 0}</button>

//                       <select
//                         value={commentLangMap[comment._id] || 'en'}
//                         onChange={(e) =>
//                           setCommentLangMap({ ...commentLangMap, [comment._id]: e.target.value })
//                         }
//                         className="border px-1 py-0.5 rounded text-sm"
//                       >
//                         {LANG_OPTIONS.map((lang) => (
//                           <option key={lang.code} value={lang.code}>
//                             {lang.label}
//                           </option>
//                         ))}
//                       </select>

//                       {/* <button
//                         className="text-blue-600"
//                         onClick={async () => {
//                           const translated = await handleTranslate(
//                             comment.commentbody,
//                             commentLangMap[comment._id] || 'en'
//                           );
//                           alert(`Translated (${commentLangMap[comment._id] || 'en'}): ${translated}`);
//                         }}
//                       >
//                         🌐 Translate
//                       </button> */}


//                       <button
//   className="text-blue-600"
//   onClick={async () => {
//     const targetLang = commentLangMap[comment._id] || 'en';
//     const translated = await handleTranslate(comment.commentbody, targetLang);

//     if (translated && translated !== comment.commentbody) {
//       const langLabel = LANG_OPTIONS.find((lang) => lang.code === targetLang)?.label || targetLang;
//       alert(`Translate "${comment.commentbody}" to ${langLabel}: ${translated}`);
//     } else {
//       alert("Could not translate the comment. It might already be in the selected language.");
//     }
//   }}
// >
//   🌐 Translate
// </button>


//                       {comment.userid === user?._id && (
//                         <>
//                           <button onClick={() => handleEdit(comment)}>Edit</button>
//                           <button onClick={() => handleDelete(comment._id)}>Delete</button>
//                         </>
//                       )}
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Comments;


















import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '@/lib/AuthContext';
import axiosInstance from '@/lib/axiosinstance';
import axios from 'axios';
import { getLoggedInUserEmail } from "@/utils/auth";
import { auth } from '@/lib/firebase';  // adjust path as needed
import { onAuthStateChanged } from "firebase/auth";


interface Comment {
  _id: string;
  videoid: string;
  userid: string;
  commentbody: string;
  usercommented: string;
  commentedon: string;
  likes?: string[];      // Array of user IDs who liked
  dislikes?: string[];   // Array of user IDs who disliked
  city?: string;
}


const Comments = ({ videoId }: any) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const { user } = useUser();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  // const [targetLanguage, setTargetLanguage] = useState('en');
  const [targetLanguageForInput, setTargetLanguageForInput] = useState('en');
  const [translatedCommentPreview, setTranslatedCommentPreview] = useState('');
  const [commentLangMap, setCommentLangMap] = useState<{ [key: string]: string }>({});
  const [translatedComments, setTranslatedComments] = useState<{ [key: string]: string }>({});
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setCurrentUserId(user.uid);
  //     } else {
  //       setCurrentUserId(null);
  //     }
  //   });
useEffect(() => {
  console.log("Updated comments state:", comments);
}, [comments]);useEffect(() => {
  console.log("Comments component received videoId:", videoId);
}, [videoId]);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const response = await axios.post('http://localhost:5000/user/loginOrCreate', {
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
          });
          const mongoUserId = response.data._id;
          setCurrentUserId(mongoUserId);
        } catch (error) {
          console.error("Failed to login or create user:", error);
          setCurrentUserId(null);
        }
      } else {
        setCurrentUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    if (!videoId) {
      console.warn("Comments component: videoId is undefined");
      setComments([]);
      setLoading(false);
      return;
    }
    loadComments();
    getUserCity();
  }, [videoId, currentUserId]);




  const loadComments = async () => {
    const email = getLoggedInUserEmail();
    if (!email) {
      alert("Please log in to view comments.");
      setLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.get(`/comment/${videoId}`, {
        params: { email },
      });
      console.log("Comments API response:", res.data);
      setComments(res.data);
      

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };






  const getUserCity = async () => {
    const backendUrl = "http://localhost:5000"; // your backend port

    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              const res = await axios.get(`${backendUrl}/api/location/reverse?lat=${latitude}&lon=${longitude}`);
              if (res.data && res.data.city) {
                setCity(res.data.city);
              } else {
                setCity("Unknown");
              }
            } catch (err) {
              console.error("Backend location fetch failed", err);
              setCity("Unknown");
            }
          },
          async (error) => {
            console.warn("Geolocation failed, falling back to IP", error);
            try {
              const ipRes = await axios.get("https://ipapi.co/json/");
              setCity(ipRes.data.city || "Unknown");
            } catch (err) {
              console.error("IP location fetch failed", err);
              setCity("Unknown");
            }
          }
        );
      } else {
        console.warn("Geolocation not available, falling back to IP");
        const ipRes = await axios.get("https://ipapi.co/json/");
        setCity(ipRes.data.city || "Unknown");
      }
    } catch (err) {
      console.error("Error getting city", err);
      setCity("Unknown");
    }
  };






  const containsSpecialChars = (str: string) =>
    !/^[\u0900-\u097Fa-zA-Z0-9\s.,!?]+$/.test(str);


  const handleSubmitComment = async (commentText?: string) => {
    const finalComment = (commentText || newComment).trim();

    if (!user || !finalComment) return;

    if (containsSpecialChars(finalComment)) {
      alert("Don't comment in special characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post('http://localhost:5000/comment/postcomment', {
        videoid: videoId,
        userid: user._id,
        commentbody: finalComment,
        usercommented: user.name,
        city,
        // likes: 0,
        // dislikes: 0,
      });

      if (res.data.comment) {
        const newCommentObj: Comment = {
          _id: Date.now().toString(),
          videoid: videoId,
          userid: user._id,
          commentbody: finalComment,
          usercommented: user.name || 'Anonymous',
          commentedon: new Date().toISOString(),
          likes: [],
          dislikes: [],
          city,
        };
        setComments([newCommentObj, ...comments]);
      }
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };






  const handleLike = async (commentId: string) => {

    if (!currentUserId) {
      alert("Please login to like comments.");
      return;
    }

    try {
      console.log("Like currentUserId being sent:", currentUserId);
      await axios.post(`http://localhost:5000/comment/like/${commentId}`, {
        userId: currentUserId
      });


      setComments(prevComments => prevComments.map(comment => {
        if (comment._id === commentId) {


          const likes = comment.likes || [];
          const dislikes = comment.dislikes || [];

          const hasLiked = likes.includes(currentUserId);
          const hasDisliked = dislikes.includes(currentUserId);

          let newLikes = comment.likes;
          let newDislikes = comment.dislikes;

          if (hasLiked) {
            // Remove like
            newLikes = likes.filter(id => id !== currentUserId);
          } else {
            // Add like and remove dislike if present
            newLikes = [...likes, currentUserId];
            if (hasDisliked) {
              newDislikes = dislikes.filter(id => id !== currentUserId);
            }
          }

          return { ...comment, likes: newLikes, dislikes: newDislikes };
        }
        return comment;
      }));
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };



  const handleDislike = async (commentId: string) => {
    if (!currentUserId) {
      alert("Please login to like comments.");
      return;
    }

    try {
      console.log("Dislike currentUserId being sent:", currentUserId);
      await axios.post(`http://localhost:5000/comment/dislike/${commentId}`, {
        userId: currentUserId
      });

      setComments(prevComments => prevComments.map(comment => {
        if (comment._id === commentId) {
          const likes = comment.likes || [];
          const dislikes = comment.dislikes || [];

          const hasLiked = likes.includes(currentUserId);
          const hasDisliked = dislikes.includes(currentUserId);

          let newLikes = likes;
          let newDislikes = dislikes;

          if (hasDisliked) {
            // Remove dislike
            newDislikes = dislikes.filter(id => id !== currentUserId);
          } else {
            // Add dislike and remove like if present
            newDislikes = [...dislikes, currentUserId];
            if (hasLiked) {
              newLikes = likes.filter(id => id !== currentUserId);
            }
          }

          // Bonus: If dislikes reach 2, you can delete comment or show prompt here

          return { ...comment, likes: newLikes, dislikes: newDislikes };
        }
        return comment;
      }));
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  };






  const handleTranslate = async (text: string, targetLang = 'en'): Promise<string> => {
    if (!text.trim()) return '';

    try {
      const res = await axios.post('/api/translate', { text, targetLang });
      return res.data.translatedText;
    } catch (error) {
      console.error('Translation request failed:', error);
      return '❌ Failed to translate. Please try again later.';
    }
  };









  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.commentbody);
  };






  const handleUpdateComment = async () => {
    if (!editText.trim() || containsSpecialChars(editText)) {
      alert("Don't comment in special characters");
      return;
    }

    try {
      const res = await axiosInstance.post(
        `/comment/editcomment/${editingCommentId}`,
        { commentbody: editText }
      );

      if (res.data) {
        setComments((prev) =>
          prev.map((c) => (c._id === editingCommentId ? { ...c, commentbody: editText } : c))
        );
        setEditingCommentId(null);
        setEditText('');
      }
    } catch (error) {
      console.log(error);
    }
  };




  const handleDelete = async (id: string) => {
    // if (!commentToDelete) return;

    try {
      const res = await axiosInstance.delete(`/comment/deletecomment/${id}`);
      if (res.data.comment) {
        setComments((prev) => prev.filter((c) => c._id !== id));
        setCommentToDelete(null);
        setShowConfirm(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDeleteComment = (id: string) => {
    setCommentToDelete(id);
    setShowConfirm(true);
  };





  const LANG_OPTIONS = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'de', label: 'German' },
    { code: 'zh', label: 'Chinese' },
    { code: 'ja', label: 'Japanese' },
    { code: 'ar', label: 'Arabic' },
  ];

  if (loading) return <div>Loading comments...</div>;
   if (!videoId) return <div>No video selected.</div>;


  return (
    // <div className="space-y-6">
     <div className="space-y-6 bg-background text-foreground transition-colors duration-300">


      {/* <h2 className="text-xl font-semibold">{comments.length} Comments</h2> */}
 <h2 className="text-xl font-semibold">
        {comments.length} Comment{comments.length !== 1 ? 's' : ''}
      </h2>
      <div className="flex gap-4 items-center flex-wrap">
        {/* <label className="text-sm font-medium">Translate To:</label> */}
        <label className="text-sm font-medium">
          Translate  ({newComment})  To:
        </label>

        <select
          value={targetLanguageForInput}
          onChange={(e) => setTargetLanguageForInput(e.target.value)}
          className="border px-2 py-1 rounded bg-black"
        >
          {LANG_OPTIONS.map((lang) => (
            <option key={lang.code} value={lang.code}>{lang.label}</option>
          ))}
        </select>

        <Button
          size="sm"
          // className="ml-2 bg-white hover:bg-blue-400 hover:text-white px-2 py-1 rounded cursor-pointer transition-colors duration-200"
          className="ml-2 bg-gray-500 text-white dark:bg-gray-800 hover:bg-blue-400 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white px-2 py-1 rounded cursor-pointer transition-colors duration-200"

          onClick={async () => {
            const translated = await handleTranslate(newComment, targetLanguageForInput);
            if (translated) setTranslatedCommentPreview(translated);
          }}
        >
          🌐 Translate
        </Button>
      </div>



      {/* Show translated comment with a send button */}
      {translatedCommentPreview && (
        <div className="flex items-center gap-4 mt-2">
          <p className="text-sm font-medium">
            Translated Comment: - {translatedCommentPreview} -
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              // Use the same submit function but with translated text
              handleSubmitComment(translatedCommentPreview);
              setTranslatedCommentPreview(""); // optional: clear after sending
            }}
          >
            Send Translated Comment
          </Button>
        </div>
      )}



      {user && (
        <div className="flex gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.image || ''} />
            {/* <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback> */}
            <AvatarFallback className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white">
  {user.name?.[0] || 'U'}
</AvatarFallback>

          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e: any) => setNewComment(e.target.value)}
              // className="min-h-[80px] resize-none border-0 border-b-2 rounded-none focus-visible:ring-0"
              className="min-h-[80px] resize-none border-0 border-b-2 rounded-none focus-visible:ring-0 bg-input text-input-foreground"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setNewComment('')} disabled={!newComment.trim()}>
                Cancel
              </Button>
              <Button onClick={() => handleSubmitComment()} disabled={!newComment.trim() || isSubmitting}>
                Comment
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>{comment.usercommented[0]}</AvatarFallback>
               

              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{comment.usercommented}</span>
                  <span className="text-xs text-gray-600">
                    {formatDistanceToNow(new Date(comment.commentedon))} ago
                  </span>
                  {/* <span className="text-xs text-white ml-auto"> */}
                    <span className="text-gray-900 dark:text-white text-xs ml-auto">

                    {comment.city || 'Unknown City'}
                  </span>
                </div>

                {editingCommentId === comment._id ? (
                  <div className="space-y-2">
                    <Textarea value={editText} onChange={(e) => setEditText(e.target.value)} />
                    <div className="flex gap-2 justify-end">
                      <Button onClick={handleUpdateComment} disabled={!editText.trim()}>
                        Save
                      </Button>
                      <Button variant="ghost" onClick={() => setEditingCommentId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm">{comment.commentbody}</p>
                    {translatedComments[comment._id] && (
                      <p className="text-sm italic text-blue-600 mt-1">
                        🈯 Translated: {translatedComments[comment._id]}
                      </p>
                    )}

                    <div className="flex gap-2 items-center mt-2 text-sm text-gray-500 flex-wrap">
                      <button onClick={() => handleLike(comment._id)}>👍 {comment.likes?.length || 0}</button>
                      <button onClick={() => handleDislike(comment._id)}>👎 {comment.dislikes?.length || 0}</button>

                      <select
                        value={commentLangMap[comment._id] || 'en'}
                        onChange={(e) =>
                          setCommentLangMap({ ...commentLangMap, [comment._id]: e.target.value })
                        }
                        className="border px-1 py-0.5 rounded text-sm"
                      >
                        {LANG_OPTIONS.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.label}
                          </option>
                        ))}
                      </select>

                      <button
                        // className="text-blue-600"
                        //  className="text-black bg-white hover:bg-green-800 hover:text-white px-2 py-1 rounded cursor-pointer transition-colors duration-200"
                        className="text-white dark:text-white bg-gray-500 dark:bg-gray-800 hover:bg-green-600 dark:hover:bg-green-600 hover:text-white px-2 py-1 rounded cursor-pointer transition-colors duration-200"

                        onClick={async () => {
                          const targetLang = commentLangMap[comment._id] || 'en';
                          const translated = await handleTranslate(comment.commentbody, targetLang);
                          setTranslatedComments(prev => ({ ...prev, [comment._id]: translated }));
                        }}
                      >
                        🌐 Translate
                      </button>

                      {comment.userid === user?._id && (
                        <>
                          <button onClick={() => handleEdit(comment)}>Edit</button>
                          {/* <button onClick={() => handleDelete(comment._id)}>Delete</button> */}
                          <button onClick={() => confirmDeleteComment(comment._id)}>Delete</button>

                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
  }

  .modal {
    // background: white;
    background: var(--background);
  color: var(--foreground);
    padding: 20px;
    border-radius: 8px;
    min-width: 300px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  .modal button {
    margin: 0 8px;
  }
`}</style>


      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this comment?</p>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <Button variant="destructive" onClick={() => handleDelete(commentToDelete!)}>Delete</Button>
              <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default Comments;
