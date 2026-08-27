let currentExamResultsCache = [];

async function load_exam_results(exam_number) {
    if (!exam_number) return;
    window.currentExamNumberForResults = exam_number;

    $('#showresult').html('<tr><td colspan="5"><img id="img_load_result" src="img/load.gif" /></td></tr>');
    
    let { data, error } = await window._supabase
        .from('results')
        .select('*')
        .eq('exam_number', exam_number)
        .order('submitted_at', { ascending: false });

    if (error) {
        alert('خطأ في جلب النتائج: ' + error.message);
        $('#showresult').html('<tr><td colspan="5">حدث خطأ في جلب النتائج</td></tr>');
        return;
    }

    currentExamResultsCache = data || [];
    renderResultsTable(currentExamResultsCache);
}

function renderResultsTable(resultsArray) {
    if (!resultsArray || resultsArray.length === 0) {
        $('#showresult').html('<tr><td colspan="5">لا توجد نتائج مسجلة حتى الآن</td></tr>');
        return;
    }

    var html = '';
    resultsArray.forEach((res, index) => {
        let dateStr = res.submitted_at ? new Date(res.submitted_at).toLocaleString('ar-SA') : 'وقت غير متوفر';
        html += `<tr>
            <td>${index + 1}</td>
            <td><b>${res.student_name}</b></td>
            <td>${res.student_info || '-'}</td>
            <td><span style="font-size:12px; color:#64748b;">${dateStr}</span></td>
            <td><b style="color:#0284c7; font-size:1.1em;">${res.degree}</b></td>
        </tr>`;
    });

    $('#showresult').html(html);
}

function sortResultsByCriteria(criteria) {
    if (!currentExamResultsCache || currentExamResultsCache.length === 0) return;

    let sorted = [...currentExamResultsCache];

    if (criteria === 'date') {
        sorted.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
    } else if (criteria === 'degree_desc') {
        sorted.sort((a, b) => Number(b.degree) - Number(a.degree));
    } else if (criteria === 'degree_asc') {
        sorted.sort((a, b) => Number(a.degree) - Number(b.degree));
    } else if (criteria === 'name') {
        sorted.sort((a, b) => a.student_name.localeCompare(b.student_name, 'ar'));
    }

    renderResultsTable(sorted);
}

async function delete_result() {
    var exam_number = window.currentExamNumberForResults;
    if (!exam_number) {
        alert('رقم الاختبار غير محدد');
        return;
    }

    if (!confirm('هل أنت متأكد من حذف جميع نتائج هذا الاختبار نهائياً؟')) {
        return;
    }

    $('#load').show();
    let { error } = await window._supabase
        .from('results')
        .delete()
        .eq('exam_number', exam_number);

    $('#load').hide();

    if (error) {
        alert('خطأ أثناء حذف النتائج: ' + error.message);
    } else {
        alert('تم حذف النتائج بنجاح');
        load_exam_results(exam_number);
    }
}

function save_excel() {
    alert('تم تجهيز البيانات، سيتم تصدير ملف النتائج بصيغة Excel قريباً.');
}
