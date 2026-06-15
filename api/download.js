export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { videoUrl } = req.body;

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        let downloadLink = "";
        let videoTitle = "Video Download Ready";
        const cleanUrl = videoUrl.trim();

        if (cleanUrl.includes('tiktok.com')) {
            try {
                const apiRes = await fetch(`https://api.tikwm.com/api/?url=${encodeURIComponent(cleanUrl)}`);
                const apiData = await apiRes.json();
                if (apiData && apiData.data) {
                    downloadLink = apiData.data.play || apiData.data.wmplay; 
                    videoTitle = apiData.data.title || "TikTok Video";
                }
            } catch (e) {
                const backupRes = await fetch(`https://api.vvextractor.com/tiktok?url=${encodeURIComponent(cleanUrl)}`);
                const backupData = await backupRes.json();
                if (backupData && backupData.url) {
                    downloadLink = backupData.url;
                }
            }

            if (!downloadLink) {
                throw new Error("All TikTok APIs failed");
            }
        } 
        else if (cleanUrl.includes('instagram.com') || cleanUrl.includes('facebook.com') || cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
            const apiRes = await fetch(`https://api.coor.me/download?url=${encodeURIComponent(cleanUrl)}`);
            const apiData = await apiRes.json();
            
            if (apiData && apiData.url) {
                downloadLink = apiData.url;
                videoTitle = apiData.title || "Social Video";
            } else {
                downloadLink = cleanUrl; 
            }
        } else {
            return res.status(400).json({ error: 'This platform link is not supported yet' });
        }

        return res.status(200).json({
            success: true,
            title: videoTitle,
            downloadUrl: downloadLink
        });

    } catch (error) {
        return res.status(500).json({ error: 'Server temporarily busy. Please try another link.' });
    }
                 }
                                         
