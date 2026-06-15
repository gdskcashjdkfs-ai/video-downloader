export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { videoUrl } = req.body;

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const cleanUrl = videoUrl.trim();

        if (cleanUrl.includes('tiktok.com')) {
            const apiRes = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(cleanUrl)}`);
            const apiData = await apiRes.json();

            if (apiData && apiData.data) {
                const downloadLink = apiData.data.play || apiData.data.wmplay;
                const videoTitle = apiData.data.title || "TikTok Video";

                return res.status(200).json({
                    success: true,
                    title: videoTitle,
                    downloadUrl: downloadLink
                });
            }
            
            const hybridRes = await fetch(`https://api.tik-downloader.com/v1/fetch?url=${encodeURIComponent(cleanUrl)}`);
            const hybridData = await hybridRes.json();
            
            if (hybridData && hybridData.video_url) {
                return res.status(200).json({
                    success: true,
                    title: hybridData.title || "TikTok Video",
                    downloadUrl: hybridData.video_url
                });
            }

            throw new Error("TikTok servers are parsing failed");

        } else if (cleanUrl.includes('instagram.com') || cleanUrl.includes('facebook.com') || cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
            const apiRes = await fetch(`https://api.coor.me/download?url=${encodeURIComponent(cleanUrl)}`);
            const apiData = await apiRes.json();
            
            if (apiData && apiData.url) {
                return res.status(200).json({
                    success: true,
                    title: apiData.title || "Social Video",
                    downloadUrl: apiData.url
                });
            }
        }

        return res.status(400).json({ error: 'This platform link is not supported yet' });

    } catch (error) {
        return res.status(500).json({ error: 'Connection error. Please try clicking Download again.' });
    }
                    }
