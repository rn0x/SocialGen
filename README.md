# مولد محتوى سوشل 

مولد محتوى يتيح لك إنشاء مقاطع فيديو مبتكرة وجذابة لوسائل التواصل الاجتماعي بسهولة

## التثبيت

1. تأكد من تثبيت Node.js و npm عن طريق زيارة موقع Node.js على الويب: [https://nodejs.org/](https://nodejs.org/) واتباع الإرشادات هناك.
2. قم بتثبيت Chromium عن طريق اتباع الإرشادات الموجودة على موقع Chromium: [https://www.chromium.org/getting-involved/download-chromium](https://www.chromium.org/getting-involved/download-chromium).
3. قم بتثبيت FFmpeg عن طريق اتباع الإرشادات الموجودة على موقع FFmpeg: [https://ffmpeg.org/](https://ffmpeg.org/).
4. قم بتنزيل المشروع إلى جهاز الكمبيوتر الخاص بك. `git clone https://github.com/rn0x/SocialGen`
5. افتح مجلد المشروع. `cd SocialGen`
6. قم بتثبيت جميع التبعيات باستخدام الأمر `npm install`.
6. قم بتحرير ملف `.env.example` وتعيين المتغيرات ثم اعادة تعين اسم الملف الى `.env`
7. شغل التطبيق باستخدام الأمر `npm start`.


## Docker

```bash

#build
docker build -t socialgen:1.0 .
#run 
docker run -p 8080:3715 socialgen:1.0
# يمكن الوصول عبر http://localhost:8080
```

## استخدام التطبيق

1. قم بالوصول إلى التطبيق عبر `http://localhost:3715`.
2. يمكنك استخدام واجهة برمجة التطبيق (API) لانشاء صور وصوتيات وفيديو 

### طلب `generate-text`:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"content": "This is a sample description."}' http://localhost:3715/generate-text
```

### طلب `generate-image`:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"content": "This is a sample description text.", "imageSource": "https://example.com/image.jpg", "logoSource": "https://example.com/logo.png", "copyright": "Copyright info"}' http://localhost:3715/generate-image
```

### طلب `generate-audio`:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"content": "This is a sample description text."}' http://localhost:3715/generate-audio
```

### طلب `generate-video`:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"image": "https://example.com/image.jpg", "audio": "https://example.com/audio.mp3"}' http://localhost:3715/generate-video
```

يرجى استبدال روابط الملفات المؤقتة مع روابط واقعية للصور والصوت التي ترغب في استخدامها في التطبيق.


امثلة للفيديوهات 

![video-1](./example/Amarok_____Open_Source_Music_Player_Officially_Released__Here_______s_What_______s_New.mp4)
![video-2](./example/Amarok_____Released__Ported_to_Qt__KDE_Frameworks__.mp4)
![video-3](./example/Extend_Ubuntu_LTS_Updates_for____Years_with_Free_Ubuntu_Pro.mp4)
![video-4](./example/Handling__Cannot_refresh_snap_store__Error_in_Ubuntu______.mp4)
![video-5](./example/How_to_Install_PHP_____in_RHEL__.mp4)
![video-6](./example/Linux_Mint____Will_Include_Preinstalled_App_for_Matrix.mp4)
![video-7](./example/Meet_DuckDuckGo_Privacy_Pro__a___in___subscription_service_with_VPN__Personal_Information_Removal__and_Identity_Theft_Restoration.mp4)
![video-8](./example/The_biggest_use_cases_for_AI_in_Automotive__that_aren_______t_just_self_driving_cars_.mp4)

## الاعتمادات

- [Express.js](https://expressjs.com/) - إطار العمل لتطبيقات الويب بناءً على Node.js.
- [fs-extra](https://www.npmjs.com/package/fs-extra) - واجهة برمجة تطبيقات (API) لملفات النظام.
- [body-parser](https://www.npmjs.com/package/body-parser) - Middleware للتعامل مع بيانات طلب HTTP في Express.js.
- وغيرها من الحزم والمكتبات المستخدمة، يرجى الرجوع إلى ملف package.json لمزيد من المعلومات.