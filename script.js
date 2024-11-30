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

    setDefaultMonth();
    validateForm();
});

function clearForm() {
    if (confirm('入力内容をクリアしてよろしいですか？')) {
        document.getElementById('officeName').value = '';
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
        document.getElementById('csvFile').value = '';
        validateForm();
    }
}

function setDefaultMonth() {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
    const year = lastMonth.getFullYear();
    const month = String(lastMonth.getMonth() + 1).padStart(2, '0');
    
    const reportMonthInput = document.getElementById('reportMonth');
    reportMonthInput.value = `${year}-${month}`;
    
    // 入力フィールドの属性を設定
    const maxDate = `${year}-${month}`;
    reportMonthInput.setAttribute('max', maxDate);
    
    // 過去3年分まで選択可能に
    const minDate = `${year - 3}-${month}`;
    reportMonthInput.setAttribute('min', minDate);
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

function createNewEmployeeEntry() {
    const div = document.createElement('div');
    div.className = 'entry-row';
    const uniqueId = Date.now();
    div.innerHTML = `
        <input type="text" placeholder="氏名" class="name-field required" 
               maxlength="15"
               onchange="validateEntryAndForm(this.closest('.entry-row'))"
               onkeyup="validateEntryAndForm(this.closest('.entry-row'))">
        <div class="radio-group">
            <input type="radio" name="empType_${uniqueId}" value="社員" required
                   onchange="validateEntryAndForm(this.closest('.entry-row'))"> 社員
            <input type="radio" name="empType_${uniqueId}" value="PA"
                   onchange="validateEntryAndForm(this.closest('.entry-row'))"> PA
        </div>
        <div class="checkbox-group">
            <input type="checkbox" id="docs_${uniqueId}">
            <label for="docs_${uniqueId}">雇用書類提出済み</label>
        </div>
        <button type="button" class="remove-button" onclick="removeEntry(this)">削除</button>
    `;
    return div;
}

function createRetirementEntry() {
    const div = document.createElement('div');
    div.className = 'entry-row';
    div.innerHTML = `
        <input type="text" placeholder="氏名" class="name-field required"
               maxlength="15"
               onchange="validateEntryAndForm(this.closest('.entry-row'))"
               onkeyup="validateEntryAndForm(this.closest('.entry-row'))">
        <textarea placeholder="退職日等のコメント" class="reason-field required"
                onchange="validateEntryAndForm(this.closest('.entry-row'))"
                onkeyup="validateEntryAndForm(this.closest('.entry-row'))"></textarea>
        <button type="button" class="remove-button" onclick="removeEntry(this)">削除</button>
    `;
    return div;
}

function createNoWorkEntry() {
    const div = document.createElement('div');
    div.className = 'entry-row';
    div.innerHTML = `
        <input type="text" placeholder="氏名" class="name-field required"
               maxlength="15"
               onchange="validateEntryAndForm(this.closest('.entry-row'))"
               onkeyup="validateEntryAndForm(this.closest('.entry-row'))">
        <textarea placeholder="コメント" class="reason-field required"
                onchange="validateEntryAndForm(this.closest('.entry-row'))"
                onkeyup="validateEntryAndForm(this.closest('.entry-row'))"></textarea>
        <button type="button" class="remove-button" onclick="removeEntry(this)">削除</button>
    `;
    return div;
}

function createSalaryChangeEntry() {
    const div = document.createElement('div');
    div.className = 'entry-row';
    div.innerHTML = `
        <input type="text" placeholder="氏名" class="name-field required"
               maxlength="15"
               onchange="validateEntryAndForm(this.closest('.entry-row'))"
               onkeyup="validateEntryAndForm(this.closest('.entry-row'))">
        <textarea placeholder="変更内容" class="reason-field required"
                onchange="validateEntryAndForm(this.closest('.entry-row'))"
                onkeyup="validateEntryAndForm(this.closest('.entry-row'))"></textarea>
        <button type="button" class="remove-button" onclick="removeEntry(this)">削除</button>
    `;
    return div;
}

function createAddressChangeEntry() {
    const div = document.createElement('div');
    div.className = 'entry-row';
    div.innerHTML = `
        <input type="text" placeholder="氏名" class="name-field required"
               maxlength="15"
               onchange="validateEntryAndForm(this.closest('.entry-row'))"
               onkeyup="validateEntryAndForm(this.closest('.entry-row'))">
        <textarea placeholder="変更内容" class="reason-field required"
                onchange="validateEntryAndForm(this.closest('.entry-row'))"
                onkeyup="validateEntryAndForm(this.closest('.entry-row'))"></textarea>
        <button type="button" class="remove-button" onclick="removeEntry(this)">削除</button>
    `;
    return div;
}

function createLateEarlyEntry() {
    const div = document.createElement('div');
    div.className = 'entry-row';
    const uniqueId = Date.now();
    div.innerHTML = `
        <input type="text" placeholder="氏名" class="name-field required"
               maxlength="15"
               onchange="validateEntryAndForm(this.closest('.entry-row'))"
               onkeyup="validateEntryAndForm(this.closest('.entry-row'))">
        <input type="date" class="date-field required"
               onchange="validateEntryAndForm(this.closest('.entry-row'))">
        <div class="radio-group">
            <input type="radio" name="lateType_${uniqueId}" value="遅刻" required
                   onchange="validateEntryAndForm(this.closest('.entry-row'))"> 遅刻
            <input type="radio" name="lateType_${uniqueId}" value="早退"
                   onchange="validateEntryAndForm(this.closest('.entry-row'))"> 早退
            <input type="radio" name="lateType_${uniqueId}" value="残業"
                   onchange="validateEntryAndForm(this.closest('.entry-row'))"> 残業
        </div>
        <textarea placeholder="理由" class="reason-field required"
                onchange="validateEntryAndForm(this.closest('.entry-row'))"
                onkeyup="validateEntryAndForm(this.closest('.entry-row'))"></textarea>
        <button type="button" class="remove-button" onclick="removeEntry(this)">削除</button>
    `;
    return div;
}

function createLeaveEntry() {
    const div = document.createElement('div');
    div.className = 'entry-row';
    const uniqueId = Date.now();
    div.innerHTML = `
        <input type="text" placeholder="氏名" class="name-field required"
               maxlength="15"
               onchange="validateEntryAndForm(this.closest('.entry-row'))"
               onkeyup="validateEntryAndForm(this.closest('.entry-row'))">
        <input type="date" class="date-field required"
               onchange="validateEntryAndForm(this.closest('.entry-row'))">
        <div class="radio-group">
            <input type="radio" name="leaveType_${uniqueId}" value="有給" required
                   onchange="validateEntryAndForm(this.closest('.entry-row'))"> 有給
            <input type="radio" name="leaveType_${uniqueId}" value="欠勤"
                   onchange="validateEntryAndForm(this.closest('.entry-row'))"> 欠勤
        </div>
        <textarea placeholder="理由" class="reason-field required"
                onchange="validateEntryAndForm(this.closest('.entry-row'))"
                onkeyup="validateEntryAndForm(this.closest('.entry-row'))"></textarea>
        <button type="button" class="remove-button" onclick="removeEntry(this)">削除</button>
    `;
    return div;
}

function addEntry(containerId, createFn) {
    const container = document.getElementById(containerId);
    const entry = createFn();
    container.appendChild(entry);
    validateEntry(entry);
    validateForm();
}

function addNewEmployee() {
    addEntry('newEmployeeContainer', createNewEmployeeEntry);
}

function addRetirement() {
    addEntry('retirementContainer', createRetirementEntry);
}

function addNoWork() {
    addEntry('noWorkContainer', createNoWorkEntry);
}

function addSalaryChange() {
    addEntry('salaryChangeContainer', createSalaryChangeEntry);
}

function addAddressChange() {
    addEntry('addressChangeContainer', createAddressChangeEntry);
}

function addLateEarly() {
    addEntry('lateEarlyContainer', createLateEarlyEntry);
}

function addLeave() {
    addEntry('leaveContainer', createLeaveEntry);
}

function validateEntry(entryRow) {
    if (!entryRow) return false;
    let isValid = true;
    
    // 必須フィールドのバリデーション
    const requiredFields = entryRow.querySelectorAll('.required');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('invalid');
            isValid = false;
        } else {
            field.classList.remove('invalid');
        }
    });

    // ラジオボタングループのバリデーション
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

    // 追加ボタンの表示制御
    const container = entryRow.closest('[id$="Container"]');
    if (container) {
        const addButton = container.parentElement.querySelector('.add-button');
        if (addButton) {
            // 現在のエントリー行が有効であれば追加ボタンを表示
            addButton.style.display = isValid ? 'block' : 'none';
        }
    }

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
                entries.forEach(entry => {
                    if (!validateEntry(entry)) isValid = false;
                });
            }
        }
    });

    document.getElementById('submitButton').disabled = !isValid;
    return isValid;
}

function removeEntry(button) {
    const entryRow = button.closest('.entry-row');
    const container = entryRow.closest('[id$="Container"]');
    entryRow.remove();
    validateForm();
}

async function handleSubmit(event) {
    event.preventDefault();
    const submitButton = document.getElementById('submitButton');

    if (submitButton.disabled) return false;

    if (!validateForm()) {
        alert('必須項目を入力してください');
        return false;
    }

    try {
        submitButton.disabled = true;
        submitButton.textContent = '送信中...';

        const formData = collectFormData();
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

function collectFormData() {
    const data = {
        officeName: document.getElementById('officeName').value,
        reportMonth: document.getElementById('reportMonth').value,
        otherComments: document.getElementById('otherComments').value
    };

    const sections = [
        {name: 'hasNewEmployee', key: 'newEmployee', container: 'newEmployeeContainer'},
        {name: 'hasRetirement', key: 'retirement', container: 'retirementContainer'},
        {name: 'hasNoWork', key: 'noWork', container: 'noWorkContainer'},
        {name: 'hasSalaryChange', key: 'salaryChange', container: 'salaryChangeContainer'},
        {name: 'hasAddressChange', key: 'addressChange', container: 'addressChangeContainer'},
        {name: 'hasLateEarly', key: 'lateEarly', container: 'lateEarlyContainer'},
        {name: 'hasLeave', key: 'leave', container: 'leaveContainer'}
    ];

    sections.forEach(section => {
        const radio = document.querySelector(`input[name="${section.name}"]:checked`);
        if (radio && radio.value === 'yes') {
            data[section.key] = collectSectionData(section.key, section.container);
        }
    });

    return data;
}

function collectSectionData(sectionKey, containerId) {
    const container = document.getElementById(containerId);
    const entries = container.querySelectorAll('.entry-row');
    const data = [];

    entries.forEach(entry => {
        const entryData = {
            name: entry.querySelector('.name-field').value
        };

        switch(sectionKey) {
            case 'newEmployee':
                const empTypeRadio = entry.querySelector('input[type="radio"]:checked');
                entryData.type = empTypeRadio ? empTypeRadio.value : '';
                entryData.docs = entry.querySelector('input[type="checkbox"]').checked;
                break;

            case 'lateEarly':
            case 'leave':
                entryData.date = entry.querySelector('.date-field').value;
                const typeRadio = entry.querySelector('input[type="radio"]:checked');
                entryData.type = typeRadio ? typeRadio.value : '';
                entryData.reason = entry.querySelector('.reason-field').value;
                break;

            default:
                entryData.comment = entry.querySelector('.reason-field').value;
        }

        data.push(entryData);
    });

    return data;
}
