// 修正前
function setDefaultMonth() {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
    const year = lastMonth.getFullYear();
    const month = String(lastMonth.getMonth() + 1).padStart(2, '0');
    document.getElementById('reportMonth').value = `${year}-${month}`;
}

// 修正後
function setDefaultMonth() {
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth(); // 0-11

    // 1月の場合は前年の12月にする
    if (month === 0) {
        year = year - 1;
        month = 12;
    }

    const formattedMonth = String(month).padStart(2, '0');
    document.getElementById('reportMonth').value = `${year}-${formattedMonth}`;
}

// 修正前
function clearForm() {
    if (confirm('入力内容をクリアしてよろしいですか？')) {
        document.getElementById('officeName').value = '';
        document.getElementById('otherComments').value = '';
        document.getElementById('csvFile').value = '';

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
            const radioNo = document.querySelector(`input[name="has${section}"][value="no"]`);
            if (radioNo) {
                radioNo.checked = true;
                radioNo.dispatchEvent(new Event('change'));
            }
            const container = document.getElementById(`${section}Container`);
            if (container) {
                container.innerHTML = '';
            }
        });

        setDefaultMonth();
        validateForm();
    }
}

// 修正後
function clearForm() {
    if (confirm('入力内容をクリアしてよろしいですか？')) {
        // 基本フィールドのクリア
        document.getElementById('officeName').value = '';
        document.getElementById('otherComments').value = '';
        document.getElementById('csvFile').value = '';
        
        // 月のリセット（先月の設定）
        setDefaultMonth();

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
            // 詳細セクションを非表示にする
            const detailSection = document.getElementById(`${section}Detail`);
            if (detailSection) {
                detailSection.style.display = 'none';
            }

            // コンテナの中身をクリア
            const container = document.getElementById(`${section}Container`);
            if (container) {
                container.innerHTML = '';
            }

            // ラジオボタンを「なし」に設定
            const radioNo = document.querySelector(`input[name="has${section}"][value="no"]`);
            if (radioNo) {
                radioNo.checked = true;
            }
        });

        validateForm();
    }
}
