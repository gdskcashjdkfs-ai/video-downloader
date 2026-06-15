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
        // 2. Instagram Handler (Dual Server - Main + Backup)
        else if (cleanUrl.includes('instagram.com')) {
            try {
                const res1 = await fetch(`https://api.downloadanyvideo.com/instagram?url=${encodeURIComponent(cleanUrl)}`);
                const data1 = await res1.json();
                if (data1 && data1.url) {
                    return res.status(200).json({ success: true, title: data1.title || "Instagram Video", downloadUrl: data1.url });
                }
            } catch (e) {}

            // Backup Server
            const res2 = await fetch(`https://api.vvextractor.com/instagram?url=${encodeURIComponent(cleanUrl)}`);
            const data2 = await res2.json();
            if (data2 && data2.url) {
                return res.status(200).json({ success: true, title: data2.title || "Instagram Video", downloadUrl: data2.url });
            }
            throw new Error("Instagram parsing failed");
        }
        // 3. YouTube Handler (Dual Server - Main + Backup)
        else if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
            try {
                const res1 = await fetch(`https://api.downloadanyvideo.com/youtube?url=${encodeURIComponent(cleanUrl)}`);
                const data1 = await res1.json();
                if (data1 && data1.url) {
                    return res.status(200).json({ success: true, title: data1.title || "YouTube Video", downloadUrl: data1.url });
                }
            } catch (e) {}

            // Backup Server
            const res2 = await fetch(`https://api.vvextractor.com/youtube?url=${encodeURIComponent(cleanUrl)}`);
            const data2 = await res2.json();
            if (data2 && data2.url) {
                return res.status(200).json({ success: true, title: data2.title || "YouTube Video", downloadUrl: data2.url });
            }
            throw new Error("YouTube parsing failed");
        }
        // 4. Facebook Handler (Dual Server - Main + Backup)
        else if (cleanUrl.includes('facebook.com') || cleanUrl.includes('fb.watch')) {
            try {
                const res1 = await fetch(`https://api.downloadanyvideo.com/facebook?url=${encodeURIComponent(cleanUrl)}`);
                const data1 = await res1.json();
                if (data1 && data1.url) {
                    return res.status(200).json({ success: true, title: data1.title || "Facebook Video", downloadUrl: data1.url });
                }
            } catch (e) {}

            // Backup Server
            const res2 = await fetch(`https://api.vvextractor.com/facebook?url=${encodeURIComponent(cleanUrl)}`);
            const data2 = await res2.json();
            if (data2 && data2.url) {
                return res.status(200).json({ success: true, title: data2.title || "Facebook Video", downloadUrl: data2.url });
            }
            throw new Error("Facebook parsing failed");
        }

        return res.status(400).json({ error: 'This platform link is not supported yet' });

    } catch (error) {
        return res.status(500).json({ error: 'Server error or unstable link. Please try again.' });
    }
                }
                                     
