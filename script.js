// DOM読み込み完了時の初期化
document.addEventListener('DOMContentLoaded', function() {
    console.log('==== Form Initialization Started ====');
    
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
        console.log(`Initializing section: ${section.radioName}`);
        setupToggle(section.radioName, section.detailId, section.addFn);
    });

    console.log('Setting default month');
    setDefaultMonth();
    console.log('Running initial form validation');
    validateForm();
    console.log('==== Form Initialization Completed ====');
});

function clearForm() {
    console.log('Clearing form...');
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
            console.log(`Clearing section: ${section}`);
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
        console.log('Form cleared successfully');
    }
}

function setDefaultMonth() {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
    const year = lastMonth.getFullYear();
    const month = String(lastMonth.getMonth() + 1).padStart(2, '0');
    document.getElementById('reportMonth').value = `${year}-${month}`;
    console.log(`Default month set to: ${year}-${month}`);
}

function setupToggle(radioName, detailId, addInitialEntry) {
    console.log(`Setting up toggle for: ${radioName}, detail: ${detailId}`);
    const radios = document.getElementsByName(radioName);
    const detail = document.getElementById(detailId);
    
    console.log('Found elements:', {
        radios: radios.length,
        detail: detail ? 'yes' : 'no'
    });
    
    if (!radios || !detail) {
        console.error(`Setup failed for ${radioName}`);
        return;
    }

    radios.forEach(radio => {
        console.log(`Adding listener to ${radio.value} radio`);
        radio.addEventListener('change', function() {
            console.log(`Radio changed: ${radioName} - ${this.value}`);
            const container = detail.querySelector('[id$="Container"]');
            console.log('Container found:', container ? 'yes' : 'no');
            
            if (this.value === 'yes') {
                console.log('Showing detail section');
                detail.style.display = 'block';
                if (container && container.children.length === 0) {
                    console.log('Adding initial entry');
                    addInitialEntry();
                }
            } else {
                console.log('Hiding detail section');
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
    console.log('Creating new employee entry');
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
    console.log('Creating retirement entry');
    const div = document.createElement('div');
    div.className = 'entry-row';
    div.innerHTML = `
        <input type="text" placeholder="氏名" class="name-field required"
               maxlength="15"
               onchange="validateEntryAndForm(this.closest('.entry-row'))"
               onkeyup="validateEntryAndForm(this.closest('.entry-row'))">
        <textarea placeholder="有休消化等コメント" class="reason-field required"
                onchange="validateEntryAndForm(this.closest('.entry-row'))"
                onkeyup="validateEntryAndForm(this.closest('.entry-row'))"></textarea>
        <button type="button" class="remove-button" onclick="removeEntry(this)">削除</button>
    `;
    return div;
}

function createNoWorkEntry() {
    console.log('Creating no-work entry');
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
    console.log('Creating salary change entry');
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
    console.log('Creating address change entry');
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
    console.log('Creating late/early entry');
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
    console.log('Creating leave entry');
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
    console.log(`Adding entry to container: ${containerId}`);
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
    console.log('Validating entry row');
    
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

    const container = entryRow.closest('[id$="Container"]');
    if (container) {
        const addButton = container.nextElementSibling;
        if (addButton && addButton.classList.contains('add-button')) {
            if (entryRow === container.lastElementChild) {
                addButton.style.display = isValid ? 'block' : 'none';
            }
        }
    }

    console.log(`Entry validation result: ${isValid}`);
    return isValid;
}

function validateEntryAndForm(entryRow) {
    validateEntry(entryRow);
    validateForm();
}

function validateForm() {
    console.log('Validating entire form');
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
        reportMonth.classList.remove

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
            headers: {
                'Content-Type': 'application/json'
            },
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
        {name: 'hasNewEmployee', key: 'newEmployee'},
        {name: 'hasRetirement', key: 'retirement'},
        {name: 'hasNoWork', key: 'noWork'},
        {name: 'hasSalaryChange', key: 'salaryChange'},
        {name: 'hasAddressChange', key: 'addressChange'},
        {name: 'hasLateEarly', key: 'lateEarly'},
        {name: 'hasLeave', key: 'leave'}
    ];

    sections.forEach(section => {
        const radio = document.querySelector(`input[name="${section.name}"]:checked`);
        if (radio && radio.value === 'yes') {
            data[section.key] = collectSectionData(section.key);
        }
    });

    return data;
}

function collectSectionData(sectionKey) {
    const container = document.getElementById(`${sectionKey}Container`);
    return Array.from(container.querySelectorAll('.entry-row')).map(row => {
        const data = {
            name: row.querySelector('.name-field').value
        };

        const radio = row.querySelector('input[type="radio"]:checked');
        if (radio) {
            data.type = radio.value;
        }

        const date = row.querySelector('.date-field');
        if (date) {
            data.date = date.value;
        }

        const reason = row.querySelector('.reason-field');
        if (reason) {
            data.reason = reason.value;
        }

        const docs = row.querySelector('input[type="checkbox"]');
        if (docs) {
            data.docs = docs.checked;
        }

        return data;
    });
}
