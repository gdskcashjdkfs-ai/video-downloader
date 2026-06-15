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

        if (videoUrl.includes('tiktok.com')) {
            const apiRes = await fetch(`https://api.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}`);
            const apiData = await apiRes.json();
            
            if (apiData && apiData.data) {
                downloadLink = apiData.data.play; 
                videoTitle = apiData.data.title || "TikTok Video";
            } else {
                throw new Error("TikTok extraction failed");
            }
        } 
        else if (videoUrl.includes('instagram.com') || videoUrl.includes('facebook.com') || videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
            const apiRes = await fetch(`https://api.coor.me/download?url=${encodeURIComponent(videoUrl)}`);
            const apiData = await apiRes.json();
            
            if (apiData && apiData.url) {
                downloadLink = apiData.url;
                videoTitle = apiData.title || "Social Video";
            } else {
                downloadLink = videoUrl; 
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
        return res.status(500).json({ error: 'System update detected. Please try again in a moment.' });
    }
        }
              
