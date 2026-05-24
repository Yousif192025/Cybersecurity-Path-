/**
 * نظام القيادة والربط المباشر المطور للوحة الأدمن العليا - منصة CyberPath
 */

(function () {
    // التقاط الكلاينت الموحد والمشترك من النطاق العام لمنع التكرار والتنبيهات
    let supabase = window.supabaseClient || window.supabase;
    
    // خطة الطوارئ البديلة فقط إذا لم يُعثر عليه نهائياً (لمنع انهيار اللوحة)
    if (!supabase || typeof supabase.from !== 'function') {
        try {
            if (window.supabase && typeof window.supabase.createClient === 'function') {
                supabase = window.supabase.createClient(
                    'https://suvpaunulhqfoclepwoz.supabase.co',
                    'sb_publishable_owtViRnQVEiBN3J3yQtpbw_cq-vwR7b'
                );
            }
        } catch (e) {
            console.error("🚨 خطأ في الاتصال الاحتياطي:", e);
        }
    }
    
    // الدالة الرئيسية المستدعاة تلقائياً فور حقن اللوحة في الموجه الديناميكي
    window.initAdminDashboard = async function () {
        console.log("⚡ تم تفعيل ممرات لوحة الأدمن العليا الحية حباً وكرامة.");
        
        // إعادة التحقق من الكائن العام الموحد لضمان قراءة الجلسة الصحيحة
        if (window.supabaseClient) {
            supabase = window.supabaseClient;
        }

        // ميزة التحديث العام
        window.refreshAllAdminData = async function() {
            try {
                await Promise.all([
                    loadAdminStats(),
                    loadAdminCourses(),
                    loadAdminVideos(),
                    loadAdminEnrollments(),
                    loadAdminCertificates(),
                    loadAdminRatings(),
                    loadAdminUsers()
                ]);
                console.log("✅ تمت مزامنة قاعدة البيانات وتحديث السجلات بنجاح تام.");
            } catch (err) {
                console.error("🚨 خطأ أثناء جلب تحديثات الأدمن الحية:", err);
            }
        };

        // إجراء الاستدعاء الأولي الفوري للبيانات حياً
        window.refreshAllAdminData();
    };

    // ==========================================
    // 📊 1. جلب الإحصائيات الست الحية (Stats Engine)
    // ==========================================
    async function loadAdminStats() {
        if (!supabase || typeof supabase.from !== 'function') return;
        
        const { count: users } = await supabase.from('user_profile').select('*', { count: 'exact', head: true });
        const { count: courses } = await supabase.from('courses').select('*', { count: 'exact', head: true });
        const { count: videos } = await supabase.from('course_videos').select('*', { count: 'exact', head: true });
        const { count: enrollments } = await supabase.from('enrollments').select('*', { count: 'exact', head: true });
        const { count: certificates } = await supabase.from('certificates').select('*', { count: 'exact', head: true });
        const { count: ratings } = await supabase.from('instructor_ratings').select('*', { count: 'exact', head: true });

        if(document.getElementById('statUsers')) document.getElementById('statUsers').innerText = users ?? 0;
        if(document.getElementById('statCourses')) document.getElementById('statCourses').innerText = courses ?? 0;
        if(document.getElementById('statVideos')) document.getElementById('statVideos').innerText = videos ?? 0;
        if(document.getElementById('statEnrollments')) document.getElementById('statEnrollments').innerText = enrollments ?? 0;
        if(document.getElementById('statCertificates')) document.getElementById('statCertificates').innerText = certificates ?? 0;
        if(document.getElementById('statRatings')) document.getElementById('statRatings').innerText = ratings ?? 0;
    }

    // [باقي الدوال كما هي تماماً دون أي تغيير من كود الدفعة السابقة...]
    // ==========================================
    // 📚 2. إدارة الحقائب والمساقات (Courses Management)
    // ==========================================
    async function loadAdminCourses() {
        const { data, error } = await supabase.from('courses').select('*');
        const tbody = document.getElementById('coursesTable');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (error || !data?.length) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:var(--text-muted);">لا توجد مساقات تدريبية مدرجة حالياً.</td></tr>';
            return;
        }

        data.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${c.title}</strong></td>
                <td><small style="color:var(--text-muted);">${c.description || 'لا يوجد وصف متاح'}</small></td>
                <td><button class="btn-link btn-danger" style="margin:0; padding:6px 12px; font-size:12px;" onclick="window.deleteAdminCourse('${c.course_id}')"><i class="fas fa-trash-alt"></i> شطب المساق</button></td>
            `;
            tbody.appendChild(tr);
        });

        // تعبئة قائمة اختيار المساقات الفرعية لربط المحاضرات المرئية بذكاء
        const select = document.getElementById('videoCourseSelect');
        if (select) {
            select.innerHTML = '<option value="">-- اختر المساق الحاضن --</option>' +
                data.map(c => `<option value="${c.course_id}">${c.title}</option>`).join('');
        }
    }

    window.addAdminCourse = async function () {
        const titleInput = document.getElementById('courseTitle');
        const descInput = document.getElementById('courseDesc');
        const title = titleInput.value.trim();
        const desc = descInput.value.trim();

        if (!title) return alert('خطأ: يرجى كتابة عنوان المساق أولاً لتمكين البناء التعليمي!');

        // جلب معرف الأدمن الحالي لربطه كمالك ومشرف للمساق
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return alert('تعذر التحقق من الهوية الإدارية الموثقة.');

        const { error } = await supabase.from('courses').insert({ title, description: desc, instructor_id: user.id });
        if (error) {
            alert('فشل الإدراج: ' + error.message);
        } else {
            titleInput.value = '';
            descInput.value = '';
            window.refreshAllAdminData();
        }
    };

    window.deleteAdminCourse = async function (id) {
        if (!confirm('🚨 تحذير أمني عالي الخطورة:\nهل أنت متأكد تماماً من شطب هذا المساق نهائياً؟ سيؤدي هذا الإجراء لحذف كافة الفيديوهات والتسجيلات المرتبطة به فوراً!')) return;
        await supabase.from('courses').delete().eq('course_id', id);
        window.refreshAllAdminData();
    };

    // ==========================================
    // 🎬 3. إدارة بنك المحاضرات (Videos Management)
    // ==========================================
    async function loadAdminVideos() {
        const { data, error } = await supabase.from('course_videos').select('*, courses(title)');
        const tbody = document.getElementById('videosTable');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (error || !data?.length) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">لا توجد محاضرات أو مقاطع عمل مرصودة.</td></tr>';
            return;
        }

        data.forEach(v => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${v.video_title}</td>
                <td><span class="badge" style="background:var(--bg-dark); color:var(--primary); padding:4px 8px; border-radius:6px;">${v.courses?.title || 'غير محدد'}</span></td>
                <td><a href="${v.video_url}" target="_blank" style="color:var(--primary); text-decoration:none;"><i class="fas fa-external-link-alt"></i> فتح الممر 🔗</a></td>
                <td><button class="btn-link btn-danger" style="margin:0; padding:6px 12px; font-size:12px;" onclick="window.deleteAdminVideo('${v.video_id}')"><i class="fas fa-video-slash"></i> إزالة</button></td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.addAdminVideo = function () {
        const courseSelect = document.getElementById('videoCourseSelect');
        const titleInput = document.getElementById('videoTitle');
        const urlInput = document.getElementById('videoUrl');

        const courseId = courseSelect ? courseSelect.value : '';
        const title = titleInput ? titleInput.value.trim() : '';
        const url = urlInput ? urlInput.value.trim() : '';

        if (!courseId || !title || !url) return alert('تنبيه: يرجى استكمال كافة الحقول (المساق، العنوان، والرابط المباشر) بنجاح!');

        supabase.from('course_videos').insert({ course_id: courseId, video_title: title, video_url: url })
            .then(({ error }) => {
                if (error) {
                    alert(error.message);
                } else {
                    if (titleInput) titleInput.value = '';
                    if (urlInput) urlInput.value = '';
                    window.refreshAllAdminData();
                }
            });
    };

    window.deleteAdminVideo = async function (id) {
        if (!confirm('هل تود إزالة ارتباط هذا المقطع المرئي من المساق الحالي؟')) return;
        await supabase.from('course_videos').delete().eq('video_id', id);
        window.refreshAllAdminData();
    };

    // ==========================================
    // 📝 4. حركة التسجيلات (Enrollments Cluster)
    // ==========================================
    async function loadAdminEnrollments() {
        const { data, error } = await supabase.from('enrollments').select('*, courses(title)');
        const tbody = document.getElementById('enrollmentsTable');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (error || !data?.length) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">لا توجد حركات تسجيل نشطة حالياً.</td></tr>';
            return;
        }

        data.forEach(e => {
            const shortId = e.user_id ? `${e.user_id.substring(0, 8)}…` : 'N/A';
            let badgeStyle = "background: rgba(234, 179, 8, 0.1); color: #eab308;";
            let statusText = "قيد الدراسة";

            if (e.completion_status === 'completed') {
                badgeStyle = "background: rgba(34, 197, 94, 0.1); color: var(--success);";
                statusText = "مكتمل وناجح";
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><code style="font-size:11px;">${shortId}</code></td>
                <td>${e.courses?.title || 'غير معروف'}</td>
                <td><span style="padding:4px 8px; border-radius:20px; font-size:11px; ${badgeStyle}">${statusText}</span></td>
                <td><button class="btn-link btn-danger" style="margin:0; padding:4px 8px; font-size:11px;" onclick="window.deleteAdminEnrollment('${e.enrollment_id}')"><i class="fas fa-user-minus"></i> إلغاء</button></td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.deleteAdminEnrollment = async function (id) {
        if (!confirm('هل تود شطب تسجيل هذا الطالب وإلغاء إدراجه من هذا المساق التدريبي؟')) return;
        await supabase.from('enrollments').delete().eq('enrollment_id', id);
        window.refreshAllAdminData();
    };

    // ==========================================
    // 🏆 5. سجل الشهادات المصدرة (Certificates Log)
    // ==========================================
    async function loadAdminCertificates() {
        const { data, error } = await supabase.from('certificates').select('*, courses(title)');
        const tbody = document.getElementById('certificatesTable');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (error || !data?.length) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">لم يتم إصدار أي شهادات تخرج رقمية بعد.</td></tr>';
            return;
        }

        data.forEach(cert => {
            const shortId = cert.user_id ? `${cert.user_id.substring(0, 8)}…` : 'N/A';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><code style="font-size:11px;">${shortId}</code></td>
                <td>${cert.courses?.title || 'غير معروف'}</td>
                <td><a href="${cert.certificate_url || '#'}" target="_blank" style="color:var(--success); text-decoration:none;"><i class="fas fa-file-pdf"></i> استعراض الـ PDF</a></td>
                <td><button class="btn-link btn-danger" style="margin:0; padding:4px 8px; font-size:11px;" onclick="window.revokeAdminCertificate('${cert.certificate_id}')"><i class="fas fa-ban"></i> إبطال السند</button></td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.revokeAdminCertificate = async function (id) {
        if (!confirm('🚨 إلغاء سند تخرج أكاديمي:\nهل تود سحب وإبطال مفعول هذه الشهادة الرقمية بشكل دائم؟')) return;
        await supabase.from('certificates').delete().eq('certificate_id', id);
        window.refreshAllAdminData();
    };

    // ==========================================
    // ⭐ 6. مراجعة جودة المعلمين (Ratings Engine)
    // ==========================================
    async function loadAdminRatings() {
        const { data, error } = await supabase.from('instructor_ratings').select('*');
        const tbody = document.getElementById('ratingsTable');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (error || !data?.length) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">لا توجد مراجعات جودة أو تقييمات مسجلة حالياً.</td></tr>';
            return;
        }

        data.forEach(r => {
            const teacherId = r.instructor_id ? `${r.instructor_id.substring(0, 8)}…` : 'N/A';
            const studentId = r.user_id ? `${r.user_id.substring(0, 8)}…` : 'N/A';
            const stars = '⭐'.repeat(r.rating ?? 0);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><code>${teacherId}</code></td>
                <td><code>${studentId}</code></td>
                <td style="color:#eab308;">${stars} (${r.rating}/5)</td>
                <td><button class="btn-link btn-danger" style="margin:0; padding:4px 8px; font-size:11px;" onclick="window.deleteAdminRating('${r.rating_id}')"><i class="fas fa-eraser"></i> شطب</button></td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.deleteAdminRating = async function (id) {
        if (!confirm('هل تود حذف هذا التقييم والمراجعة من سجل جودة التعليم العام؟')) return;
        await supabase.from('instructor_ratings').delete().eq('rating_id', id);
        window.refreshAllAdminData();
    };

    // ==========================================
    // 👥 7. مصفوفة الرتب وصلاحيات التمكين (Users Cluster)
    // ==========================================
    async function loadAdminUsers() {
        const { data, error } = await supabase.from('user_profile').select('*');
        const tbody = document.getElementById('usersTable');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (error || !data?.length) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">تعذر استدعاء مصفوفة الصلاحيات العليا الحية.</td></tr>';
            return;
        }

        data.forEach(u => {
            const tr = document.createElement('tr');
            // ترجمة الأدوار للعربية للعرض الاحترافي المنسق
            let roleLabel = "طالب مستقل";
            if(u.role === 'instructor') roleLabel = "مشرف أكاديمي / معلم";
            if(u.role === 'admin') roleLabel = "مدير نظام أعلى";

            tr.innerHTML = `
                <td><code style="font-size:12px; color:var(--primary);">${u.user_id || 'N/A'}</code></td>
                <td><span style="font-weight:500;">${roleLabel}</span></td>
                <td>
                    <select onchange="window.updateAdminUserRole('${u.user_id}', this.value)" style="padding:6px 10px; background:var(--bg-dark); border:1px solid var(--border); border-radius:6px; color:white; font-size:12px; cursor:pointer;">
                        <option value="">— اختر رتبة الترقية —</option>
                        <option value="student" ${u.role === 'student' ? 'selected' : ''}>طالب (Student)</option>
                        <option value="instructor" ${u.role === 'instructor' ? 'selected' : ''}>مشرف/معلم (Instructor)</option>
                        <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>مدير نظام أعلى (Admin)</option>
                    </select>
                </td>
                <td>
                    <button class="btn-link btn-danger" style="margin:0; padding:6px 12px; font-size:12px;" onclick="window.deleteAdminUserProfile('${u.user_id}')">
                        <i class="fas fa-user-times"></i> حذف الملف الشخصي
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.updateAdminUserRole = async function (uid, newRole) {
        if (!newRole) return;
        if (!confirm(`⚠️ ترفيع وتعديل أمني للرتب:\nهل تود تأكيد تغيير الدور الأمني للمستخدم إلى رتبة [${newRole}] حياً؟`)) {
            window.refreshAllAdminData();
            return;
        }
        
        const { error } = await supabase.from('user_profile').update({ role: newRole }).eq('user_id', uid);
        if (error) {
            alert('فشل تحديث الرتبة الأمنية: ' + error.message);
        }
        window.refreshAllAdminData();
    };

    window.deleteAdminUserProfile = async function (id) {
        if (!confirm('🛑 قرار إداري صارم:\nهل تود حذف سجل هذا المستخدم نهائياً من مصفوفة `user_profile`؟\n(ملاحظة: هذا الإجراء يحذف خصائصه الأكاديمية فقط، ويبقى حساب الدخول Auth محفوظاً ما لم يُحذف من الكونسول الرئيسي)')) return;
        await supabase.from('user_profile').delete().eq('user_id', id);
        window.refreshAllAdminData();
    };

})();
