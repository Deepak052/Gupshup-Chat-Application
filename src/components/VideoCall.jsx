import React, { useEffect, useRef, useState } from "react";
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react";
import socket from "../socket";

const VideoCall = ({
  chatId,
  targetUserId,
  callerSocketId,
  isReceivingCall,
  callerName,
  offer,
  onEndCall,
}) => {
  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const streamRef = useRef(null);

  // Audio Context for Ringing
  const audioContextRef = useRef(null);
  const intervalRef = useRef(null);

  const startRinging = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const playTone = () => {
      const ctx = audioContextRef.current;
      if (!ctx || ctx.state === "closed") return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(480, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    };

    playTone();
    intervalRef.current = setInterval(playTone, 3000);
  };

  const stopRinging = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        streamRef.current = currentStream;
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((err) => console.error("Failed to get local stream", err));

    socket.on("call-ended", () => {
      stopRinging();
      setCallEnded(true);
      if (connectionRef.current) connectionRef.current.close();
      onEndCall();
    });

    if (isReceivingCall && !callAccepted) {
      startRinging();
    }

    // Handle page refresh / close
    const handleBeforeUnload = () => {
      if (targetUserId || callerSocketId) {
        socket.emit("end-call", { to: targetUserId || callerSocketId });
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      stopRinging();
      socket.off("call-ended");
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (connectionRef.current) connectionRef.current.close();
    };
    // eslint-disable-next-line
  }, [isReceivingCall]);

  const answerCall = async () => {
    stopRinging();
    setCallAccepted(true);
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" }
      ]
    });
    connectionRef.current = peerConnection;

    if (stream) {
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });
    }

    peerConnection.ontrack = (event) => {
      if (userVideo.current) {
        userVideo.current.srcObject = event.streams[0];
      }
    };

    peerConnection.oniceconnectionstatechange = () => {
      if (
        peerConnection.iceConnectionState === "disconnected" ||
        peerConnection.iceConnectionState === "failed" ||
        peerConnection.iceConnectionState === "closed"
      ) {
        leaveCall();
      }
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          to: callerSocketId,
          candidate: event.candidate,
        });
      }
    };

    socket.on("ice-candidate-received", (data) => {
      if (data.candidate) {
        peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate)).catch(e => console.error(e));
      }
    });

    if (offer) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socket.emit("make-answer", {
        answer: answer,
        to: callerSocketId
      });
    }
  };

  const callUser = async () => {
    setIsCalling(true);
    startRinging();

    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" }
      ]
    });
    connectionRef.current = peerConnection;

    if (stream) {
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });
    }

    peerConnection.ontrack = (event) => {
      if (userVideo.current) {
        userVideo.current.srcObject = event.streams[0];
      }
    };

    peerConnection.oniceconnectionstatechange = () => {
      if (
        peerConnection.iceConnectionState === "disconnected" ||
        peerConnection.iceConnectionState === "failed" ||
        peerConnection.iceConnectionState === "closed"
      ) {
        leaveCall();
      }
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          to: targetUserId,
          candidate: event.candidate,
        });
      }
    };

    socket.on("answer-made", async (data) => {
      stopRinging();
      setCallAccepted(true);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    });

    socket.on("ice-candidate-received", (data) => {
      if (data.candidate) {
        peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate)).catch(e => console.error(e));
      }
    });

    const newOffer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(newOffer));

    socket.emit("call-user", {
      userToCall: targetUserId,
      offer: newOffer,
      chatId,
      callerId: localStorage.getItem("userId")
    });
  };

  const leaveCall = () => {
    stopRinging();
    setCallEnded(true);
    socket.emit("end-call", { to: targetUserId || callerSocketId });
    if (connectionRef.current) connectionRef.current.close();
    onEndCall();
  };

  const toggleAudio = () => {
    if (stream) {
      const newState = !isAudioMuted;
      stream.getAudioTracks().forEach(track => {
        track.enabled = !newState;
      });
      setIsAudioMuted(newState);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const newState = !isVideoMuted;
      stream.getVideoTracks().forEach(track => {
        track.enabled = !newState;
      });
      setIsVideoMuted(newState);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
      {/* Videos Container */}
      <div className="flex-1 w-full relative max-w-4xl max-h-screen">
        {/* Main Video (Other person) */}
        {callAccepted && !callEnded ? (
          <video
            playsInline
            ref={userVideo}
            autoPlay
            className="w-full h-full object-cover rounded-lg shadow-xl"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white space-y-8 mt-20">
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-4 border-green-500 shadow-lg shadow-green-500/20">
              <span className="text-4xl">📞</span>
            </div>
            
            <h2 className="text-3xl font-light tracking-wide">
              {isReceivingCall 
                ? `Incoming Call from ${callerName}...` 
                : isCalling 
                  ? "Calling..." 
                  : `Ready to call ${callerName}?`}
            </h2>

            <div className="flex items-center gap-6 mt-10">
              {isReceivingCall && !callAccepted && (
                <button
                  onClick={answerCall}
                  className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-full flex items-center shadow-lg transform transition hover:scale-105 active:scale-95"
                >
                  <Phone className="w-6 h-6 mr-3" />
                  <span className="font-semibold text-lg">Answer</span>
                </button>
              )}
              
              {!isReceivingCall && !callAccepted && !isCalling && (
                <button
                  onClick={callUser}
                  className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-full flex items-center shadow-lg transform transition hover:scale-105 active:scale-95"
                >
                  <Phone className="w-6 h-6 mr-3" />
                  <span className="font-semibold text-lg">Start Call</span>
                </button>
              )}

              {/* Decline / Cancel Call button visible before connection */}
              {(!callAccepted) && (
                <button
                  onClick={leaveCall}
                  className="bg-red-500 hover:bg-red-600 px-8 py-4 rounded-full flex items-center shadow-lg transform transition hover:scale-105 active:scale-95"
                >
                  <PhoneOff className="w-6 h-6 mr-3" />
                  <span className="font-semibold text-lg">
                    {isReceivingCall ? "Decline" : "Cancel"}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Local Video */}
        {stream && (
          <div className="absolute bottom-6 right-6 w-32 md:w-48 aspect-[3/4] bg-gray-900 rounded-xl overflow-hidden shadow-2xl border-2 border-gray-700 z-10">
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">You</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-full h-24 bg-[#111b21] flex items-center justify-center space-x-6 px-6">
        <button
          onClick={toggleAudio}
          className={`p-4 rounded-full transition-colors ${isAudioMuted ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"}`}
          title={isAudioMuted ? "Unmute Audio" : "Mute Audio"}
        >
          {isAudioMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>
        
        {callAccepted && (
          <button
            onClick={leaveCall}
            className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transform transition hover:scale-105 active:scale-95 shadow-lg shadow-red-500/20"
            title="End Call"
          >
            <PhoneOff className="w-8 h-8" />
          </button>
        )}
        
        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full transition-colors ${isVideoMuted ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"}`}
          title={isVideoMuted ? "Enable Video" : "Disable Video"}
        >
          {isVideoMuted ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
