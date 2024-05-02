import fs from 'fs-extra';
import { spawn, exec } from 'child_process';
import path from "node:path";

const root = path.resolve(process.cwd());
fs.ensureDirSync(path.join(root, "video"));

const ffprobePath = process.env.FFPROBE_PATH;
const ffmpegPath = process.env.FFMPEG_PATH;

export const getAudioDuration = async (audioPath) => {
    return new Promise((resolve, reject) => {
        const command = `${ffprobePath} -i ${audioPath} -show_entries format=duration -v quiet -of csv="p=0"`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`فشل الحصول على مدة الملف الصوتي: ${error.message}`);
                return;
            }
            if (stderr) {
                reject(`فشل الحصول على مدة الملف الصوتي: ${stderr}`);
                return;
            }
            resolve(stdout.trim());
        });
    });
};

export const imageToVideo = async (imagePath, audioPath, outputVideoPath) => {
    return new Promise(async (resolve, reject) => {
        try {
            // احصل على مدة الملف الصوتي
            const audioDuration = await getAudioDuration(audioPath);

            // استخدم ffmpeg لتحويل الصورة إلى فيديو وإضافة الصوت
            const command = `${ffmpegPath} -loop 1 -i "${imagePath}" -i "${audioPath}" -c:v libx264 -t "${audioDuration}" -pix_fmt yuv420p "${outputVideoPath}"`;
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`فشل تحويل الصورة إلى فيديو: ${error.message}`);
                    reject(error);
                }
                // console.log('تم تحويل الصورة إلى فيديو بنجاح.');
                resolve(true);
            });
        } catch (error) {
            console.error(`حدث خطأ أثناء تحويل الصورة إلى فيديو: ${error}`);
            reject(error);
        }
    });
};