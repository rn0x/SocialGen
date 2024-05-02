export default function detectInputType(input) {
    if (typeof input === 'string') {
        // التحقق مما إذا كان النص يمثل عنوان URL
        if (/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(input)) {
            return 'url';
        }
        return 'text';
    } else if (Buffer.isBuffer(input)) {
        return 'buffer';
    } else if (input && input.type === 'Buffer' && Array.isArray(input.data)) {
        return 'buffer'; // تم التعرف على بيانات الصورة كمخزون
    } else {
        return 'unknown';
    }
}
