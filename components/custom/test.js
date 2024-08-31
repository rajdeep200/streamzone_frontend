// components/VideoStream.js

import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const VideoStream = () => {
  const userVideoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const socketRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false); // New state to track streaming status

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io();

    // Get user media on component mount
    const fetchUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setMediaStream(stream);
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    fetchUserMedia();

    return () => {
      // Cleanup: stop media tracks and disconnect socket on component unmount
      stopStreaming();
    };
  }, []);

  const startStreaming = () => {
    if (mediaStream) {
      const mediaRecorder = new MediaRecorder(mediaStream, {
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000,
        framerate: 25,
      });

      mediaRecorder.ondataavailable = (event) => {
        console.log('Binary Stream Available', event.data);
        socketRef.current.emit('binarystream', event.data);
      };

      mediaRecorder.start(25);
      setIsStreaming(true); // Set streaming status to true
    }
  };

  const stopStreaming = () => {
    if (mediaStream) {
      // Stop all media tracks
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }

    if (socketRef.current) {
      // Disconnect the WebSocket connection
      socketRef.current.disconnect();
    }

    setIsStreaming(false); // Set streaming status to false
  };

  return (
    <div>
      <h1>Streamyard Clone</h1>
      <video ref={userVideoRef} autoPlay muted style={{ width: '100%', maxHeight: '400px' }}></video>
      {!isStreaming ? (
        <button onClick={startStreaming}>Start</button>
      ) : (
        <button onClick={stopStreaming}>Stop</button>
      )}
    </div>
  );
};

export default VideoStream;
