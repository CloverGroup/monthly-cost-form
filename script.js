document.addEventListener('DOMContentLoaded', function () {
    console.log('Initializing form...');

    const sections = [
        { radioName: 'hasNewEmployee', detailId: 'newEmployeeDetail', addFn: addNewEmployee },
        { radioName: 'hasRetirement', detailId: 'retirementDetail', addFn: addRetirement },
        { radioName: 'hasNoWork', detailId: 'noWorkDetail', addFn: addNoWork },
        { radioName: 'hasSalaryChange', detailId: 'salaryChangeDetail', addFn: addSalaryChange },
        { radioName: 'hasAddressChange', detailId: 'addressChangeDetail', addFn: addAddressChange },
        { radioName: 'hasLateEarly', detailId: 'lateEarlyDetail', addFn: addLateEarly },
        { radioName: 'hasLeave', detailId: 'leaveDetail', addFn: addLeave }
    ];

    sections.forEach(section => {
        setupToggle(section.radioName, section.detailId, section.addFn);
    });

    setDefaultMonth();
    validateForm();
});

function setupToggle(radioName, detailId, addInitialEntry) {
    const radios = document.getElementsByName(radioName);
    const detail = document.getElementById(detailId);

    if (!radios || !detail) {
        console.error(`setupToggle: ${radioName} または ${detailId} が見つかりません`);
        return;
    }

    radios.forEach(radio => {
        radio.addEventListener('change', function () {
            const container = detail.querySelector('[id$="Container"]');

            if (this.value === 'yes') {
                detail.style.display = 'block';
                if (container && container.children.length === 0) {
                    const entry = addInitialEntry();
                    if (entry) {
                        container.appendChild(entry);
                        const nameField = entry.querySelector('.name-field');
                        if (nameField) {
                            setTimeout(() => nameField.focus(), 0);
                        }
                    }
                }
            } else {
                detail.style.display = 'none';
                if (container) container.innerHTML = '';
            }

            validateForm();
        });
    });
}

function setDefaultMonth() {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
    const year = lastMonth.getFullYear();
    const month = String(lastMonth.getMonth() + 1).padStart(2, '0');

    const reportMonthInput = document.getElementById('reportMonth');
    reportMonthInput.value = `${year}-${month}`;

    const maxDate = `${year}-${month}`;
    reportMonthInput.setAttribute('max', maxDate);

    const minDate = `${year - 3}-${month}`;
    reportMonthInput.setAttribute('min', minDate);
}
function addEntry(containerId, createFn) {
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`addEntry: ${containerId} が見つかりません`);
        return;
    }

    const entry = createFn();
    if (!(entry instanceof Node)) {
        console.error(`addEntry: createFn() が有効なエントリーを返しませんでした (${containerId})`);
        return;
    }

    container.appendChild(entry);

    const nameField = entry.querySelector('.name-field');
    if (nameField) {
        setTimeout(() => nameField.focus(), 0);
    }

    validateEntry(entry);
    validateForm();
}

function createNewEmployeeEntry() {
    const div = document.createElement('div');
    div.className = 'entry-row';
    div.innerHTML = `
        <input type="text" placeholder="氏名" class="name-field required" maxlength="15"
               onchange="validateEntryAndForm(this.closest('.entry-row'))"
               onkeyup="validateEntryAndForm(this.closest('.entry-row'))">
        <div class="radio-group">
            <input type="radio" name="empType_${Date.now()}" value="社員" required
                   onchange="validateEntryAndForm(this.closest('.entry-row'))"> 社員
            <input type="radio" name="empType_${Date.now()}" value="PA"
                   onchange="validateEntryAndForm(this.closest('.entry-row'))"> PA
        </div>
        <button type="button" class="remove-button" onclick="removeEntry(this)">削除</button>
    `;
    return div;
}

function addNewEmployee() {
    addEntry('newEmployeeContainer', createNewEmployeeEntry);
}

function removeEntry(button) {
    const entryRow = button.closest('.entry-row');
    if (entryRow) {
        entryRow.remove();
        validateForm();
    }
}
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

    return isValid;
}

function validateForm() {
    let isValid = true;

    const officeName = document.getElementById('officeName');
    const reportMonth = document.getElementById('reportMonth');
    const csvFile = document.getElementById('csvFile');

    if (!officeName.value.trim()) isValid = false;
    if (!reportMonth.value) isValid = false;
    if (!csvFile.files.length) isValid = false;

    document.getElementById('submitButton').disabled = !isValid;
    return isValid;
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

        const formData = new FormData(document.querySelector('form'));
        const response = await fetch('https://script.google.com/macros/s/AKfycbzXd99vpht-E5ibgc0ptYaUOeTG9fzJT2tXeUlpsFAajkAHhEHKCeCz-9SqrMNvNx4/exec', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error(`HTTPエラー: ${response.status}`);

        alert('送信が完了しました');
        clearForm();
    } catch (error) {
        console.error('送信エラー:', error);
        alert('送信に失敗しました。もう一度お試しください。');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'メール送信';
    }

    return false;
}

function clearForm() {
    if (confirm('入力内容をクリアしてよろしいですか？')) {
        document.querySelector('form').reset();
        validateForm();
    }
}

