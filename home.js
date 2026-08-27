function readAll_ans_saveded() {
    readAll_ans_saveded_new();
}

async function readAll_exam_saveded_new(action) {
    var teacher_email = localStorage.getItem('loginEmail');

    if (!teacher_email) {
        $('#exam_saved_te #exam_saved_forAdd').html('<tr><td colspan="3">الرجاء تسجيل الدخول لعرض اختباراتك المنشورة</td></tr>');
        return;
    }

    let { data, error } = await window._supabase
        .from('exams')
        .select('*')
        .eq('teacher_email', teacher_email)
        .order('id', { ascending: false });

    if (error) {
        console.error('Error fetching exams:', error.message);
        $('#exam_saved_te #exam_saved_forAdd').html('<tr><td colspan="3">خطأ في جلب الاختبارات من السحابة</td></tr>');
        return;
    }

    if (!data || data.length === 0) {
        $('#exam_saved_te #exam_saved_forAdd').html('<tr><td colspan="3">لم تقم بإنشاء أي اختبار حتى الآن</td></tr>');
        return;
    }

    var html = '';
    data.forEach(exam => {
        // أزرار أفقية متجاورة لكل اختبار (نتائج، تعديل، حذف)
        html += `<tr>
            <td style="font-weight:800;">${exam.exam_name}</td>
            <td><code style="background:#e2e8f0; padding:3px 8px; border-radius:4px; font-weight:bold;">${exam.exam_number}</code></td>
            <td>
                <div style="display:flex; gap:5px; justify-content:center; flex-wrap:wrap;">
                    <button class="desine-btn" style="padding:5px 10px; font-size:0.8rem; background:#10b981; margin:0;" onclick="viewExamResultsByNum(${exam.exam_number})" title="النتائج"><i class="fas fa-chart-bar"></i> النتائج</button>
                    <button class="desine-btn" style="padding:5px 10px; font-size:0.8rem; background:#0284c7; margin:0;" onclick="editThisExam(${exam.exam_number})" title="تعديل"><i class="fas fa-edit"></i> تعديل</button>
                    <button class="desine-btn" style="padding:5px 10px; font-size:0.8rem; background:#ef4444; margin:0;" onclick="deleteThisExamByNum(${exam.exam_number})" title="حذف"><i class="fas fa-trash"></i> حذف</button>
                </div>
            </td>
        </tr>`;
    });

    $('#exam_saved_te #exam_saved_forAdd').html(html);
}

function viewExamResultsByNum(examNum) {
    window.currentExamNumberForResults = examNum;
    go_page('page_result');
    load_exam_results(examNum);
}

function editThisExam(examNum) {
    alert('خاصية التعديل السحابي مباشرة قيد التحديث، يمكنك إنشاء اختبار جديد برقم جديد.');
    go_page('page_newtest');
}

async function deleteThisExamByNum(examNum) {
    if (!confirm('هل أنت متأكد من حذف هذا الاختبار نهائياً من السحابة؟')) return;

    let { error } = await window._supabase
        .from('exams')
        .delete()
        .eq('exam_number', examNum);

    if (error) {
        alert('خطأ أثناء الحذف: ' + error.message);
    } else {
        alert('تم حذف الاختبار بنجاح');
        readAll_exam_saveded_new('update');
    }
}

function readAll_ans_saveded_new() {
    let savedExams = JSON.parse(localStorage.getItem('downloaded_exams') || '[]');
    if (savedExams.length === 0) {
        $('#exam_saved_st #ans_saved_forAdd').html('<tr><td colspan="3">لم تقم بحفظ أي اختبار للطالب محلياً حتى الآن</td></tr>');
        return;
    }

    var html = '';
    savedExams.forEach(exam => {
        // جلب آخر درجة مسجلة محلياً لهذا الاختبار إن وجدت
        let studentGrades = JSON.parse(localStorage.getItem('student_grades') || '{}');
        let myGrade = studentGrades[exam.exam_number] ? `<span style="background:#dcfce7; color:#166534; padding:3px 8px; border-radius:6px; font-weight:bold;">الدرجة: ${studentGrades[exam.exam_number]}</span>` : `<span style="color:#64748b; font-size:0.85rem;">لم تختبر بعد</span>`;

        html += `<tr>
            <td><b>${exam.exam_name}</b><br>${myGrade}</td>
            <td><code style="background:#e2e8f0; padding:3px 8px; border-radius:4px;">${exam.exam_number}</code></td>
            <td>
                <div style="display:flex; gap:5px; justify-content:center; flex-wrap:wrap;">
                    <button class="desine-btn" style="padding:6px 12px; font-size:0.85rem; background:#2563eb; margin:0;" onclick="startDownloadedExam(${exam.exam_number})">
                        <i class="fas fa-play"></i> بدء الحل
                    </button>
                    <button class="desine-btn" style="padding:6px 10px; font-size:0.85rem; background:#64748b; margin:0;" onclick="previewDownloadedExam(${exam.exam_number})" title="عرض تفاصيل الاختبار">
                        <i class="fas fa-eye"></i> عرض
                    </button>
                </div>
            </td>
        </tr>`;
    });

    $('#exam_saved_st #ans_saved_forAdd').html(html);
}

function previewDownloadedExam(exam_number) {
    let savedExams = JSON.parse(localStorage.getItem('downloaded_exams') || '[]');
    let exam = savedExams.find(e => e.exam_number == exam_number);
    if (!exam) return;

    let infoText = `اسم الاختبار: ${exam.exam_name}\nرقم الاختبار: ${exam.exam_number}\nالنبذة: ${exam.exam_info || 'لا توجد'}\nعدد الأسئلة: ${exam.exam_data?.questions?.length || 0}`;
    alert(infoText);
}

function startDownloadedExam(exam_number) {
    let savedExams = JSON.parse(localStorage.getItem('downloaded_exams') || '[]');
    let exam = savedExams.find(e => e.exam_number == exam_number);
    if (!exam) {
        alert('الاختبار غير موجود محلياً');
        return;
    }

    window.currentActiveExam = exam;
    $('#show_numExam').text(exam.exam_number);
    $('#show_nameExam').text(exam.exam_name);
    $('#show_nobzaExam').text(exam.exam_info || 'لا توجد نبذة وصفية');

    var qHtml = '';
    if (exam.exam_data && exam.exam_data.questions) {
        exam.exam_data.questions.forEach((q, qIndex) => {
            qHtml += `<div class="question_box" style="background:#fff; padding:20px; margin:15px auto; width:95%; border-radius:12px; border:1.5px solid #e2e8f0; text-align:right;">
                <p style="font-weight:800; color:#1e293b;">السؤال ${qIndex + 1}: ${q.question}</p>`;
            
            if (q.options && q.options.length > 0) {
                q.options.forEach((opt, oIndex) => {
                    if (opt) {
                        qHtml += `<label style="display:block; background:#f8fafc; padding:10px 14px; margin:8px 0; border-radius:8px; border:1.5px solid #cbd5e1; cursor:pointer; font-weight:750;">
                            <input type="radio" name="q_${qIndex}" value="${opt}" style="margin-left:10px;"> ${opt}
                        </label>`;
                    }
                });
            } else {
                qHtml += `<input type="text" class="inputMyApp inputAns" placeholder="اكتب إجابتك هنا" style="text-align:right;">`;
            }
            qHtml += `</div>`;
        });
    }

    $('#add_ask_here').html(qHtml);
    go_page('page_mytest');
}

$(document).ready(function() {
    readAll_ans_saveded_new();
    if (localStorage.getItem('loginState') === 'login=OK') {
        window.loginState = 'login=OK';
        window.loginEmail = localStorage.getItem('loginEmail');
        $('#loginEmail').text(window.loginEmail);
        readAll_exam_saveded_new();
    }
});
