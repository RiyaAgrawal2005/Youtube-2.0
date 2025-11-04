import axios from "axios";
import { useEffect, useState } from "react";

type DownloadType = {
  _id: string;
  videoId: {
    videotitle: string;
  };
  downloadDate: string;
};


export default function Downloads() {
//   const [downloads, setDownloads] = useState([]);
  const [downloads, setDownloads] = useState<DownloadType[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  // const userEmail = localStorage.getItem("userEmail");


useEffect(() => {
    // ✅ Run only on the client
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("userEmail");
      setUserEmail(email);
    }
  }, []);

  useEffect(() => {
    // ✅ Fetch only when email is available
    const fetchDownloads = async () => {
      if (userEmail) {
        try {
          const res = await axios.get(`/api/downloads/user/${userEmail}`);
          setDownloads(res.data);
        } catch (err) {
          console.error("Error fetching downloads:", err);
        }
      }
    };
    fetchDownloads();
  }, [userEmail]);




  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Downloaded Videos</h2>
      <ul>
        {downloads.map((d) => (
          <li key={d._id}>{d.videoId.videotitle} - {new Date(d.downloadDate).toLocaleDateString()}</li>
        ))}
      </ul>
    </div>
  );
}
