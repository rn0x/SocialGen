import fetch from 'node-fetch';
import fs from 'node:fs';

const getVoiceId = async () => {
    try {
        const response = await fetch('https://api.elevenlabs.io/v1/voices', {
            method: 'GET',
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY, 
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        // اختر معرف الصوت الذي تريده، يمكنك تعديل الاختيار حسب الحاجة
        return data?.voices
    } catch (error) {
        throw new Error(`Failed to get voice ID: ${error.message}`);
    }
};


export default async function textToSpeech(text, output) {
    try {
        const voiceId = "pNInz6obpgDQGcFmaJgB" //await getVoiceId(); // استدعاء الدالة للحصول على معرف الصوت
        const options = {
            method: 'POST',
            headers: {
                'accept': 'audio/mpeg',
                'xi-api-key': process.env.ELEVENLABS_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text,
                model_id: "eleven_multilingual_v2",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                    use_speaker_boost: true
                }
            })
        };

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, options);
        
        if (!response.ok) {
            return {
                error: await response.json()
            }
        }
        const writer = fs.createWriteStream(output);
        response.body.pipe(writer);

        // إرجاع وعد بانتهاء عملية الحفظ بنجاح
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve(true));
            writer.on('error', reject);
        });
    } catch (error) {
        throw error;
    }
}