const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite'); // For Turkish characters

const app = express();
const port = 3000;

app.use(express.json());


const data_regex = /(?<date>\d{4}\.\d{1,2}\.\d{1,2})\ +(?<time>\d{2}\:\d{2}:\d{2})\ +(?<latitude>\d{1,2}\.\d{4})\ +(?<longitude>\d{1,2}\.\d{4})\ +(?<depth>\d{1,2}\.\d{1,2})\ +(?<magnitude_duration>...)\ +(?<magnitude_local>...)\ +(?<magnitude_moment>...)\ +(?<location>.+?(?=\ \ ))\ +(?<solution_type>.*)/
const site_url = "http://www.koeri.boun.edu.tr/scripts/lst1.asp"

const getSiteData = async () => {
    const response = await axios.get(site_url, {responseType: 'arraybuffer'});
    const html = iconv.decode(response.data, "windows-1254");
    
    const $ = cheerio.load(html);
    const data = $("pre").text().trim().split("\n").slice(6, -1).map(line => line.match(data_regex)["groups"])
    
    return data
}

app.get("/all", async (req, res) => {
    try {
        const data = await getSiteData();
        
        res.json(data);
    }
    catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Kandilli Rasathanesi verilerine ulaşılamadı." });
    }
});

app.get("/at", async (req, res) => {
    const {date, time}  = req.query;

    try {
        const data = await getSiteData();
        const filteredData = data.filter(item => item.date.startsWith(date||"") && item.time.startsWith(time||""));
        
        if (filteredData.length === 0) {
            return res.status(404).json({ error: "Veri bulunamadı." });
        }
        
        res.json(filteredData);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Kandilli Rasathanesi verilerine ulaşılamadı." });
    }
});

app.get("/near", async (req, res) => {
    const {latitude, longitude, radius} = req.query;
    
    try {
        const data = await getSiteData();
        const filteredData = data.filter(item => {
            const itemLat = parseFloat(item.latitude);
            const itemLon = parseFloat(item.longitude);
            const lat = parseFloat(latitude);
            const lon = parseFloat(longitude);
            const rad = parseFloat(radius) || 0; // Default to 0 if not provided
            
            return Math.sqrt(Math.pow(itemLat - lat, 2) + Math.pow(itemLon - lon, 2)) <= rad;
        });
        
        if (filteredData.length === 0) {
            return res.status(404).json({ error: "Veri bulunamadı." });
        }
        
        res.json(filteredData);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Kandilli Rasathanesi verilerine ulaşılamadı." });
    }
});

app.get("/in", async (req, res) => {
    const location = req.query.location; // Convert to lowercase for case-insensitive comparison

    if (!location) {
        return res.status(400).json({ error: "Location parametresi gerekli." });
    }

    try {
        const data = await getSiteData();
        const filteredData = data.filter(item => item.location.toLowerCase().includes(location.toLowerCase()));
        
        if (filteredData.length === 0) {
            return res.status(404).json({ error: "Veri bulunamadı." });
        }
        
        res.json(filteredData);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Kandilli Rasathanesi verilerine ulaşılamadı." });
    }

});

app.get("/last{/:count}", async (req, res) => {
    const count = req.params.count || 1; // Default to 1 if not provided
    try {
        const data = await getSiteData();
        
        res.json(data.slice(0, count));
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Kandilli Rasathanesi verilerine ulaşılamadı." });
    }
});

app.get("/filter", async (req, res) => {
    const {date, time, latitude, longitude, depth, md, ml, mw, location} = req.query;
    
    try {
        const data = await getSiteData();
        const filteredData = data.filter(item => {
            return (!date || item.date.startsWith(date)) &&
                   (!time || item.time.startsWith(time)) &&
                   (!latitude || item.latitude.startsWith(latitude)) &&
                   (!longitude || item.longitude.startsWith(longitude)) &&
                   (!depth || item.depth.startsWith(depth)) &&
                   (!md || item.magnitude_duration.startsWith(md)) &&
                   (!ml || item.magnitude_local.startsWith(ml)) &&
                   (!mw || item.magnitude_moment.startsWith(mw)) &&
                   (!location || item.location.toLowerCase().includes(location.toLowerCase()));
        });
        
        if (filteredData.length === 0) {
            return res.status(404).json({ error: "Veri bulunamadı." });
        }
        
        res.json(filteredData);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Kandilli Rasathanesi verilerine ulaşılamadı." });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});