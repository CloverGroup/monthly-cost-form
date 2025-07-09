document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing form...');
  /*2025/07/09 他事業所からのヘルプ追加*/
  const sections = [
    { radioName: 'hasNewEmployee', detailId: 'newEmployeeDetail', addFn: addNewEmployee },
    { radioName: 'hasRetirement', detailId: 'retirementDetail', addFn: addRetirement },
    { radioName: 'hasNoWork', detailId: 'noWorkDetail', addFn: addNoWork },
    { radioName: 'hasSalaryChange', detailId: 'salaryChangeDetail', addFn: addSalaryChange },
    { radioName: 'hasAddressChange', detailId: 'addressChangeDetail', addFn: addAddressChange },
	{ radioName: 'hasOtherHelp', detailId: 'otherHelpDetail', addFn: addOtherHelp },
    { radioName: 'hasLateEarly', detailId: 'lateEarlyDetail', addFn: addLateEarly },
    { radioName: 'hasLeave', detailId: 'leaveDetail', addFn: addLeave }
  ];
  
  sections.forEach(section => {
    setupToggle(section.radioName, section.detailId, section.addFn);
  });
  
  setDefaultMonth();
//  setupFileInputs();
  validateForm();
});

//function setupFileInputs() {
//  const csvFile = document.getElementById('csvFile');
//  const optionalFile = document.getElementById('optionalFile');
//  
//  // CSVファイルは拡張子を限定するが、追加資料は全形式許可する
//  csvFile.accept = '.csv,.xlsx,.xls';
//  // optionalFile は特に accept 属性を設定しない（すなわち全形式許可）
//  // optionalFile.accept = ''; // この行を削除またはコメントアウトしてください
//  optionalFile.required = false;
//  
//  csvFile.addEventListener('change', function() {
//    validateFileInput(this);
//  });
//  optionalFile.addEventListener('change', function() {
//    validateFileInput(this);
//  });
//}


//function validateFileInput(fileInput) {
//  if (fileInput.files && fileInput.files.length > 0) {
//    const fileName = fileInput.files[0].name.toLowerCase();
//    const fileSize = fileInput.files[0].size;
//    
//    // CSVファイルについてのみ拡張子チェックを行う
//    if (fileInput.id === 'csvFile') {
//      if (!(fileName.endsWith('.csv') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls'))) {
//        fileInput.classList.add('invalid');
//        fileInput.classList.remove('valid');
//        fileInput.value = '';
//        alert('CSVまたはExcelファイルを選択してください');
//        return false;
//      }
//    }
//    
//    if (fileSize > 50 * 1024 * 1024) {
//      fileInput.classList.add('invalid');
//      fileInput.classList.remove('valid');
//      fileInput.value = '';
//      alert('ファイルサイズは50MB以下にしてください');
//      return false;
//    }
//    
//    if (calculateTotalFileSize() > 50 * 1024 * 1024) {
//      fileInput.classList.add('invalid');
//      fileInput.classList.remove('valid');
//      fileInput.value = '';
//      alert('添付ファイルの合計サイズは50MB以下にしてください');
//      return false;
//    }
//    
//    fileInput.classList.remove('invalid');
//    fileInput.classList.add('valid');
//  } else {
//    if (fileInput.id === 'csvFile') {
//      fileInput.classList.add('invalid');
//      fileInput.classList.remove('valid');
//    }
//  }
//  validateForm();
//}

//function calculateTotalFileSize() {
//  const csvFile = document.getElementById('csvFile').files[0];
//  const optionalFile = document.getElementById('optionalFile').files[0];
//  let totalSize = 0;
//  if (csvFile) totalSize += csvFile.size;
//  if (optionalFile) totalSize += optionalFile.size;
//  return totalSize;
//}

function setDefaultMonth() {
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
  const year = lastMonth.getFullYear();
  const month = String(lastMonth.getMonth() + 1).padStart(2, '0');
  const reportMonthInput = document.getElementById('reportMonth');
  reportMonthInput.value = `${year}-${month}`;
  reportMonthInput.setAttribute('max', `${year}-${month}`);
  reportMonthInput.setAttribute('min', `${year - 3}-${month}`);
}

function setDateConstraints() {
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
  const year = lastMonth.getFullYear();
  const month = String(lastMonth.getMonth() + 1).padStart(2, '0');
  const firstDay = `${year}-${month}-01`;
  const lastDay = `${year}-${month}-${new Date(year, lastMonth.getMonth() + 1, 0).getDate()}`;
  return { min: firstDay, max: lastDay };
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
      const container = detail.querySelector('[id$="Container"]');
      if (this.value === 'yes') {
        detail.style.display = 'block';
        if (container && container.children.length === 0) {
          addInitialEntry();
          const nameField = container.querySelector('.name-field');
          if (nameField) {
            nameField.focus();
          }
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

function handleAddressChangeSubmitted(checkbox) {
  const entryRow = checkbox.closest('.entry-row');
  const reasonField = entryRow.querySelector('.reason-field');
  if (checkbox.checked) {
    entryRow.classList.add('checkbox-checked');
    reasonField.classList.remove('required', 'invalid');
    if (!reasonField.value.trim()) {
      reasonField.value = '変更届提出済み';
    }
  } else {
    entryRow.classList.remove('checkbox-checked');
    reasonField.classList.add('required');
    if (reasonField.value === '変更届提出済み') {
      reasonField.value = '';
    }
    if (!reasonField.value.trim()) {
      reasonField.classList.add('invalid');
    }
  }
  validateEntryAndForm(entryRow);
}

function handleSalaryChangeSubmitted(checkbox) {
  const entryRow = checkbox.closest('.entry-row');
  const reasonField = entryRow.querySelector('.reason-field');
  if (checkbox.checked) {
    entryRow.classList.add('checkbox-checked');
    reasonField.classList.remove('required', 'invalid');
    if (!reasonField.value.trim()) {
      reasonField.value = '雇用契約書送付済み';
    }
  } else {
    entryRow.classList.remove('checkbox-checked');
    reasonField.classList.add('required');
    if (reasonField.value === '雇用契約書送付済み') {
      reasonField.value = '';
    }
    if (!reasonField.value.trim()) {
      reasonField.classList.add('invalid');
    }
  }
  validateEntryAndForm(entryRow);
}

function validateEntry(entryRow) {
  if (!entryRow) return false;
  let isValid = true;
  
  // 氏名チェック
  const nameField = entryRow.querySelector('.name-field');
  if (!nameField.value.trim()) {
    nameField.classList.add('invalid');
    isValid = false;
  } else {
    nameField.classList.remove('invalid');
  }
  
  // 理由（コメント）チェック
  const reasonField = entryRow.querySelector('.reason-field');
  if (reasonField) {
    const checkbox = entryRow.querySelector('input[type="checkbox"]');
    if (checkbox) {
      if (!checkbox.checked && !reasonField.value.trim()) {
        reasonField.classList.add('invalid');
        isValid = false;
      } else {
        reasonField.classList.remove('invalid');
      }
    } else {
      if (reasonField.classList.contains('required') && !reasonField.value.trim()) {
        reasonField.classList.add('invalid');
        isValid = false;
      } else {
        reasonField.classList.remove('invalid');
      }
    }
  }
  
  // 日付フィールドチェック
  const dateField = entryRow.querySelector('.date-field');
  if (dateField && dateField.classList.contains('required')) {
    if (!dateField.value) {
      dateField.classList.add('invalid');
      isValid = false;
    } else {
      dateField.classList.remove('invalid');
    }
  }
  
  // ラジオボタンのチェック（各グループ）
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
  
  // 「次の人を登録する」ボタン表示：当該エントリーが最後でかつ有効なら表示
  const container = entryRow.closest('[id$="Container"]');
  if (container) {
    const detail = container.closest('.detail-section');
    const addButton = detail.querySelector('button.add-button');
    if (addButton) {
      const isLastEntry = container.lastElementChild === entryRow;
      addButton.style.display = (isValid && isLastEntry) ? 'block' : 'none';
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
  
  // 基本情報チェック
  const officeName = document.getElementById('officeName');
  const reportMonth = document.getElementById('reportMonth');
//  const csvFile = document.getElementById('csvFile');
  
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
  
//  if (!csvFile.files || !csvFile.files.length) {
//    csvFile.classList.add('invalid');
//    csvFile.classList.remove('valid');
//    isValid = false;
//  } else {
//    csvFile.classList.remove('invalid');
//  }
  
  // 各セクションのチェック
  /*2025/07/09 他事業所からのヘルプ追加*/
  const sections = [
    { name: 'hasNewEmployee', container: 'newEmployeeContainer' },
    { name: 'hasRetirement', container: 'retirementContainer' },
    { name: 'hasNoWork', container: 'noWorkContainer' },
    { name: 'hasSalaryChange', container: 'salaryChangeContainer' },
    { name: 'hasAddressChange', container: 'addressChangeContainer' },
	{ name: 'hasOtherHelp', container: 'otherHelpContainer' },
    { name: 'hasLateEarly', container: 'lateEarlyContainer' },
    { name: 'hasLeave', container: 'leaveContainer' }
  ];
  
  sections.forEach(section => {
    const radio = document.querySelector(`input[name="${section.name}"]:checked`);
    if (radio && radio.value === 'yes') {
      const container = document.getElementById(section.container);
      if (container) {
        const entries = container.querySelectorAll('.entry-row');
        // セクションが「あり」なのにエントリーが無い場合は無効
        if (entries.length === 0) isValid = false;
        entries.forEach(entry => {
          if (!validateEntry(entry)) isValid = false;
        });
      }
    }
  });
  
  // 送信ボタンの有効／無効設定（未入力時は disabled ＝ グレー表示）
  const submitButton = document.getElementById('submitButton');
  submitButton.disabled = !isValid;
  
  return isValid;
}

function addEntry(containerId, createFn) {
  const container = document.getElementById(containerId);
  const entry = createFn();
  container.appendChild(entry);
  const nameField = entry.querySelector('.name-field');
  if (nameField) {
    nameField.focus();
  }
  validateEntry(entry);
  validateForm();
}

function removeEntry(button) {
  const entryRow = button.closest('.entry-row');
  const container = entryRow.closest('[id$="Container"]');
  entryRow.remove();
  if (container && container.children.length > 0) {
    validateEntry(container.lastElementChild);
  }
  validateForm();
}
/*2025/07/09 他事業所からのヘルプ追加*/
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
	  'hasOtherHelp',
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
    document.getElementById('csvData').value = '';
    document.getElementById('optionalData').value = '';
//    document.getElementById('csvFile').value = '';
//    document.getElementById('optionalFile').value = '';
    validateForm();
  }
}

function handleSubmit(event) {
  // ブラウザのデフォルトの送信動作をキャンセル
  event.preventDefault();
  
  // 送信ボタンの状態確認
  const submitButton = document.getElementById('submitButton');
  if (submitButton.disabled) return false;
  
  // 入力チェック（必須項目が正しく入力されているか）
  if (!validateForm()) {
    alert('必須項目を入力してください');
    return false;
  }
  
  // 送信中はボタンを無効化し、表示を変更
  submitButton.disabled = true;
  submitButton.textContent = '送信中...';
  
  // フォームの全入力値をオブジェクトに集約
  const jsonData = collectFormData();
  
  // FormData を作成し、jsonData を JSON 文字列として追加
  const formData = new FormData();
  formData.append('jsonData', JSON.stringify(jsonData));
  
  // CSV ファイルが添付されている場合は FormData に追加
//  const csvFileInput = document.getElementById('csvFile');
//  if (csvFileInput && csvFileInput.files && csvFileInput.files[0]) {
//    formData.append('csvFile', csvFileInput.files[0]);
//  }
//  
//  // 追加資料（optionalFile）が添付されている場合は追加
//  const optionalFileInput = document.getElementById('optionalFile');
//  if (optionalFileInput && optionalFileInput.files && optionalFileInput.files[0]) {
//    formData.append('optionalFile', optionalFileInput.files[0]);
//  }
  
  // fetch を使って、GAS のエンドポイントに POST リクエストを送信
  fetch(document.querySelector('form').action, {
    method: 'POST',
    body: formData
  })
  .then(function(response) {
    // レスポンスがエラーの場合は例外を投げる
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(function(responseText) {
    // 送信完了時の処理（アラート表示やフォームのリセット）
    alert('送信が完了しました');
    clearForm();
  })
  .catch(function(error) {
    console.error('送信エラー:', error);
    alert('送信に失敗しました。もう一度お試しください。');
  })
  .finally(function() {
    // 最終的に送信ボタンを再度有効化し、表示を元に戻す
    submitButton.disabled = false;
    submitButton.textContent = 'メール送信';
    validateForm();
  });
  
  return false;
}

function collectFormData() {
  const data = {
    officeName: document.getElementById('officeName').value,
    reportMonth: document.getElementById('reportMonth').value,
    otherComments: document.getElementById('otherComments').value,
    email: document.getElementById('email').value
    // csvData: document.getElementById('csvData').value,
    // optionalData: document.getElementById('optionalData').value
  };
  /*2025/07/09 他事業所からのヘルプ追加*/
  const sections = [
    { name: 'hasNewEmployee', key: 'newEmployee', container: 'newEmployeeContainer' },
    { name: 'hasRetirement', key: 'retirement', container: 'retirementContainer' },
    { name: 'hasNoWork', key: 'noWork', container: 'noWorkContainer' },
    { name: 'hasSalaryChange', key: 'salaryChange', container: 'salaryChangeContainer' },
    { name: 'hasAddressChange', key: 'addressChange', container: 'addressChangeContainer' },
	{ name: 'hasOtherHelp', key: 'otherHelp', container: 'otherHelpContainer' },
    { name: 'hasLateEarly', key: 'lateEarly', container: 'lateEarlyContainer' },
    { name: 'hasLeave', key: 'leave', container: 'leaveContainer' }
  ];
  
  sections.forEach(section => {
    const radio = document.querySelector(`input[name="${section.name}"]:checked`);
    const status = radio ? (radio.value === 'yes' ? 'あり' : 'なし') : 'なし';
    data[section.key] = { status: status };
    if (status === 'あり') {
      data[section.key].entries = collectSectionData(section.key, section.container);
    }
  });
  
  return data;
}
/*2025/07/09 他事業所からのヘルプ追加*/
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
        entryData.docs = !!entry.querySelector('input[name="newEmployeeDocs"]').checked;
        break;
      case 'retirement':
        entryData.comment = entry.querySelector('.reason-field').value;
        break;
      case 'noWork':
        entryData.comment = entry.querySelector('.reason-field').value;
        break;
      case 'salaryChange':
        entryData.submitted = !!entry.querySelector('input[type="checkbox"]').checked;
        entryData.comment = entry.querySelector('.reason-field').value;
        break;
      case 'addressChange':
        entryData.submitted = !!entry.querySelector('input[type="checkbox"]').checked;
        entryData.comment = entry.querySelector('.reason-field').value;
        break;
	  case 'otherHelp':
        entryData.submitted = !!entry.querySelector('input[type="checkbox"]').checked;
        entryData.comment = entry.querySelector('.reason-field').value;
        break;
      case 'lateEarly':
        entryData.date = entry.querySelector('.date-field').value;
        const lateRadio = entry.querySelector('.radio-group input[type="radio"]:checked');
        entryData.type = lateRadio ? lateRadio.value : '';
        entryData.reason = entry.querySelector('.reason-field').value;
        break;
      case 'leave':
        entryData.date = entry.querySelector('.date-field').value;
        const leaveRadio = entry.querySelector('.radio-group input[type="radio"]:checked');
        entryData.type = leaveRadio ? leaveRadio.value : '';
        entryData.reason = entry.querySelector('.reason-field').value;
        break;
      default:
        entryData.comment = entry.querySelector('.reason-field').value;
    }
    data.push(entryData);
  });
  
  return data;
}

/* 各エントリー生成関数 */
/* 新規配属者：初期状態として「社員」を選択 */
function createNewEmployeeEntry() {
  const div = document.createElement('div');
  div.className = 'entry-row';
  const uniqueId = Date.now();
  div.innerHTML = `
    <input type="text" name="newEmployeeName" placeholder="氏名" class="name-field required" maxlength="15"
           onchange="validateEntryAndForm(this.closest('.entry-row'))"
           onkeyup="validateEntryAndForm(this.closest('.entry-row'))">
    <div class="radio-group">
      <input type="radio" name="empType_${uniqueId}" value="社員" required checked
             onchange="validateEntryAndForm(this.closest('.entry-row'))"> 社員
      <input type="radio" name="empType_${uniqueId}" value="PA"
             onchange="validateEntryAndForm(this.closest('.entry-row'))"> PA
    </div>
    <div class="checkbox-group">
      <input type="checkbox" name="newEmployeeDocs" id="docs_${uniqueId}">
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
    <input type="text" name="retirementName" placeholder="氏名" class="name-field required" maxlength="15"
           onchange="validateEntryAndForm(this.closest('.entry-row'))"
           onkeyup="validateEntryAndForm(this.closest('.entry-row'))">
    <textarea name="retirementComment" placeholder="退職日等のコメント" class="reason-field required"
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
    <input type="text" name="noWorkName" placeholder="氏名" class="name-field required" maxlength="15"
           onchange="validateEntryAndForm(this.closest('.entry-row'))"
           onkeyup="validateEntryAndForm(this.closest('.entry-row'))">
    <textarea name="noWorkComment" placeholder="理由" class="reason-field required"
              onchange="validateEntryAndForm(this.closest('.entry-row'))"
              onkeyup="validateEntryAndForm(this.closest('.entry-row'))"></textarea>
    <button type="button" class="remove-button" onclick="removeEntry(this)">削除</button>
  `;
  return div;
}
/*2025/07/09 他事業所からのヘルプ追加*/
function createOtherHelpEntry() {
  const div = document.createElement('div');
  div.className = 'entry-row';
  div.innerHTML = `
    <input type="text" name="otherHelpName" placeholder="氏名" class="name-field required" maxlength="15"
           onchange="validateEntryAndForm(this.closest('.entry-row'))"
           onkeyup="validateEntryAndForm(this.closest('.entry-row'))">
    <textarea name="otherHelpComment" placeholder="ヘルプ元事業所" class="reason-field required"
              onchange="validateEntryAndForm(this.closest('.entry-row'))"
              onkeyup="validateEntryAndForm(this.closest('.entry-row'))"></textarea>
    <button type="button" class="remove-button" onclick="removeEntry(this)">削除</button>
  `;
  return div;
}

function createSalaryChangeEntry() {
  const div = document.createElement('div');
  div.className = 'entry-row';
  const uniqueId = Date.now();
  div.innerHTML = `
    <input type="text" name="salaryChangeName" placeholder="氏名" class="name-field required" maxlength="15"
           onchange="validateEntryAndForm(this.closest('.entry-row'))"
           onkeyup="validateEntryAndForm(this.closest('.entry-row'))">
    <div class="checkbox-group">
      <input type="checkbox" name="salaryChangeSubmitted" id="salary_contract_${uniqueId}"
             onchange="handleSalaryChangeSubmitted(this)">
      <label for="salary_contract_${uniqueId}">雇用契約書を送付済み</label>
    </div>
    <textarea name="salaryChangeComment" placeholder="変更内容" class="reason-field required"
              onchange="validateEntryAndForm(this.closest('.entry-row'))"
              onkeyup="validateEntryAndForm(this.closest('.entry-row'))"></textarea>
    <button type="button" class="remove-button" onclick="removeEntry(this)">削除</button>
  `;
  return div;
}

function createAddressChangeEntry() {
  const div = document.createElement('div');
  div.className = 'entry-row';
  const uniqueId = Date.now();
  div.innerHTML = `
    <input type="text" name="addressChangeName" placeholder="氏名" class="name-field required" maxlength="15"
           onchange="validateEntryAndForm(this.closest('.entry-row'))"
           onkeyup="validateEntryAndForm(this.closest('.entry-row'))">
    <div class="checkbox-group">
      <input type="checkbox" name="addressChangeSubmitted" id="submitted_${uniqueId}"
             onchange="handleAddressChangeSubmitted(this)">
      <label for="submitted_${uniqueId}">変更届を提出済み</label>
    </div>
    <textarea name="addressChangeComment" placeholder="変更内容" class="reason-field required"
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
  const { min, max } = setDateConstraints();
  div.innerHTML = `
    <input type="text" name="lateEarlyName" placeholder="氏名" class="name-field required" maxlength="15"
           onchange="validateEntryAndForm(this.closest('.entry-row'))"
           onkeyup="validateEntryAndForm(this.closest('.entry-row'))">
    <input type="date" name="lateEarlyDate" class="date-field required"
           min="${min}" max="${max}"
           onchange="validateEntryAndForm(this.closest('.entry-row'))">
    <div class="radio-group">
      <input type="radio" name="lateType_${uniqueId}" value="遅刻" required checked
             onchange="validateEntryAndForm(this.closest('.entry-row'))"> 遅刻
      <input type="radio" name="lateType_${uniqueId}" value="早退"
             onchange="validateEntryAndForm(this.closest('.entry-row'))"> 早退
      <input type="radio" name="lateType_${uniqueId}" value="残業"
             onchange="validateEntryAndForm(this.closest('.entry-row'))"> 残業
    </div>
    <textarea name="lateEarlyReason" placeholder="理由" class="reason-field required"
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
  const { min, max } = setDateConstraints();
  div.innerHTML = `
    <input type="text" name="leaveName" placeholder="氏名" class="name-field required" maxlength="15"
           onchange="validateEntryAndForm(this.closest('.entry-row'))"
           onkeyup="validateEntryAndForm(this.closest('.entry-row'))">
    <input type="date" name="leaveDate" class="date-field required"
           min="${min}" max="${max}"
           onchange="validateEntryAndForm(this.closest('.entry-row'))">
    <div class="radio-group">
      <input type="radio" name="leaveType_${uniqueId}" value="有給" required checked
             onchange="validateEntryAndForm(this.closest('.entry-row'))"> 有給
      <input type="radio" name="leaveType_${uniqueId}" value="欠勤"
             onchange="validateEntryAndForm(this.closest('.entry-row'))"> 欠勤
    </div>
    <textarea name="leaveReason" placeholder="理由" class="reason-field required"
              onchange="validateEntryAndForm(this.closest('.entry-row'))"
              onkeyup="validateEntryAndForm(this.closest('.entry-row'))"></textarea>
    <button type="button" class="remove-button" onclick="removeEntry(this)">削除</button>
  `;
  return div;
}

/* 各セクションに対する「追加」関数 */
function addNewEmployee() {
  addEntry('newEmployeeContainer', createNewEmployeeEntry);
}
function addRetirement() {
  addEntry('retirementContainer', createRetirementEntry);
}
function addNoWork() {
  addEntry('noWorkContainer', createNoWorkEntry);
}
/*2025/07/09 他事業所からのヘルプ追加*/
function addOtherHelp() {
  addEntry('otherHelpContainer', createOtherHelpEntry);
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
