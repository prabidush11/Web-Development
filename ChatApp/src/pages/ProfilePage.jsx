import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser?.fullName || '');
  const [bio, setBio] = useState(authUser?.bio || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let success;
      
      if (selectedImage) {
        const base64Image = await convertToBase64(selectedImage);
        success = await updateProfile({ profilePic: base64Image, fullName: name, bio });
      } else {
        success = await updateProfile({ fullName: name, bio });
      }

      if (success) {
        navigate('/');
      }
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-2 p-10 flex-1'>
          <h3 className='text-lg'>Profile details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input
              onChange={(e) => setSelectedImage(e.target.files[0])}
              type="file"
              id='avatar'
              accept='.png,.jpg,.jpeg'
              hidden
            />
            <img
              src={selectedImage ? URL.createObjectURL(selectedImage) : (authUser?.profilePic || assets.avatar_icon)}
              alt="Profile"
              className={`w-12 h-12 rounded-full object-cover`}
            />
            <span>Upload profile image</span>
          </label>
          <input 
            onChange={(e) => setName(e.target.value)} 
            value={name} 
            type="text" 
            required 
            placeholder='Your name' 
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' 
          />
          <textarea 
            onChange={(e) => setBio(e.target.value)} 
            value={bio} 
            required 
            placeholder='Write profile bio' 
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' 
            rows={4}
          ></textarea>
          <button 
            className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer disabled:opacity-50' 
            type='submit'
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </form>
        <img 
          className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10' 
          src={authUser?.profilePic ||assets.logo_icon} 
          alt="Logo" 
        />
      </div>
    </div>
  );
};

export default ProfilePage;