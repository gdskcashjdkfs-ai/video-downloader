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

        // 1. TikTok Handler (Kept Exactly As It Was - NO CHANGES)
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

        } 
        // 2. Instagram Handler (Updated with New High-Stability Server)
        else if (cleanUrl.includes('instagram.com')) {
            const apiRes = await fetch(`https://api.socialdownloader.com/instagram?url=${encodeURIComponent(cleanUrl)}`);
            const apiData = await apiRes.json();
            
            if (apiData && apiData.video_url) {
                return res.status(200).json({
                    success: true,
                    title: apiData.title || "Instagram Video",
                    downloadUrl: apiData.video_url
                });
            }
            throw new Error("Instagram parsing failed");
        }
        // 3. YouTube Handler (Updated with New High-Stability Server)
        else if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
            const apiRes = await fetch(`https://api.socialdownloader.com/youtube?url=${encodeURIComponent(cleanUrl)}`);
            const apiData = await apiRes.json();
            
            if (apiData && apiData.video_url) {
                return res.status(200).json({
                    success: true,
                    title: apiData.title || "YouTube Video",
                    downloadUrl: apiData.video_url
                });
            }
            throw new Error("YouTube parsing failed");
        }
        // 4. Facebook Handler (Updated with New High-Stability Server)
        else if (cleanUrl.includes('facebook.com') || cleanUrl.includes('fb.watch')) {
            const apiRes = await fetch(`https://api.socialdownloader.com/facebook?url=${encodeURIComponent(cleanUrl)}`);
            const apiData = await apiRes.json();
            
            if (apiData && apiData.video_url) {
                return res.status(200).json({
                    success: true,
                    title: apiData.title || "Facebook Video",
                    downloadUrl: apiData.video_url
                });
            }
            throw new Error("Facebook parsing failed");
        }

        return res.status(400).json({ error: 'This platform link is not supported yet' });

    } catch (error) {
        return res.status(500).json({ error: 'Connection error. Please try clicking Download again.' });
    }
            }
                
