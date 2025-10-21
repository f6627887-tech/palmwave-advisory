
# Palm Wave Advisory — موقع وتجربة تفاعلية (واجهة + باك إند)

واجهة عربية (RTL) مع باك إند Express.js لتجربة أولية تجمع ملاحظات الزوار ومقترحات التطوير للوجهات الساحلية ضمن رؤية 2030.

## التشغيل محليًا
1) ثبّت Node.js (الإصدار 18 أو أحدث).
2) افتح المجلد في الطرفية:
```bash
cd palmwave-advisory
npm install
npm start
```
3) زر الموقع على: http://localhost:3000

## البنية
- `public/` واجهة المستخدم (HTML/CSS/JS) — ألوان سماوية متوافقة مع الشعار.
- `server.js` خادم Express مع واجهات REST مبسطة:
  - `GET /api/summary`
  - `GET/POST /api/feedback`
  - `GET/POST /api/proposals`
- `data/*.json` تخزين ملفات JSON محليًا (للاستعراض). استبدل لاحقًا بقاعدة بيانات (PostgreSQL/MySQL).

## تخصيص سريع
- الشعار: `public/assets/logo.png` (مأخوذ من صورتك المرفقة).
- الألوان والخطوط: `public/styles.css`.
- أقسام ومحتوى عربي بالكامل في `public/index.html`.

## نشر سريع
- Render أو Railway أو Fly.io: أنشئ خدمة Node وأشر إلى `npm start`.
- GitHub Pages للواجهة فقط: ارفع مجلد `public/` واستضف API في Render.

> هذا نموذج جاهز للتوسّع (Role-Based Access, مصادقة، خرائط، رفع ملفات، لوحات تفصيلية).
