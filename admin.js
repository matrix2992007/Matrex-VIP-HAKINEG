// --- MATRIX PHANTOM V3 - ADMIN CONTROLLER ---

// 1. إعدادات SMM Sharks (رابط الـ API اللي بعته)
const SMM_API_URL = "https://smmsharks.com/api/v2";
const SMM_API_KEY = "YOUR_API_KEY_HERE"; // حط مفتاح الـ API بتاعك هنا يا يوسف

// 2. وظيفة جلب البيانات عند فتح اللوحة الشبح
function loadAdminData() {
    console.log("Admin Dashboard Active...");
    
    // جلب إحصائيات من Firebase
    db.ref('hosted_bots').on('value', snap => {
        const botCount = snap.numChildren() || 0;
        document.getElementById('admin-logs').innerHTML = `📡 البوتات المستضافة حالياً: ${botCount}`;
    });
}

// 3. نظام الردود الآلية (سؤال وجواب)
function saveAutoReply() {
    const question = document.getElementById('reply-q').value;
    const answer = document.getElementById('reply-a').value;

    if (!question || !answer) return Swal.fire('خطأ', 'دخل السؤال والجواب', 'error');

    db.ref('auto_replies').push({
        q: question,
        a: answer,
        timestamp: Date.now()
    }).then(() => {
        Swal.fire('تم الحفظ 🤖', 'البوت سيرد آلياً على هذه الكلمة الآن', 'success');
        document.getElementById('reply-q').value = '';
        document.getElementById('reply-a').value = '';
    });
}

// 4. تنفيذ طلب تزويد المتابعين (SMM Order)
async function orderBoost() {
    const link = document.getElementById('smm-link').value;
    const count = document.getElementById('smm-count').value;
    const serviceId = document.getElementById('smm-category').value; // يحتاج لربط الـ ID من السيرفر

    if (!link || !count) return Swal.fire('بيانات ناقصة', 'حدد الرابط والعدد', 'warning');

    Swal.fire({
        title: 'جاري معالجة الطلب...',
        didOpen: () => { Swal.showLoading(); }
    });

    // إرسال الطلب لسيرفر Smm Sharks (منطق بروتوكول POST)
    // ملاحظة: الـ CORS قد يمنع الإرسال المباشر من المتصفح، يفضل عبر بروكسي أو سيرفر
    try {
        const response = await fetch(SMM_API_URL, {
            method: 'POST',
            body: new URLSearchParams({
                key: SMM_API_KEY,
                action: 'add',
                service: '1', // مثال: ID خدمة المتابعين
                link: link,
                quantity: count
            })
        });
        const data = await response.json();
        if (data.order) {
            Swal.fire('تم الطلب! ✅', `رقم الطلب: ${data.order}`, 'success');
        } else {
            Swal.fire('فشل الطلب', data.error || 'تأكد من الرصيد والـ API Key', 'error');
        }
    } catch (err) {
        Swal.fire('خطأ في الاتصال', 'تأكد من إعدادات الـ API', 'error');
    }
}

// 5. محرك الإرسال الجماعي (Global Broadcast)
function sendGlobalBroadcast() {
    const msg = document.getElementById('bc-msg').value;
    if (!msg) return;

    Swal.fire('بدء الهجوم 🚀', 'جاري الإرسال لجميع الضحايا والمستخدمين...', 'info');
    
    // سحب كل المستخدمين من قاعدة البيانات وإرسال الرسالة لبوتاتهم
    db.ref('users').once('value', snap => {
        const users = snap.val();
        for (let userId in users) {
            // منطق إرسال رسالة تليجرام (Telegram Bot API)
            console.log("Sending to: " + userId);
        }
        Swal.fire('تم البث بنجاح 🎉', '', 'success');
    });
}

// 6. بوابة الشحن (Phantom Bank)
function openPaymentGateway() {
    Swal.fire({
        title: 'شحن رصيد الماتريكس',
        html: `
            <div style="text-align:right; direction:rtl;">
                <p>حول المبلغ المطلوب لرقم فودافون كاش:</p>
                <b style="color:#00ff41; font-size:20px;">01224815487</b>
                <hr style="border:0.5px solid #222;">
                <p>بعد التحويل، ابعت سكرين شوت هنا:</p>
                <a href="https://wa.me/201224815487" style="color:#25D366">تواصل مع الدعم الفني (WhatsApp)</a>
            </div>
        `,
        confirmButtonText: 'إغلاق',
        background: '#000',
        color: '#fff'
    });
}
