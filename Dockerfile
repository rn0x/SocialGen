# استخدام صورة Debian الأساسية
FROM debian:latest

# تحديث الحزم
RUN apt-get update

# تثبيت Node.js و npm
RUN apt-get install -y nodejs npm

# تثبيت Chromium
RUN apt-get install -y chromium

# تثبيت FFmpeg و FFprobe
RUN apt-get install -y ffmpeg

# تثبيت Git
RUN apt-get install -y git

# حذف الحزم الزائدة وتنظيف الذاكرة المؤقتة
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# إنشاء مجلد في داخل الصورة ونقل المشروع من GitHub إليه
WORKDIR /usr/src/app
COPY . .
# RUN git clone رابط_مشروعك ./


# تثبيت التبعيات باستخدام npm
RUN npm install

# قراءة المتغيرات من ملف .env وتحويلها إلى أوامر ENV في Dockerfile
ARG ENV_FILE_PATH="./.env"
RUN cat $ENV_FILE_PATH | while read line; do export $line; done

# تشغيل التطبيق
CMD ["npm", "start"]
