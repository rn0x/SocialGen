export default function generateRandomName(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomFileName = '';
    for (let i = 0; i < length; i++) {
        randomFileName += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomFileName;
}
