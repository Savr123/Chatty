import { useState, useRef, useCallback } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

export const useWebRTC = () => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isCallActive, setIsCallActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');

    const peerConnection = useRef(null);
    const signalRConnection = useRef(null);
    const localAudioRef = useRef(null);
    const remoteAudioRef = useRef(null);

    const config = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ]
    };

    // Initialize SignalR connection
    const initializeSignalR = useCallback(async (roomId) => {
        try {
            const connection = new HubConnectionBuilder()
                .withUrl(`https://your-signalr-hub-url/webrtchub`)
                .configureLogging(LogLevel.Information)
                .build();

            // Set up message handlers
            connection.on('Offer', async (offer) => {
                await handleOffer(offer);
            });

            connection.on('Answer', async (answer) => {
                await handleAnswer(answer);
            });

            connection.on('IceCandidate', async (candidate) => {
                await handleIceCandidate(candidate);
            });

            connection.on('UserJoined', (userId) => {
                console.log('User joined:', userId);
            });

            connection.on('UserLeft', (userId) => {
                console.log('User left:', userId);
                hangUp();
            });

            await connection.start();
            await connection.invoke('JoinRoom', roomId);

            signalRConnection.current = connection;
            setConnectionStatus('connected');

            return true;
        } catch (error) {
            console.error('SignalR Connection Error:', error);
            setConnectionStatus('error');
            return false;
        }
    }, []);

    // Create peer connection
    const createPeerConnection = useCallback(() => {
        const pc = new RTCPeerConnection(config);

        pc.onicecandidate = (event) => {
            if (event.candidate && signalRConnection.current) {
                signalRConnection.current.invoke('SendIceCandidate', event.candidate);
            }
        };

        pc.ontrack = (event) => {
            console.log('Received remote stream');
            setRemoteStream(event.streams[0]);
            if (remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = event.streams[0];
            }
        };

        pc.onconnectionstatechange = () => {
            console.log('Connection state:', pc.connectionState);
            setConnectionStatus(pc.connectionState);

            if (pc.connectionState === 'connected') {
                setIsCallActive(true);
            } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
                hangUp();
            }
        };

        return pc;
    }, []);

    // Start call
    const startCall = useCallback(async (roomId) => {
        try {
            setConnectionStatus('initializing');

            // Initialize signaling
            const signalingReady = await initializeSignalR(roomId);
            if (!signalingReady) throw new Error('Signaling failed');

            // Get user media
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                },
                video: false
            });

            setLocalStream(stream);
            if (localAudioRef.current) {
                localAudioRef.current.srcObject = stream;
            }

            // Create peer connection
            peerConnection.current = createPeerConnection();

            // Add tracks to connection
            stream.getTracks().forEach(track => {
                peerConnection.current.addTrack(track, stream);
            });

            // Create offer
            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);

            // Send offer via SignalR
            if (signalRConnection.current) {
                await signalRConnection.current.invoke('SendOffer', offer);
            }

            setConnectionStatus('waiting');

        } catch (error) {
            console.error('Error starting call:', error);
            setConnectionStatus('error');
        }
    }, [initializeSignalR, createPeerConnection]);

    // Handle incoming offer
    const handleOffer = useCallback(async (offer) => {
        if (!peerConnection.current) {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                },
                video: false
            });

            setLocalStream(stream);
            if (localAudioRef.current) {
                localAudioRef.current.srcObject = stream;
            }

            peerConnection.current = createPeerConnection();
            stream.getTracks().forEach(track => {
                peerConnection.current.addTrack(track, stream);
            });
        }

        await peerConnection.current.setRemoteDescription(offer);
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);

        if (signalRConnection.current) {
            await signalRConnection.current.invoke('SendAnswer', answer);
        }

        setIsCallActive(true);
    }, [createPeerConnection]);

    // Handle incoming answer
    const handleAnswer = useCallback(async (answer) => {
        if (peerConnection.current) {
            await peerConnection.current.setRemoteDescription(answer);
        }
    }, []);

    // Handle ICE candidates
    const handleIceCandidate = useCallback(async (candidate) => {
        if (peerConnection.current) {
            await peerConnection.current.addIceCandidate(candidate);
        }
    }, []);

    // Toggle mute
    const toggleMute = useCallback(() => {
        if (localStream) {
            const audioTracks = localStream.getAudioTracks();
            audioTracks.forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    }, [localStream, isMuted]);

    // Hang up call
    const hangUp = useCallback(() => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }

        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }

        if (signalRConnection.current) {
            signalRConnection.current.stop();
            signalRConnection.current = null;
        }

        setRemoteStream(null);
        setIsCallActive(false);
        setIsMuted(false);
        setConnectionStatus('disconnected');

        if (localAudioRef.current) localAudioRef.current.srcObject = null;
        if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
    }, [localStream]);

    return {
        localStream,
        remoteStream,
        isCallActive,
        isMuted,
        connectionStatus,
        localAudioRef,
        remoteAudioRef,
        startCall,
        hangUp,
        toggleMute
    };
};