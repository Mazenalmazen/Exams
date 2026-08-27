var loginState = localStorage.getItem('loginState') || '';
var loginEmail = localStorage.getItem('loginEmail') || '';
var mode_te_st = localStorage.getItem('mode_te_st') || 'student';
var goToCreateExam = '';

function PassStart() {
    if ($('#Pass_start_ckeck').is(':checked')) {
        $('#input_Pass').show();
    } else {
        $('#input_Pass').hide();
    }
}

function TimeTest() {
    if ($('#Time_test_ckeck').is(':checked')) {
        $('#input_Time').show();
    } else {
        $('#input_Time').hide();
    }
}

function Bank_Test() {
    if ($('#Bank_test_ckeck').is(':checked')) {
        $('#input_Bank').show();
    } else {
        $('#input_Bank').hide();
    }
}

function RandomAskk() {
    // خيار ترتيب الأسئلة عشوائياً
}

function Wifitest() {}
function OUTtest() {}
function CAPtest() {}

function kind_download_direct() {}
function kind_download_indexedDB() {}

function close_Bar1() {}
function close_Bar2() {}

function show_AnserSS() {}
function allow_showw() {}

function direction_ask1() {
    $('.inputAsk, .inputAns').attr('dir', 'rtl');
}

function direction_ask2() {
    $('.inputAsk, .inputAns').attr('dir', 'ltr');
}

var questionCount = 0;

function add_ask() {
    questionCount++;
    var html = `<div class="question_box" data-id="${questionCount}" style="background:#fff; padding:15px; margin:15px auto; width:90%; border-radius:8px; border:1px solid #ccc;">
        <p><b>السؤال رقم ${questionCount}</b></p>
        <input type="text" class="inputMyApp inputAsk" placeholder="ادخل نص السؤال هنا" style="width:100%; margin-bottom:10px;"><br>
        <input type="text" class="inputMyApp inputAns" placeholder="الخيار الأول (الإجابة الصحيحة)" style="width:48%; display:inline-block; margin:5px;"><br>
        <input type="text" class="inputMyApp inputAns" placeholder="الخيار الثاني" style="width:48%; display:inline-block; margin:5px;"><br>
        <input type="text" class="inputMyApp inputAns" placeholder="الخيار الثالث" style="width:48%; display:inline-block; margin:5px;"><br>
        <input type="text" class="inputMyApp inputAns" placeholder="الخيار الرابع" style="width:48%; display:inline-block; margin:5px;">
    </div>`;
    $('#form_new_ask').append(html);
}

function delete_ask() {
    $('#form_new_ask .question_box').last().remove();
    if (questionCount > 0) questionCount--;
}

function info_how_add_ask() {
    alert('يمكنك إضافة الأسئلة مباشرة عبر التطبيق أو استخدام ملفات اكسل عبر موقع الويب.');
}

function info_bank() {
    alert('بنك الأسئلة يسمح بتوليد عدد عشوائي من الأسئلة للطلاب من إجمالي الأسئلة المتاحة.');
}

function info_Wifi_test() {
    alert('تنبيه: هذا الخيار يمنع الطالب من تصفح الإنترنت أثناء الاختبار.');
}

function info_direct_radio() {
    alert('التحميل والبدء مباشرة دون الحاجة للحفظ المؤقت.');
}

function info_radio_indexedDB() {
    alert('تحميل الاختبار وحفظه للبدء في وقت لاحق بدون انترنت.');
}

function info_barcode_radio() {
    alert('اعتماد الإجابات عبر مسح باركود النهاية.');
}

$(document).ready(function() {
    PassStart();
    TimeTest();
    Bank_Test();
    
    if (loginState === 'login=OK') {
        $('#loginEmail').text(loginEmail);
    }
});
