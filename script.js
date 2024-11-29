document.addEventListener('DOMContentLoaded', function() {
    // 初期設定
    setDefaultMonth();
    setupAllSections();
    validateForm();
});

// 年月の初期設定
function setDefaultMonth() {
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth(); // 0-11
    
    if (month === 0) {
        year = year - 1;
        month = 12;
    }
    
    document.getElementById('reportMonth').value = `${year}-${month.toString().padStart(2, '0')}`;
}

// 全セクションの設定
function setupAllSections() {
    const sections = [
        {name: 'hasNewEmployee', containerId: 'newEmployeeContainer', detailId: 'newEmployeeDetail'},
        {name: 'hasRetirement', containerId: 'retirementContainer', detailId: 'retirementDetail'},
        {name: 'hasNoWork', containerId: 'noWorkContainer', detailId: 'noWorkDetail'},
        {name: 'hasSalaryChange', containerId: 'salaryChangeContainer', detailId: 'salaryChangeDetail'},
        {name: 'hasAddressChange', containerId: 'addressChangeContainer', detailId: 'addressChangeDetail'},
        {name: 'hasLateEarly', containerId: 'lateEarlyContainer', detailId: 'lateEarlyDetail'},
        {name: 'hasLeave', containerId: 'leaveContainer', detailId: 'leaveDetail'}
    ];

    sections.forEach(section => {
        setupRadioToggle(section.name, section.detailId);
    });
}

// ラジオボタンの切り替え制御
function setupRadioToggle(name, detailId) {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    const detailSection = document.getElementById(detailId);
    
    if (!radios || !detailSection) return;

    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            detailSection.style.display = this.value === 'yes' ? 'block' : 'none';
            if (this.value === 'yes') {
                const containerId = detailId.replace('Detail', 'Container');
                const container = document.getElementById(containerId);
                if (container && container.children.length === 0) {
                    addFirstEntry(containerId);
                }
            }
            validateForm();
        });
    });
}

// 最初のエントリー追加
function addFirstEntry(containerId) {
    switch(containerId) {
        case 'newEmployeeContainer':
            addNewEmployee();
            break;
        case 'retirementContainer':
            addRetirement();
            break;
        case 'noWorkContainer':
            addNoWork();
            break;
        case 'salaryChangeContainer':
            addSalaryChange();
            break;
        case 'addressChangeContainer':
            addAddressChange();
            break;
        case 'lateEarlyContainer':
            addLateEarly();
            break;
        case 'leaveContainer':
            addLeave();
            break;
    }
}

// フォームクリア
function clearForm() {
    if (!confirm('入力内容をクリアしてよろしいですか？')) return;

    // 基本フィールドのクリア
    document.getElementById('officeName').value = '';
    document.getElementById('otherComments').value = '';
    document.getElementById('csvFile').value = '';

    // 各セクションのクリア
    const sections = [
        'newEmployee',
        'retirement',
        'noWork',
        'salaryChange',
        'addressChange',
        'lateEarly',
        'leave'
    ];

    sections.forEach(section => {
        // ラジオボタンを「なし」に設定
        const radioNo = document.querySelector(`input[name="has${section}"][value="no"]`);
        if (radioNo) {
            radioNo.checked = true;
            // 詳細セクションを非表示に
            const detailSection = document.getElementById(`${section}Detail`);
            if (detailSection) {
                detailSection.style.display = 'none';
            }
            // コンテナの中身をクリア
            const container = document.getElementById(`${section}Container`);
            if (container) {
                container.innerHTML = '';
            }
        }
    });

    // 年月を再設定
    setDefaultMonth();
    
    validateForm();
}

// フォームの検証（基本部分のみ）
function validateForm() {
    let isValid = true;
    const requiredFields = ['officeName', 'reportMonth', 'csvFile'];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        let fieldValid = true;
        if (fieldId === 'csvFile') {
            fieldValid = field.files.length > 0;
        } else {
            fieldValid = field.value.trim() !== '';
        }
        
        if (!fieldValid) {
            field.classList.add('invalid');
            isValid = false;
        } else {
            field.classList.remove('invalid');
        }
    });

    document.getElementById('submitButton').disabled = !isValid;
    return isValid;
}
