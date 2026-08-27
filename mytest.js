async function check_ans_empty() {
    var std_name = $('#shows_name').val();

    if (!std_name) {
        alert('الرجاء إدخال اسم الطالب الثلاثي أو الرباعي');
        return;
    }

    $('#Takeed').addClass('Dnone');
    $('#Tasleem').removeClass('Dnone');
    alert('تم التحقق. اضغط على "تسليم الإجابات" لإرسال النتيجة نهائياً.');
}

async function get_ans_data() {
    var std_name = $('#shows_name').val();
    var std_info = $('#shows_info').val();

    if (!std_name) {
        alert('الرجاء إدخال اسم الطالب');
        return;
    }

    var answers = {};
    $('.question_box').each(function(index) {
        var selected_ans = $(this).find('input[type="radio"]:checked').val() || $(this).find('input[type="text"]').val() || '';
        answers['q_' + index] = selected_ans;
    });

    var exam_number = window.currentActiveExam ? window.currentActiveExam.exam_number : 0;

    $('#load').show();

    let pseudoStudentNumber = 'std_' + Math.floor(10000 + Math.random() * 90000);

    let { data, error } = await window._supabase.rpc('submit_exam_result', {
        p_exam_number: Number(exam_number),
        p_student_name: String(std_name),
        p_student_number: String(pseudoStudentNumber),
        p_student_info: String(std_info || ''),
        p_answers_data: answers,
    });

    $('#load').hide();

    if (error) {
        alert('خطأ في إرسال النتائج: ' + error.message);
        return;
    }

    if (data && data.status === 'duplicate') {
        alert('عذراً، نتيجتك لهذا الامتحان مسجّلة مسبقاً ولا يمكن تسليم الاختبار أكثر من مرة.');
        go_page('page_home');
        $('#Tasleem').addClass('Dnone');
        $('#Takeed').removeClass('Dnone');
        return;
    }

    let finalDegree = data?.degree ?? 0;
    let totalQuestionsCount = data?.total_questions ?? 0;
    let gradeText = `${finalDegree} / ${totalQuestionsCount}`;

    let studentGrades = JSON.parse(localStorage.getItem('student_grades') || '{}');
    studentGrades[exam_number] = gradeText;
    localStorage.setItem('student_grades', JSON.stringify(studentGrades));

    alert('تم تسليم الإجابات بنجاح!\nدرجتك النهائية هي: ' + gradeText);
    go_page('page_home');
    $('#Tasleem').addClass('Dnone');
    $('#Takeed').removeClass('Dnone');
    if (typeof readAll_ans_saveded_new === 'function') {
        readAll_ans_saveded_new();
    }
}
