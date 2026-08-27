async function login(email, password) {
    if (!email || !password) {
        alert('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
        return;
    }
    
    if (password.length < 4) {
        alert('كلمة المرور قصيرة جداً.');
        return;
    }

    $('#load_login').show();

    try {
        const cleanEmail = email.trim().toLowerCase();
        localStorage.setItem('loginState', 'login=OK');
        localStorage.setItem('loginEmail', cleanEmail);

        alert('تم تسجيل الدخول بنجاح!');
        finalizeLoginSuccess(cleanEmail);
    } catch (err) {
        alert('حدث خطأ أثناء تسجيل الدخول.');
    } finally {
        $('#load_login').hide();
    }
}

function finalizeLoginSuccess(email) {
    window.loginState = 'login=OK';
    window.loginEmail = email;
    $('.popup_login').fadeOut();
    $('#loginEmail').text(email);

    if (typeof readAll_exam_saveded_new === 'function') {
        readAll_exam_saveded_new();
    }
    go_page('prev_exam');
}

var questionCount = 0;

function add_ask() {
    questionCount++;
    var html = `<div class="question_box" data-id="${questionCount}" style="background:#fff; padding:20px; margin:15px auto; width:92%; border-radius:12px; border:1.5px solid var(--border-color); text-align:right;">
        <p style="font-weight:800; color:var(--text-main);">السؤال رقم ${questionCount}</p>
        <input type="text" class="inputMyApp inputAsk" placeholder="ادخل نص السؤال هنا" style="width:100%; margin-bottom:12px; text-align:right;"><br>
        <p style="font-size:0.9rem; color:var(--text-muted); margin:6px 0;">حدد دائر الخيار الصحيح واكتب الخيارات:</p>
        <div style="display:flex; align-items:center; margin-bottom:8px;">
            <input type="radio" name="correct_${questionCount}" value="0" checked style="margin-left:12px; width:18px; height:18px;" title="الإجابة الصحيحة">
            <input type="text" class="inputMyApp inputAns" placeholder="الخيار الأول (الصحيح افتراضياً)" style="width:100%; text-align:right;">
        </div>
        <div style="display:flex; align-items:center; margin-bottom:8px;">
            <input type="radio" name="correct_${questionCount}" value="1" style="margin-left:12px; width:18px; height:18px;" title="الإجابة الصحيحة">
            <input type="text" class="inputMyApp inputAns" placeholder="الخيار الثاني" style="width:100%; text-align:right;">
        </div>
        <div style="display:flex; align-items:center; margin-bottom:8px;">
            <input type="radio" name="correct_${questionCount}" value="2" style="margin-left:12px; width:18px; height:18px;" title="الإجابة الصحيحة">
            <input type="text" class="inputMyApp inputAns" placeholder="الخيار الثالث" style="width:100%; text-align:right;">
        </div>
        <div style="display:flex; align-items:center; margin-bottom:8px;">
            <input type="radio" name="correct_${questionCount}" value="3" style="margin-left:12px; width:18px; height:18px;" title="الإجابة الصحيحة">
            <input type="text" class="inputMyApp inputAns" placeholder="الخيار الرابع" style="width:100%; text-align:right;">
        </div>
    </div>`;
    $('#form_new_ask').append(html);
}

function delete_ask() {
    $('#form_new_ask .question_box').last().remove();
    if (questionCount > 0) questionCount--;
}

async function get_exam_data() {
    var t_name = $('#t_name').val();
    var t_info = $('#t_info').val();
    
    if (!t_name) {
        alert('الرجاء إدخال عنوان الاختبار');
        return;
    }

    var teacher_email = localStorage.getItem('loginEmail');
    if (!teacher_email) {
        alert('الرجاء تسجيل الدخول أولاً من الإعدادات');
        go_page('page_setting');
        return;
    }

    var exam_number = Math.floor(100000 + Math.random() * 900000);

    // تفعيل وتجميع خيارات الاختبار المتقدمة
    var settings = {
        pass_start_check: $('#Pass_start_ckeck').is(':checked'),
        t_pass_start: $('#t_pass_start').val(),
        time_test_check: $('#Time_test_ckeck').is(':checked'),
        time_test: $('#Time_test').val(),
        random_ask: $('#RandomAsk').is(':checked')
    };

    var questions = [];
    $('.question_box').each(function() {
        var q_text = $(this).find('.inputAsk').val();
        var options = [];
        $(this).find('.inputAns').each(function() {
            options.push($(this).val());
        });
        
        var correctIndex = $(this).find('input[type="radio"]:checked').val() || 0;
        var cIndex = parseInt(correctIndex);
        if (cIndex > 0 && options[cIndex]) {
            var temp = options[0];
            options[0] = options[cIndex];
            options[cIndex] = temp;
        }

        questions.push({
            question: q_text,
            options: options
        });
    });

    if (questions.length === 0) {
        alert('الرجاء إضافة سؤال واحد على الأقل للاختبار');
        return;
    }

    var examDataObject = {
        name: t_name,
        info: t_info,
        questions: questions
    };

    $('#load').show();

    let { data, error } = await window._supabase
        .from('exams')
        .insert([
            {
                exam_number: Number(exam_number),
                teacher_email: String(teacher_email),
                exam_name: String(t_name),
                exam_info: String(t_info || ''),
                exam_data: examDataObject,
                settings: settings
            }
        ]);

    $('#load').hide();

    if (error) {
        alert('خطأ أثناء حفظ الاختبار سحابياً: ' + error.message);
    } else {
        alert('تم إنشاء ونشر الاختبار بنجاح! رقم الاختبار هو: ' + exam_number);
        go_page('prev_exam');
        if (typeof readAll_exam_saveded_new === 'function') {
            readAll_exam_saveded_new('update');
        }
    }
}
