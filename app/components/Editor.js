"use client";

import React, { useRef, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import EditorBox from "@/app/components/EditorBox";
import { initSocket } from "@/app/socket/initSocket"; // Corrected import path
// import toast from "react-hot-toast";
import ACTIONS from "@/Actions";
import { useRouter } from "next/navigation";
import Client from "./Client";

const Editor = ({ roomId }) => {
  const searchParams = useSearchParams();
  const socketRef = useRef(null);
  const userName = searchParams.get("userName") || "No Username";
  const [clients, setClients] = useState([]);
  const joinCalledRef = useRef(false);
  const router = useRouter();
  const codeRef =useRef(null);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      function handleErrors(e) {
        console.log('socket error', e);
        // toast.error('Socket connection failed, try again later.');
        router.push("/home");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        userName: userName,
      });

      // Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== userName) {
            console.log(`${username} joined`);
          }
          console.log("hello", clients);
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );
      //Litening for disconnecting

      socketRef.current.on(
        ACTIONS.DISCONNECTED,
        ({ socketId, username }) => {
          // toast.success(`${username} left the room.`);
          console.log("hiii", username);
          setClients((prev) => {
            return prev.filter((client) => client.socketId !== socketId);
          });
        }
      );
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
        socketRef.current.disconnect();

      }
    };
  }, []);

  return (
    <div className="w-full h-screen flex">
      <div className="w-[15%] bg-black shadow-lg flex flex-col justify-between p-4">
        <div>
          <h2 className="text-lg font-bold mb-4 text-white">Clients</h2>
         
        </div>
        <div>
            {clients.map((client) => (
            <Client key={client.socketId} userName={client.userName} />
          ))}
          </div>
        <div className="mt-4 items-center">
          <button
            className="px-10 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => navigator.clipboard.writeText(roomId)}
          >
            COPY IDD
          </button>
          <button
            className="px-10 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => router.push('/')}
          >
            LEAVE ROOM
          </button>
        </div>
      </div>
      <div className="w-[85%] bg-white text-black flex items-center justify-center">
        <EditorBox 
                socketRef={socketRef}
                roomId={roomId}
                onCodeChange={(code) => {
                        codeRef.current = code;
                    }}/>
      </div>
    </div>
  );
};

export default Editor;
