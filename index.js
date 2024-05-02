import "dotenv/config";
import fs from 'fs-extra';
import express from "express";
import bodyParser from "body-parser";
import path from "node:path";
import GeneratorPosts from './utils/GeneratorPosts.js';
import textToSpeech from "./utils/textToSpeech.js";
import { HtmlToImage } from "./utils/HtmlToImage.js";
import { imageToVideo, getAudioDuration } from "./utils/imageToVideo.js";
import getBuffer from './utils/getBuffer.js';
import generateRandomName from './utils/generateRandomName.js';
import detectInputType from './utils/detectInputType.js';



console.log(`[${new Date().toLocaleString()}] 🚀 Application started successfully.`);

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "100mb" }));

const root = path.resolve(process.cwd());
const outputDir = path.join(root, "output");
const videoDir = path.join(root, "video");
fs.ensureDirSync(outputDir);
fs.ensureDirSync(videoDir);

app.get("/", async (req, res, next) => {
    res.send(`[${new Date().toLocaleString()}] 🚀 Application started successfully.`)
});

app.post("/generate-text", async (req, res, next) => {
    try {
        const { content } = req.body;
        if (!content) {
            res.status(400).json({ message: "You must provide both 'content' in the request query." });
            return;
        }

        const generator = await GeneratorPosts(content);
        if (!generator) {
            res.status(500).json({ message: "An error occurred while generating the text." });
            return;
        }

        res.status(200).json({ text: generator });
    } catch (error) {
        res.status(500).json({ message: `An error occurred while generating the text: ${error.message}` });
    }
});

app.post("/generate-image", async (req, res, next) => {
    let outputImage
    try {
        const { content, imageSource, logoSource, copyright } = req.body;
        if (!content || !imageSource || !logoSource || !copyright) {
            res.status(400).json({ message: "You must provide both content and imageSource and logoSource and copyright in the request body." });
            return;
        }

        outputImage = path.join(outputDir, `${generateRandomName(20)}.jpeg`);
        const htmlToImageBuffer = await HtmlToImage(content, imageSource, logoSource, copyright, outputImage);

        if (!htmlToImageBuffer) {
            res.status(500).json({ message: "An error occurred while generating the image." });
            return;
        }

        res.status(200).json({ buffer: htmlToImageBuffer });
    } catch (error) {
        res.status(500).json({ message: `An error occurred while generating the image: ${error.message}` });
    } finally {
        await new Promise(r => setTimeout(r, 60000));
        if (fs.existsSync(outputImage)) {
            try {
                fs.unlinkSync(outputImage);
            } catch (error) {
                console.error(`[${new Date().toLocaleString()}] ❌ Error occurred: ${error}`);
            }
        }
    }
});

app.post("/generate-audio", async (req, res, next) => {
    let outputAudio
    try {
        const { content } = req.body;
        if (!content) {
            res.status(400).json({ message: "You must provide content in the request body." });
            return;
        }

        const fileName = generateRandomName(20);
        outputAudio = path.join(outputDir, `${fileName}.mp3`);
        const speech = await textToSpeech(content, outputAudio);

        if (!speech || speech?.error) {
            res.status(500).json({ message: "An error occurred while generating the audio." });
            return;
        }

        await new Promise(r => setTimeout(r, 2000));
        const readAudio = fs.readFileSync(outputAudio);
        res.status(200).json({ buffer: readAudio });
    } catch (error) {
        res.status(500).json({ message: `An error occurred while generating the audio: ${error.message}` });
    } finally {
        await new Promise(r => setTimeout(r, 60000));
        if (fs.existsSync(outputAudio)) {
            try {
                fs.unlinkSync(outputAudio);
            } catch (error) {
                console.error(`[${new Date().toLocaleString()}] ❌ Error occurred: ${error}`);
            }
        }
    }
});

app.post("/generate-video", async (req, res, next) => {
    let outputVideo, imagePath, audioPath;
    try {


        const { image, audio } = req.body;
        if (!image || !audio) {
            res.status(400).json({ message: "You must provide both image and audio in the request body." });
            return;
        }

        const fileName = generateRandomName(20);

        if (detectInputType(image) === "buffer") {
            imagePath = path.join(outputDir, `${fileName}.jpeg`);
            fs.writeFileSync(imagePath, Buffer.from(image));
        } else if (detectInputType(image) === "url") {
            const imageBuffer = await getBuffer(image);
            imagePath = path.join(outputDir, `${fileName}.jpeg`)
            fs.writeFileSync(imagePath, Buffer.from(imageBuffer));
        }

        if (detectInputType(audio) === "buffer") {
            audioPath = `output/${fileName}.mp3`;
            audioPath = path.join(outputDir, `${fileName}.mp3`);
            fs.writeFileSync(audioPath, Buffer.from(audio));
        } else if (detectInputType(audio) === "url") {
            const audioBuffer = await getBuffer(audio);
            audioPath = path.join(outputDir, `${fileName}.mp3`);
            fs.writeFileSync(audioPath, Buffer.from(audioBuffer));
        }

        outputVideo = path.join(videoDir, `${fileName}.mp4`);

        await new Promise(r => setTimeout(r, 2000));
        const video = await imageToVideo(imagePath, audioPath, outputVideo);

        if (!video) {
            res.status(500).json({ message: "An error occurred while generating the video." });
            return;
        }

        await new Promise(r => setTimeout(r, 2000));
        const readVideo = fs.readFileSync(outputVideo);
        res.status(200).json({ buffer: readVideo });
    } catch (error) {
        res.status(500).json({ message: `An error occurred while generating the video: ${error}` });
    } finally {
        await new Promise(r => setTimeout(r, 60000));
        if (fs.existsSync(outputVideo)) {
            try {
                fs.unlinkSync(outputVideo);
            } catch (error) {
                console.error(`[${new Date().toLocaleString()}] ❌ Error occurred: ${error}`);
            }
        } if (fs.existsSync(imagePath)) {
            try {
                fs.unlinkSync(imagePath);
            } catch (error) {
                console.error(`[${new Date().toLocaleString()}] ❌ Error occurred: ${error}`);
            }
        } if (fs.existsSync(audioPath)) {
            try {
                fs.unlinkSync(audioPath);
            } catch (error) {
                console.error(`[${new Date().toLocaleString()}] ❌ Error occurred: ${error}`);
            }
        }
    }
});

app.listen(port, () => {
    console.log(`[Rn0x:Aosus] Server started on port ${port}`);
});