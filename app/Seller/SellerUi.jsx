// 'use client';

// import React, { useState } from 'react';
// import Image from 'next/image';
// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// export default function SellerUi() {
//   const [imageFile, setImageFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [imageUrl, setImageUrl] = useState(null);

//   const handleFileChange = (e) => {
//     setImageFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!imageFile) {
//       alert('Please select an image first');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', imageFile);

//     setUploading(true);
//     try {
//               const endpoint =  "/add-images/image";

//       const res = await fetch(`${API_URL}${endpoint}`,{
//         method: 'POST',
//         body: formData,
//       });

//       if (!res.ok) throw new Error('Upload failed');

//       const data = await res.json();
//       setImageUrl(data.url);
//     } catch (err) {
//       console.error(err);
//       alert('Upload failed');
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="p-2 flex justify-center item-">
//       <h1>SellerUi</h1>
//       <input type="file" accept="image/*" onChange={handleFileChange} />
//       <button onClick={handleUpload} disabled={uploading || !imageFile}>
//         {uploading ? 'Uploading...' : 'addImage'}
//       </button>
//       <div>
//           {imageUrl && <Image src={imageUrl} alt="Uploaded" width={500} />}
//         </div>
    
//     </div>
//   );
// }



'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function SellerUi() {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  // Generate a local preview when a file is selected, and clean it up after
  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setError(null);
    setImageUrl(null);

    if (!file) {
      setImageFile(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      setImageFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be smaller than 5MB.');
      setImageFile(null);
      return;
    }

    setImageFile(file);
  };

  const handleUpload = async () => {
    if (!imageFile) {
      setError('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', imageFile);

    setUploading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/add-images/image`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.message || `Upload failed (${res.status})`);
      }

      const data = await res.json();
      setImageUrl(data.url);
      setImageFile(null);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 max-w-sm mx-auto">
      <h1 className="text-lg font-semibold">Seller UI</h1>

      <label className="w-full flex flex-col items-center gap-2 cursor-pointer">
        <span className="text-sm text-gray-600">Select an image to upload</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-sm"
        />
      </label>

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="rounded border max-h-48 object-contain"
        />
      )}

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading || !imageFile}
        className="px-4 py-2 rounded bg-blue-600 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
      <form >
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                price *
              </label>
              <input
                id="price"
                type="text"
                value={form.price}
                onChange={(e) => updateField("price ", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                required
              />
            </div>
<div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  brandName *
                </label>
                <select
                  id="role"
                  value={form.brandName}
                  onChange={(e) => updateField("role", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 bg-white rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  required
                >
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
              </div>


        </form>

      {imageUrl && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-green-600">Upload successful!</p>
      
               <img
          src={imageUrl}
          alt="Preview"
          className="rounded border max-h-48 object-contain"
        />
        </div>
      )}
    </div>
  );
}