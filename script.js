// DOM読み込み完了時の初期化
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

// フォームクリア機能
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

// 前月をデフォルト値として設定
function setDefaultMonth() {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
    const year = lastMonth.getFullYear();
    const month = String(lastMonth.getMonth() + 1).padStart(2, '0');
    document.getElementById('reportMonth').value = `${year}-${month}`;
}

// セクションのトグル制御
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

// エントリー作成関数群
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
        <textarea placeholder="有休消化等コメント" class="reason-field required"
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

// エントリー追加の共通関数
function addEntry(containerId, createFn) {
    const container = document.getElementById(containerId);
    const entry = createFn();
    container.appendChild(entry);
    validateEntry(entry);
    validateForm();
}

// 各セクションのエントリー追加関数
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

// バリデーション関数
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

    // ラジオボタンのバリデーション
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

    // 追加ボタンの表示/非表示
    const container = entryRow.closest('[id$="Container"]');
    if (container) {
        const addButton = container.nextElementSibling;
        if (addButton && addButton.classList.contains('add-button')) {
            if (entryRow === container.lastElementChild) {
                addButton.style.display = isValid ? 'block' : 'none';
            }
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

    // 基本情報のバリデーション
    const officeName = document.getElementById('officeName');
    const reportMonth = document.getElementById('reportMonth');
    
    if (!officeName.value.trim() || !reportMonth.value) {
        isValid = false;
    }

    // 各セクションのバリデーション
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
            const entries = container.querySelectorAll('.entry-row');
            entries.forEach(entry => {
                if (!validateEntry(entry)) isValid = false;
            });
        }
    });

    // 送信ボタンの制御
    document.getElementById('submitButton').disabled = !isValid;
    return isValid;
}

// エ