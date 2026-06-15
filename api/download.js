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

        // [TikTok] Kept exactly as it was - NO CHANGES HERE
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
        // [Instagram] New updated handler
        else if (cleanUrl.includes('instagram.com')) {
            const apiRes = await fetch(`https://api.snapinsta.io/api/ajaxSearch?q=${encodeURIComponent(cleanUrl)}&t=media&lang=en`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            const apiData = await apiRes.json();
            
            if (apiData && apiData.data) {
                const match = apiData.data.match(/href="([^"]+)"/);
                if (match && match[1]) {
                    return res.status(200).json({
                        success: true,
                        title: "Instagram Media",
                        downloadUrl: match[1].replace(/&amp;/g, '&')
                    });
                }
            }
            throw new Error("Instagram parsing failed");
        }
        // [YouTube] New updated handler
        else if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
            const apiRes = await fetch(`https://api.vvextractor.com/youtube?url=${encodeURIComponent(cleanUrl)}`);
            const apiData = await apiRes.json();
            
            if (apiData && apiData.url) {
                return res.status(200).json({
                    success: true,
                    title: apiData.title || "YouTube Video",
                    downloadUrl: apiData.url
                });
            }
            throw new Error("YouTube parsing failed");
        }
        // [Facebook] New updated handler
        else if (cleanUrl.includes('facebook.com') || cleanUrl.includes('fb.watch')) {
            const apiRes = await fetch(`https://api.vvextractor.com/facebook?url=${encodeURIComponent(cleanUrl)}`);
            const apiData = await apiRes.json();
            
            if (apiData && apiData.url) {
                return res.status(200).json({
                    success: true,
                    title: apiData.title || "Facebook Video",
                    downloadUrl: apiData.url
                });
            }
            throw new Error("Facebook parsing failed");
        }

        return res.status(400).json({ error: 'This platform link is not supported yet' });

    } catch (error) {
        return res.status(500).json({ error: 'Server error or unstable link. Please try again.' });
    }
            }
            
