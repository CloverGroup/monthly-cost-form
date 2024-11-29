// 初期化
document.addEventListener('DOMContentLoaded', function() {
    // 先月の設定
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
    const year = lastMonth.getFullYear();
    const month = String(lastMonth.getMonth() + 1).padStart(2, '0');
    document.getElementById('reportMonth').value = `${year}-${month}`;

    // 各セクションのラジオボタン制御を設定
    const sections = ['NewEmployee', 'Retirement', 'NoWork', 'SalaryChange', 'AddressChange', 'LateEarly', 'Leave'];
    
    sections.forEach(section => {
        const radios = document.getElementsByName('has' + section);
        radios.forEach(radio => {
            radio.addEventListener('change', function() {
                const detail = document.getElementById(section.toLowerCase() + 'Detail');
                if (detail) {
                    detail.style.display = this.value === 'yes' ? 'block' : 'none';
                    
                    // 「あり」を選択時、コンテナが空なら1行目を追加
                    if (this.value === 'yes') {
                        const container = document.getElementById(section.toLowerCase() + 'Container');
                        if (container && container.children.length === 0) {
                            const addButton = detail.querySelector('.add-button');
                            if (addButton) {
                                addButton.click();
                            }
                        }
                    }
                }
            });
        });
    });
});

// エントリー追加処理
function createEntry(uniqueId) {
    const div = document.createElement('div');
    div.className = 'entry-row';
    div.innerHTML = `
        <input type="text" placeholder="氏名" class="name-field required" maxlength="15">
        <textarea placeholder="理由・コメント" class="reason-field required"></textarea>
        <button type="button" class="remove-button" onclick="this.parentElement.remove()">削除</button>
    `;
    return div;
}

// 各セクションの追加ボタン用関数
function addNewEmployee() {
    const container = document.getElementById('newEmployeeContainer');
    container.appendChild(createEntry(Date.now()));
}

function addRetirement() {
    const container = document.getElementById('retirementContainer');
    container.appendChild(createEntry(Date.now()));
}

function addNoWork() {
    const container = document.getElementById('noWorkContainer');
    container.appendChild(createEntry(Date.now()));
}

function addSalaryChange() {
    const container = document.getElementById('salaryChangeContainer');
    container.appendChild(createEntry(Date.now()));
}

function addAddressChange() {
    const container = document.getElementById('addressChangeContainer');
    container.appendChild(createEntry(Date.now()));
}

function addLateEarly() {
    const container = document.getElementById('lateEarlyContainer');
    container.appendChild(createEntry(Date.now()));
}

function addLeave() {
    const container = document.getElementById('leaveContainer');
    container.appendChild(createEntry(Date.now()));
}

// フォームクリア
function clearForm() {
    if (confirm('入力内容をクリアしてよろしいですか？')) {
        document.getElementById('officeName').value = '';
        document.getElementById('otherComments').value = '';
        document.getElementById('csvFile').value = '';
        
        const sections = ['NewEmployee', 'Retirement', 'NoWork', 'SalaryChange', 'AddressChange', 'LateEarly', 'Leave'];
        
        sections.forEach(section => {
            // ラジオボタンを「なし」に設定
            const radioNo = document.querySelector(`input[name="has${section}"][value="no"]`);
            if (radioNo) {
                radioNo.checked = true;
                
                // 詳細セクションを非表示に
                const detail = document.getElementById(section.toLowerCase() + 'Detail');
                if (detail) {
                    detail.style.display = 'none';
                }
                
                // コンテナをクリア
                const container = document.getElementById(section.toLowerCase() + 'Container');
                if (container) {
                    container.innerHTML = '';
                }
            }
        });
        
        // 先月の設定
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
        const year = lastMonth.getFullYear();
        const month = String(lastMonth.getMonth() + 1).padStart(2, '0');
        document.getElementById('reportMonth').value = `${year}-${month}`;
    }
}
