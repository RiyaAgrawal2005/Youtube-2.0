// components/Avatar.tsx
import React, { useState } from 'react';

const Avatar = ({
  photoURL,
  name,
  sender,
}: {
  photoURL?: string;
  name?: string;
  sender?: string;
}) => {
  const [imgError, setImgError] = useState(false);

  const initial = (name || sender || 'U').charAt(0).toUpperCase();

  return photoURL && photoURL.trim() !== '' && !imgError ? (
    <img
      src={photoURL}
      alt="User Avatar"
      className="w-8 h-8 rounded-full object-cover"
      onError={() => setImgError(true)}
    />
  ) : (
    <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center text-sm font-semibold">
      {initial}
    </div>
  );
};

export default Avatar;
