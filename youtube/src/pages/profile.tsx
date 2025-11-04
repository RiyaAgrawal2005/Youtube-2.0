import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase'; // adjust path if needed

interface User {
  id: string;
  email: string;
  points: number;
  watchedVideos: string[];
}

const ProfilePage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        const usersData: User[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          email: doc.data().email,
          points: doc.data().points ?? 0,
          watchedVideos: doc.data().watchedVideos ?? [],
        }));
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="p-6 text-lg text-center">Loading users...</div>;
  }

  
return (
  <div className="max-w-5xl mx-auto p-6">
    <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
      👥 User Profiles
    </h1>

    {users.length === 0 ? (
      <p className="text-gray-700 dark:text-gray-300">No users found.</p>
    ) : (
      <div className="space-y-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="border border-gray-200 dark:border-gray-700 
                       p-4 rounded-xl shadow-sm 
                       bg-gray-100 dark:bg-gray-800"
          >
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              📧 {user.email}
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              ⭐ <strong>Points:</strong> {user.points}
            </p>

            <div className="mt-2">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                📽️ Watched Videos:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                {user.watchedVideos.length > 0 ? (
                  user.watchedVideos.map((vid, idx) => (
                    <li key={idx}>{vid}</li>
                  ))
                ) : (
                  <li>None</li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);







};

export default ProfilePage;
