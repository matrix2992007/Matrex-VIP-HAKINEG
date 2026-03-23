// --- MATRIX CORE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyAkz8kGNDOJ5caCIbdoXpvJBZgUbigjT5g",
  authDomain: "matrix-c2.firebaseapp.com",
  databaseURL: "https://matrix-c2-default-rtdb.firebaseio.com/",
  projectId: "matrix-c2",
  storageBucket: "matrix-c2.firebasestorage.app",
  messagingSenderId: "778033605872",
  appId: "1:778033605872:web:a27df427bcf066adf42635",
  measurementId: "G-F6YTKQ0FBZ"
};

// تهيئة Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// دالة مزامنة بيانات المستخدم مع السيرفر
function syncUser() {
    const myID = localStorage.getItem('m_id_user') || 'M-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    localStorage.setItem('m_id_user', myID);

    const userRef = db.ref('users/' + myID);

    userRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // تحديث البيانات من السيرفر للمتصفح
            localStorage.setItem('m_credits', data.credits || 0);
            localStorage.setItem('m_vip', data.isVip || false);
            if (typeof refreshUI === 'function') refreshUI();
        } else {
            // مستخدم جديد: سجل بياناته لأول مرة في Firebase
            userRef.set({
                id: myID,
                credits: 3,
                isVip: false,
                joinDate: new Date().toLocaleString()
            });
        }
    });
}

// دالة شحن النقاط (للأدمن فقط)
function adminAddCredits(targetId, pts) {
    if (!targetId || !pts) return Swal.fire('خطأ', 'أدخل ID المستخدم وعدد النقاط', 'error');
    
    db.ref('users/' + targetId + '/credits').transaction((current) => {
        return (current || 0) + parseInt(pts);
    }, (error) => {
        if (!error) {
            Swal.fire('تم الشحن ✅', `تم إضافة ${pts} نقطة للحساب ${targetId}`, 'success');
        } else {
            Swal.fire('فشل', 'تأكد من الـ ID أو اتصال الإنترنت', 'error');
        }
    });
}

// تشغيل المزامنة فوراً
syncUser();
