import nodeHtmlToImage from 'node-html-to-image'
import fs from 'fs-extra';
import path from "node:path";

export async function HtmlToImage(CONTENT, IMAGESOURCE, LOGO, COPYRIGHT, FILE_PATH) {

    try {
        const root = path.resolve(process.cwd());
        const Template = fs.readFileSync(path.join(root, "template.html"), "utf8");
        const logoURI = await imageToDataURI(LOGO);
        const imageURI = await imageToDataURI(IMAGESOURCE);

        return await nodeHtmlToImage({
            html: Template,
            puppeteerArgs: {
                headless: "new",
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--disable-gpu',
                ],
                executablePath: process.env.CHROME_PATH,
                defaultViewport: {
                    width: 1350,
                    height: 1080,
                },

            },
            waitUntil: "networkidle2",
            content: { Content: CONTENT, imageSource: imageURI, logo: logoURI, copyright: COPYRIGHT },
            output: FILE_PATH,
            type: "jpeg",
            quality: 100
        });
    } catch (error) {
        console.error(`[${new Date().toLocaleString()}] ❌ Error occurred: ${error}`);
    }
}


export async function imageToDataURI(input) {
    try {
        let data;
        if (typeof input === 'string') {
            if (fs.existsSync(input)) {
                data = fs.readFileSync(input);
            } else {
                const response = await fetch(input);
                if (response.ok) {
                    const buffer = await response.arrayBuffer();
                    data = Buffer.from(buffer);
                } else {
                    throw new Error(`Failed to fetch image: ${response.statusText}`);
                }
            }
        } else if (Buffer.isBuffer(input)) {
            data = input;
        } else {
            throw new Error('Invalid input type. Input must be a file path, URL, or Buffer.');
        }

        const base64Image = data.toString('base64');
        const dataURI = `data:image/jpeg;base64,${base64Image}`;
        return dataURI;
    } catch (error) {
        throw new Error(`Error converting image to data URI: ${error.message}`);
    }
}
