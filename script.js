document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing form...');
    
    const sections = [
        {radioName: 'hasNewEmployee', detailId: 'newEmployeeDetail', addFn: addNewEmployee},
        {radioName: 'hasRetirement', detailId: 'retirementDetail', addFn: addRetirement},
        {radioName: 'hasNoWork', detailId: 'noWorkDetail', addFn: addNoWork},
        {radioName: 'hasSalaryChange', detailId: 'salaryChangeDetail', addFn: addSalaryChange},
        {radioName: 'hasAddressChange', detailId: 'addressChangeDetail', addFn: addAddressChange},
        {radioName: 'hasLateEarly', detailId: 'lateEarlyDetail', addFn: addLateEarly},
        {radioName: 'hasLeave', detailId: 'leaveDetail', addFn: addLeave}
    ];

    sections.forEach(section => {
        console.log(`Setting up section: ${section.radioName}`);
        setupToggle(section.radioName, section.detailId, section.addFn);
    });

    // CSVファイル変更時のバリデーション追加
    document.getElementById('csvFile').addEventListener('change', validateForm);

    setDefaultMonth();
    validateForm();
});

function clearForm() {
    if (confirm('入力内容をクリアしてよろしいですか？')) {
        document.getElementById('officeName').value = '';
        document.getElementById('csvFile').value = '';
        setDefaultMonth();

        const sections = [
            'hasNewEmployee',
            'hasRetirement',
            'hasNoWork',
            'hasSalaryChange',
            'hasAddressChange',
            'hasLateEarly',
            'hasLeave'
        ];

        sections.forEach(section => {
            document.querySelector(`input[name="${section}"][value="no"]`).checked = true;
            const detailId = section.replace('has', '') + 'Detail';
            const detail = document.getElementById(detailId);
            if (detail) {
                detail.style.display = 'none';
                const container = detail.querySelector('[id$="Container"]');
                if (container) {
                    container.innerHTML = '';
                }
            }
        });

        document.getElementById('otherComments').value = '';
        validateForm();
    }
}

function setDefaultMonth() {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
    const year = lastMonth.getFullYear();
    const month = String(lastMonth.getMonth() + 1).padStart(2, '0');
    document.getElementById('reportMonth').value = `${year}-${month}`;
}

function setupToggle(radioName, detailId, addInitialEntry) {
    const radios = document.getElementsByName(radioName);
    const detail = document.getElementById(detailId);
    
    if (!radios || !detail) {
        console.error(`Setup failed for ${radioName}`);
        return;
    }

    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            console.log(`Radio changed: ${radioName} - ${this.value}`);
            const container = detail.querySelector('[id$="Container"]');
            
            if (this.value === 'yes') {
                detail.style.display = 'block';
                if (container && container.children.length === 0) {
                    addInitialEntry();
                }
            } else {
                detail.style.display = 'none';
                if (container) {
                    container.innerHTML = '';
                }
            }
            validateForm();
        });
    });
}

// ... [他のcreate*Entry関数とadd*関数は変更なし] ...

function validateEntry(entryRow) {
    if (!entryRow) return false;
    let isValid = true;
    
    const requiredFields = entryRow.querySelectorAll('.required');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('invalid');
            isValid = false;
        } else {
            field.classList.remove('invalid');
        }
    });

    const radioGroups = entryRow.querySelectorAll('.radio-group');
    radioGroups.forEach(group => {
        const radios = group.querySelectorAll('input[type="radio"]');
        const radioChecked = Array.from(radios).some(radio => radio.checked);
        if (radios.length > 0 && !radioChecked) {
            group.classList.add('invalid');
            isValid = false;
        } else {
            group.classList.remove('invalid');
        }
    });

    return isValid;
}

function validateEntryAndForm(entryRow) {
    validateEntry(entryRow);
    validateForm();
}

function validateForm() {
    let isValid = true;

    const officeName = document.getElementById('officeName');
    const reportMonth = document.getElementById('reportMonth');
    const csvFile = document.getElementById('csvFile');
    
    // 必須項目のチェック
    if (!officeName.value.trim()) {
        officeName.classList.add('invalid');
        isValid = false;
    } else {
        officeName.classList.remove('invalid');
    }

    if (!reportMonth.value) {
        reportMonth.classList.add('invalid');
        isValid = false;
    } else {
        reportMonth.classList.remove('invalid');
    }

    // CSVファイルの必須チェック - より厳密なチェックに修正
    if (!csvFile || !csvFile.files || csvFile.files.length === 0) {
        csvFile.classList.add('invalid');
        isValid = false;
    } else {
        csvFile.classList.remove('invalid');
    }

    const sections = [
        {name: 'hasNewEmployee', container: 'newEmployeeContainer'},
        {name: 'hasRetirement', container: 'retirementContainer'},
        {name: 'hasNoWork', container: 'noWorkContainer'},
        {name: 'hasSalaryChange', container: 'salaryChangeContainer'},
        {name: 'hasAddressChange', container: 'addressChangeContainer'},
        {name: 'hasLateEarly', container: 'lateEarlyContainer'},
        {name: 'hasLeave', container: 'leaveContainer'}
    ];

    sections.forEach(section => {
        const radio = document.querySelector(`input[name="${section.name}"]:checked`);
        if (radio && radio.value === 'yes') {
            const container = document.getElementById(section.container);
            if (container) {
                const entries = container.querySelectorAll('.entry-row');
                if (entries.length === 0) isValid = false;
                entries.forEach(entry => {
                    if (!validateEntry(entry)) isValid = false;
                });
            }
        }
    });

    // 送信ボタンの制御
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.disabled = !isValid;
        submitButton.style.backgroundColor = isValid ? '#4CAF50' : '#cccccc';
    }

    return isValid;
}

function removeEntry(button) {
    const entryRow = button.closest('.entry-row');
    const container = entryRow.closest('[id$="Container"]');
    entryRow.remove();
    
    if (container.lastElementChild) {
        validateEntry(container.lastElementChild);
    }
    validateForm();
}

async function handleSubmit(event) {
    event.preventDefault();
    const submitButton = document.getElementById('submitButton');
    const csvFile = document.getElementById('csvFile');

    // 送信中は二重送信を防止
    if (submitButton.disabled) return false;

    // CSVファイルの存在を確認
    if (!csvFile || !csvFile.files || csvFile.files.length === 0) {
        alert('CSVファイルを添付してください');
        return false;
    }

    // 最終バリデーション
    if (!validateForm()) {
        alert('必須項目を入力してください');
        return false;
    }

    try {
        submitButton.disabled = true;
        submitButton.textContent = '送信中...';

        // フォームデータの収集
        const formData = collectFormData();
        
        // Google Apps Scriptへの送信
        const response = await fetch('https://script.google.com/macros/s/AKfycbzXd99vpht-E5ibgc0ptYaUOeTG9fzJT2tXeUlpsFAajkAHhEHKCeCz-9SqrMNvNx4/exec', {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(formData)
        });

        alert('送信が完了しました');
        clearForm();
    } catch (error) {
        console.error('送信エラー:', error);
        alert('送信に失敗しました。もう一度お試しください。');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'メール送信';
        validateForm();
    }

    return false;
}

// フォームデータ収集関数
function collectFormData() {
    const data = {
        officeName: document.getElementById('officeName').value,
        reportMonth: document.getElementById('reportMonth').value,
        otherComments: document.getElementById('otherComments').value
    };

    const sections = [
        {name: 'hasNewEmployee', key: 'newEmployee', type: 'employee'},
        {name: 'hasRetirement', key: 'retirement', type: 'comment'},
        {name: 'hasNoWork', key: 'noWork', type: 'comment'},
        {name: 'hasSalaryChange', key: 'salaryChange', type: 'comment'},
        {name: 'hasAddressChange', key: 'addressChange', type: 'comment'},
        {name: 'hasLateEarly', key: 'lateEarly', type: 'attendance'},
        {name: 'hasLeave', key: 'leave', type: 'attendance'}
    ];

    sections.forEach(section => {
        const radio = document.querySelector(`input[name="${section.name}"]:checked`);
        if (radio && radio.value === 'yes') {
            data[section.key] = collectSectionData(section.key, section.type);
        }
    });

    return data;
}

function collectSectionData(containerId, type) {
    const container = document.getElementById(`${containerId}Container`);
    const entries = container.querySelectorAll('.entry-row');
    
    return Array.from(entries).map(entry => {
        const baseData = {
            name: entry.querySelector('.name-field').value
        };

        switch (type) {
            case 'employee':
                return {
                    ...baseData,
                    type: entry.querySelector('input[type="radio"]:checked').value,
                    docs: entry.querySelector('input[type="checkbox"]').checked
                };
            case 'attendance':
                return {
                    ...baseData,
                    date: entry.querySelector('.date-field').value,
                    type: entry.querySelector('input[type="radio"]:checked').value,
                    reason: entry.querySelector('.reason-field').value
                };
            default:
                return {
                    ...baseData,
                    comment: entry.querySelector('.reason-field').value
                };
        }
    });
}
