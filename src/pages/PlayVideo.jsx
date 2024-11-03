import React, { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';



const PlayVideo = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Get the location object
    const queryParams = new URLSearchParams(location.search); // Parse the query string
    const videoUrl = queryParams.get('url'); // Extract the 'url' parameter

    const [isLoading, setIsLoading] = useState(true);




    useEffect(() => {
        const downloadVideo = async () => {
            const videoName = videoUrl;
            const body = `video_name=${encodeURIComponent(videoName)}`;

            try {
                console.log('Starting download for:', videoName);

                const response = await fetch('http://134.122.63.191:9000/play-video', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: body,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Server responded with an error:', errorText);
                    throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
                }

                // Convert the response to a blob and check its size
                const blob = await response.blob();
                console.log('Blob size:', blob.size);

                if (blob.size <= 48) {
                    throw new Error('Received unexpected response size, possibly an error.');
                }

                const blobUrl = URL.createObjectURL(blob);

                // Trigger the download
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = videoName;
                document.body.appendChild(link);
                link.click();

                // Clean up
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);

                console.log('Download triggered successfully');

                setIsLoading(false);

                setTimeout(() => {
                    navigate('/');
                }, 3000);

            } catch (error) {
                console.error('Error downloading video:', error);
                setIsLoading(false);
            }
        };

        downloadVideo();
    }, []);

    return (
        <div className="w-full min-h-screen md:w-[70%] flex flex-col items-center justify-center gap-20 mx-auto pb-24 mt-32 px-10">
            {isLoading ? (
                <div className="loader-container flex flex-col items-center">
                    <ClipLoader color="#09f" loading={isLoading} size={100} />
                    <p className="mt-4 font-christmas text-3xl" aria-live="polite">Video downloaden...</p>
                </div>
            ) : (
                <p className="mt-4 font-christmas text-3xl" aria-live="polite">Download voltooid!</p>
            )}
        </div>
    );
};

export default PlayVideo;
