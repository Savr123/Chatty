import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Stack,
    IconButton,
    Paper
} from '@mui/material';
import {
    Call,
    CallEnd,
    Mic,
    MicOff,
    VolumeUp
} from '@mui/icons-material';
import { useWebRTC } from '../hooks/useWebRTC';

const VoiceCall = ({ roomId }) => {
    const {
        isCallActive,
        isMuted,
        connectionStatus,
        localAudioRef,
        remoteAudioRef,
        startCall,
        hangUp,
        toggleMute
    } = useWebRTC();

    const getStatusColor = (status) => {
        switch (status) {
            case 'connected': return 'success';
            case 'connecting': return 'warning';
            case 'disconnected': return 'error';
            case 'waiting': return 'info';
            default: return 'default';
        }
    };

    const handleStartCall = () => {
        startCall(roomId || 'default-room');
    };

    return (
        <Card sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
            <CardContent>
                <Typography variant="h5" component="h2" gutterBottom align="center">
                    Voice Call
                </Typography>

                {/* Status */}
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                    <Chip
                        label={`Status: ${connectionStatus}`}
                        color={getStatusColor(connectionStatus)}
                        variant="outlined"
                    />
                </Box>

                {/* Audio Elements (hidden) */}
                <audio ref={localAudioRef} autoPlay muted />
                <audio ref={remoteAudioRef} autoPlay />

                {/* Connection Info */}
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Stack spacing={1}>
                        <Typography variant="body2">
                            Room: {roomId || 'default-room'}
                        </Typography>
                        <Typography variant="body2">
                            Call Active: {isCallActive ? 'Yes' : 'No'}
                        </Typography>
                        <Typography variant="body2">
                            Microphone: {isMuted ? 'Muted' : 'Unmuted'}
                        </Typography>
                    </Stack>
                </Paper>

                {/* Controls */}
                <Stack direction="row" spacing={2} justifyContent="center">
                    {!isCallActive ? (
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<Call />}
                            onClick={handleStartCall}
                            disabled={connectionStatus === 'connecting'}
                        >
                            Start Call
                        </Button>
                    ) : (
                        <>
                            <IconButton
                                color={isMuted ? "default" : "primary"}
                                onClick={toggleMute}
                                size="large"
                            >
                                {isMuted ? <MicOff /> : <Mic />}
                            </IconButton>
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<CallEnd />}
                                onClick={hangUp}
                            >
                                Hang Up
                            </Button>
                        </>
                    )}
                </Stack>

                {/* Audio Indicators */}
                {isCallActive && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                            <Mic color={isMuted ? "disabled" : "primary"} />
                            <Typography variant="body2">
                                {isMuted ? 'Muted' : 'Speaking...'}
                            </Typography>
                            <VolumeUp color="success" />
                            <Typography variant="body2">
                                Receiving Audio
                            </Typography>
                        </Stack>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default VoiceCall;