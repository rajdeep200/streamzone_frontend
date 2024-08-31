'use client'

import React, { useEffect, useState, useRef } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Button } from '../ui/button'
import {
    VideoIcon,
    SpeakerModerateIcon
} from "@radix-ui/react-icons"

import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { io } from "socket.io-client";


const VideoStream: React.FC = () => {
    const userVideoRef = useRef<HTMLVideoElement>(null);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const socketRef = useRef<any>(null);
    const [isStreaming, setIsStreaming] = useState(false)

    useEffect(() => {

        socketRef.current = io("http://localhost:4040/")

        const fetchUserMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                })
                setMediaStream(stream)
                if (userVideoRef.current) {
                    userVideoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing media devices.', error);
            }
        }
        fetchUserMedia()

        return () => {
            if(mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop())
            }

            if(socketRef.current) {
                socketRef.current.disconnect();
            }
        }

    }, [])

    const startStreaming = () => {
        if(mediaStream) {
            const mediaRecorder = new MediaRecorder(mediaStream, {
                audioBitsPerSecond: 128000,
                videoBitsPerSecond: 2500000
            })

            mediaRecorder.ondataavailable = event => {
                console.log('Binary Stream Available', event.data);
                socketRef.current.emit('binarydata', event.data)
            }

            mediaRecorder.start(25);
            setIsStreaming(true);
        }
    }

    const stopStreaming = () => {
        if(mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            setMediaStream(null);
        }

        if(socketRef.current) {
            socketRef.current.disconnect();
        }
    }


    return (
        <div>
            <Card>
                <CardContent className={cn("p-0 border-[1px] border-slate-400 m-2")}>
                    <video ref={userVideoRef} autoPlay muted className=''></video>
                </CardContent>
                <CardContent>
                    <ToggleGroup type="multiple" variant="outline">
                        <ToggleGroupItem value="bold" aria-label="Toggle bold">
                            <VideoIcon className="h-4 w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="italic" aria-label="Toggle italic">
                            <SpeakerModerateIcon className="h-4 w-4" />
                        </ToggleGroupItem>
                    </ToggleGroup>
                </CardContent>
                <CardContent className={cn("flex justify-around items-center")}>
                    <Button className={cn("text-lg bg-green-600")} onClick={startStreaming}>Start</Button>
                    <Button className={cn("text-lg bg-red-600")} onClick={stopStreaming}>Stop</Button>
                </CardContent>
            </Card>

        </div>
    )
}

export default VideoStream
