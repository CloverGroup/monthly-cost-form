document.addEventListener('DOMContentLoaded', function() {
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
  setupFileInputs();
  validateForm();
});

// 各セクションの表示切替
function setupToggle(radioName, detailId, addInitialEntry) {
  const radios = document.getElementsByName(radioName);
  const detail = document.getElementById(detailId);
  if (!radios || !detail) return;
  radios.forEach(radio => {
    radio.addEventListener('change', function() {
      const container = detail.querySelector('[id$="Container"]');
      if (this.value === 'yes') {
        detail.style.display = 'block';
        if (container && container.children.length === 0) {
          addInitialEntry();
        }
      } else {
        detail.style.display = 'none';
        if (container) container.innerHTML = '';
      }
      validateForm();
    });
  });
}

// 共通：エントリ追加
function addEntry(containerId, createFn) {
  const container = document.getElementById(containerId);
  const entry = createFn();
  container.appendChild(entry);
  validateForm();
}

// 共通：エントリ削除
function removeEntry(button) {
  const entryRow = button.closest('.entry-row');
  if (entryRow) entryRow.remove();
  validateForm();
}

// フォームクリア
function clearForm() {
  if (confirm('入力内容をクリアしてよろしいですか？')) {
    document.getElementById('officeName').value = '';
    document.getElementById('reportMonth').value = '';
    document.getElementById('confirmationEmail').value = '';
    document.getElementById('otherComments').value = '';
    document.getElementById('csvFile').value = '';
    document.getElementById('optionalFile').value = '';
    const detailIds = ['newEmployeeDetail','retirementDetail','noWorkDetail','salaryChangeDetail','addressChangeDetail','lateEarlyDetail','leaveDetail'];
    detailIds.forEach(id => {
      const detail = document.getElementById(id);
      if (detail) {
        detail.style.display = 'none';
        const container = detail.querySelector('[id$="Container"]');
        if (container) container.innerHTML = '';
      }
    });
    validateForm();
  }
}

// フォームバリデーション（簡易チェック）
function validateForm() {
  let isValid = true;
  const officeName = document.getElementById('officeName');
  const reportMonth = document.getElementById('reportMonth');
  const confirmationEmail = document.getElementById('confirmationEmail');
  
  if (!officeName.value.trim()) { officeName.classList.add('invalid'); isValid = false; }
  else { officeName.classList.remove('invalid'); }
  
  if (!reportMonth.value) { reportMonth.classList.add('invalid'); isValid = false; }
  else { reportMonth.classList.remove('invalid'); }
  
  if (!confirmationEmail.value.trim()) { confirmationEmail.classList.add('invalid'); isValid = false; }
  else { confirmationEmail.classList.remove('invalid'); }
  
  const csvFile = document.getElementById('csvFile');
  if (!csvFile.files || csvFile.files.length === 0) { csvFile.classList.add('invalid'); isValid = false; }
  else { csvFile.classList.remove('invalid'); }
  
  // 各セクションのエントリ（ここでは各エントリ内の .name-field が空でないか）
  const sectionContainers = [
    { radioName: 'hasNewEmployee', containerId: 'newEmployeeContainer' },
    { radioName: 'hasRetirement', containerId: 'retirementContainer' },
    { radioName: 'hasNoWork', containerId: 'noWorkContainer' },
    { radioName: 'hasSalaryChange', containerId: 'salaryChangeContainer' },
    { radioName: 'hasAddressChange', containerId: 'addressChangeContainer' },
    { radioName: 'hasLateEarly', containerId: 'lateEarlyContainer' },
    { radioName: 'hasLeave', containerId: 'leaveContainer' }
  ];
  sectionContainers.forEach(section => {
    const radio = document.querySelector(`input[name="${section.radioName}"]:checked`);
    if (radio && radio.value === 'yes') {
      const container = document.getElementById(section.containerId);
      if (container) {
        const entries = container.querySelectorAll('.entry-row');
        if (entries.length === 0) isValid = false;
        entries.forEach(entry => {
          const nameField = entry.querySelector('.name-field');
          if (!nameField || !nameField.value.trim()) { 
            if(nameField) nameField.classList.add('invalid');
            isValid = false; 
          } else { 
            nameField.classList.remove('invalid'); 
          }
        });
      }
    }
  });
  
  document.getElementById('submitButton').disabled = !isValid;
  return isValid;
}

// ファイル入力設定・バリデーション
function setupFileInputs() {
  const csvFile = document.getElementById('csvFile');
  const optionalFile = document.getElementById('optionalFile');
  csvFile.accept = '.csv,.xlsx,.xls';
  optionalFile.required = false;
  csvFile.addEventListener('change', function() { validateFileInput(this); });
  optionalFile.addEventListener('change', function() { validateFileInput(this); });
}

function validateFileInput(fileInput) {
  if (fileInput.files && fileInput.files.length > 0) {
    const fileName = fileInput.files[0].name.toLowerCase();
    const fileSize = fileInput.files[0].size;
    if (!(fileName.endsWith('.csv') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls'))) {
      alert('CSVまたはExcelファイルを選択してください');
      fileInput.value = '';
      return false;
    }
    if (fileSize > 50 * 1024 * 1024) {
      alert('ファイルサイズは50MB以下にしてください');
      fileInput.value = '';
      return false;
    }
  }
  validateForm();
}

// 先月をデフォルトの報告対象月に設定
function setDefaultMonth() {
  const reportMonthInput = document.getElementById('reportMonth');
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
  const yearLast = lastMonth.getFullYear();
  const monthLast = String(lastMonth.getMonth() + 1).padStart(2, '0');
  reportMonthInput.value = `${yearLast}-${monthLast}`;
}

// ===== 各セクション用エントリ作成関数 =====

// 新規配属者エントリ
function createNewEmployeeEntry() {
  const div = document.createElement('div');
  div.className = 'entry-row';
  const uniqueId = Date.now();
  div.innerHTML = `
    <input type="text" name="newEmployeeName[]" placeholder="氏名" class="name-field required" maxlength="15" onchange="validateForm()" onkeyup="validateForm()">
    <div class="radio-group">
      <label>
        <input type="radio" name="newEmployeeType_${uniqueId}" value="社員" required onchange="updateEmployeeType(${uniqueId}, this.value); validateForm()" checked> 社員
      </label>
      <label>
        <input type="radio" name="newEmployeeType_${uniqueId}" value="PA" onchange="updateEmployeeType(${uniqueId}, this.value); validateForm()"> PA
      </label>
    </div>
    <input type="hidden" name="newEmployeeType[]" id="hiddenEmployeeType_${uniqueId}" value="社員">
    <div class="checkbox-group">
      <input type="checkbox" id="docs_${uniqueId}" name="employmentDocumentSubmitted[]" value="1" onchange="validateForm()">
      <label for="docs_${uniqueId}">雇用契約書類提出済み</label>
    </div>
    <button type="button" class="remove-button" onclick="removeEntry(this)">削除</button>
  `;
  return div;
}
function updateEmployeeType(uniqueId, value) {
  document.getElementById("hiddenEmployeeType_" + uniqueId).value = value;
}
function addNewEmployee() {
  addEntry('newEmployeeContainer', createNewEmployeeEntry);
}

// 当月退職者エントリ
function createRetirementEntry() {
  const div = document.createElement('div');
  div.className = 'entry-row';
  div.innerHTML = `
    <input type="text" name="retiredThisMonthName[]" placeholder="氏名" class="name-field required" maxlength="15" onchange="validateForm()" onkeyup="validateForm()">
    <textarea name="retiredThisMonthComment[]" placeholder="退職日等のコメント" class="reason-field required" onchange="validateForm()" onkeyup="validateForm()"></textarea>
    <button type="button" class="remove-button" onclick="removeEntry(this)">削除</button>
  `;
  return div;
}
function addRetirement() {
  addEntry('retirementContainer', createRetirementEntry);
}

// 在籍しているが勤務がない人エントリ
function createNoWorkEntry() {
  const div = document.createElement('div');
  div.className = 'entry-row';
  div.innerHTML = `
    <input type="text" name="inactiveStaff[]" placeholder="氏名" class="name-field required" maxlength="15" onchange="validateForm()" onkeyup="validateForm()">
    <textarea name="inactiveStaffReason[]" placeholder="理由" class="reason-field required" onchange="validateForm()" onkeyup="validateForm()"></textarea>
    <button type="button" class="remove-button" onclick="removeEntry(this)">削除</button>
  `;
  return div;
}
function addNoWork() {
  addEntry('noWorkContainer', createNoWorkEntry);
}

// 給与・勤務形態変更エントリ
function createSalaryChangeEntry() {
  const div = document.createElement('div');
  div.className = 'entry-row';
  const uniqueId = Date.now();
  div.innerHTML = `
    <input type="text" name="changedSalaryWorkName[]" placeholder="氏名" class="name-field required" maxlength="15" onchange="validateForm()" onkeyup="validateForm()">
    <div class="checkbox-group">
      <input type="checkbox" id="salary_contract_${uniqueId}" name="salaryContractSubmitted[]" value="1" onchange="validateForm()">
      <label for="salary_contract_${uniqueId}">雇用契約書送付済み</label>
    </div>
    <textarea name="changedSalaryWorkDetail[]" placeholder="変更内容" class="reason-field required" onchange="validateForm()" onkeyup="validateForm()"></textarea>
    <button type="button" class="remove-button" onclick="removeEntry(this)">削除</button>
  `;
  return div;
}
function addSalaryChange() {
  addEntry('salaryChangeContainer', createSalaryChangeEntry);
}

// 住所・交通費変更エントリ
function createAddressChangeEntry() {
  const div = document.createElement('div');
  div.className = 'entry-row';
  const uniqueId = Date.now();
  div.innerHTML = `
    <input type="text" name="changedAddressTransportName[]" placeholder="氏名" class="name-field required" maxlength="15" onchange="validateForm()" onkeyup="validateForm()">
    <textarea name="changedAddressTransportDetail[]" placeholder="変更内容" class="reason-field required" onchange="validateForm()" onkeyup="validateForm()"></textarea>
    <button type="button" class="remove-button" onclick="removeEntry(this)">削除</button>
  `;
  return div;
}
function addAddressChange() {
  addEntry('addressChangeContainer', createAddressChangeEntry);
}

// 遅刻・早退等エントリ
function createLateEarlyEntry() {
  const div = document.createElement('div');
  div.className = 'entry-row';
  const uniqueId = Date.now();
  const { min, max } = setDateConstraints();
  div.innerHTML = `
    <input type="text" name="lateEarlyName[]" placeholder="氏名" class="name-field required" maxlength="15" onchange="validateForm()" onkeyup="validateForm()">
    <input type="date" name="lateEarlyDate[]" class="date-field required" min="${min}" max="${max}" onchange="validateForm()">
    <div class="radio-group">
      <label>
        <input type="radio" name="lateType_${uniqueId}" value="遅刻" required onchange="updateLateEarly(${uniqueId}, this.value); validateForm()" checked> 遅刻
      </label>
      <label>
        <input type="radio" name="lateType_${uniqueId}" value="早退" onchange="updateLateEarly(${uniqueId}, this.value); validateForm()"> 早退
      </label>
      <label>
        <input type="radio" name="lateType_${uniqueId}" value="残業" onchange="updateLateEarly(${uniqueId}, this.value); validateForm()"> 残業
      </label>
    </div>
    <input type="hidden" name="lateEarly[]" id="hiddenLateEarly_${uniqueId}" value="遅刻">
    <textarea name="lateEarlyReason[]" placeholder="理由" class="reason-field required" onchange="validateForm()" onkeyup="validateForm()"></textarea>
    <button type="button" class="remove-button" onclick="removeEntry(this)">削除</button>
  `;
  return div;
}
function updateLateEarly(uniqueId, value) {
  document.getElementById("hiddenLateEarly_" + uniqueId).value = value;
}
function addLateEarly() {
  addEntry('lateEarlyContainer', createLateEarlyEntry);
}

// 有給・欠勤等エントリ
function createLeaveEntry() {
  const div = document.createElement('div');
  div.className = 'entry-row';
  const uniqueId = Date.now();
  const { min, max } = setDateConstraints();
  div.innerHTML = `
    <input type="text" name="paidLeaveAbsenceName[]" placeholder="氏名" class="name-field required" maxlength="15" onchange="validateForm()" onkeyup="validateForm()">
    <input type="date" name="paidLeaveAbsenceDate[]" class="date-field required" min="${min}" max="${max}" onchange="validateForm()">
    <div class="radio-group">
      <label>
        <input type="radio" name="leaveType_${uniqueId}" value="有給" required onchange="updatePaidLeave(${uniqueId}, this.value); validateForm()" checked> 有給
      </label>
      <label>
        <input type="radio" name="leaveType_${uniqueId}" value="欠勤" onchange="updatePaidLeave(${uniqueId}, this.value); validateForm()"> 欠勤
      </label>
    </div>
    <input type="hidden" name="paidLeaveAbsence[]" id="hiddenPaidLeave_${uniqueId}" value="有給">
    <textarea name="paidLeaveAbsenceReason[]" placeholder="理由" class="reason-field required" onchange="validateForm()" onkeyup="validateForm()"></textarea>
    <button type="button" class="remove-button" onclick="removeEntry(this)">削除</button>
  `;
  return div;
}
function updatePaidLeave(uniqueId, value) {
  document.getElementById("hiddenPaidLeave_" + uniqueId).value = value;
}
function addLeave() {
  addEntry('leaveContainer', createLeaveEntry);
}

// 日付制約（遅刻・早退、有給・欠勤用）
function setDateConstraints() {
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
  const year = lastMonth.getFullYear();
  const month = String(lastMonth.getMonth() + 1).padStart(2, '0');
  const firstDay = `${year}-${month}-01`;
  const lastDay = `${year}-${month}-${new Date(year, lastMonth.getMonth() + 1, 0).getDate()}`;
  return { min: firstDay, max: lastDay };
}

// フォーム送信ハンドラ
function handleSubmit(event) {
  event.preventDefault();
  const submitButton = document.getElementById('submitButton');
  if (submitButton.disabled) return false;
  if (!validateForm()) {
    alert('必須項目を入力してください');
    return false;
  }
  submitButton.disabled = true;
  submitButton.textContent = '送信中...';
  const formData = new FormData(document.getElementById('mainForm'));
  fetch(document.getElementById('mainForm').action, {
    method: 'POST',
    body: formData
  })
  .then(function() {
    alert('送信が完了しました');
    clearForm();
  })
  .catch(function(error) {
    console.error('送信エラー:', error);
    alert('送信に失敗しました。もう一度お試しください。');
  })
  .finally(function() {
    submitButton.disabled = false;
    submitButton.textContent = 'メール送信';
    validateForm();
  });
  return false;
}
