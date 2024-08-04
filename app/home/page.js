"use client";
import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const Home = () => {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const router = useRouter();

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("New Room Created");
  }

  const handleRoomIdChange = (e) => {
    setRoomId(e.target.value);
  }

  const handleUserName = (e) => {
    setUserName(e.target.value);
  }

  const joinRoom = () => {
    if (roomId.trim() && userName.trim()) {
      router.push(`/editor/${roomId}?userName=${encodeURIComponent(userName)}`);
    } else {
      toast.error("Please enter both Room ID and Username");
    }
  }

  return (
    <>
      <div>
        <Toaster position='top-right' />
      </div>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">CODASM</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="room-id">
              Room ID
            </label>
            <input
              id="room-id"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={handleRoomIdChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter Username"
              value={userName}
              onChange={handleUserName}
            />
          </div>
          <button
            onClick={joinRoom}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="button"
          >
            Join Room
          </button>
          <div className="mt-6 text-center">
            <p className="text-gray-600">Don&apos;t have an invite?</p> {/* Escape the apostrophe */}
            <button
              onClick={createNewRoom}
              className="text-blue-500 hover:text-blue-700 focus:outline-none"
            >
              Create a Room
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
