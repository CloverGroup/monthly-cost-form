document.addEventListener('DOMContentLoaded', function() {
    setDefaultMonth();
    validateForm();
});

function clearForm() {
    if (confirm('入力内容をクリアしてよろしいですか？')) {
        document.getElementById('costReportForm').reset();
        setDefaultMonth();
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

function toggleSection(containerId, isVisible) {
    const container = document.getElementById(containerId);
    container.style.display = isVisible ? 'block' : 'none';
    validateForm();
}

function addNewEmployee() {
    const container = document.getElementById('newEmployeeContainer');
    const div = document.createElement('div');
    div.className = 'entry-row';
    div.innerHTML = `
        <input type="text" placeholder="氏名" required>
        <button type="button" onclick="removeEntry(this)">削除</button>
    `;
    container.appendChild(div);
}

function removeEntry(button) {
    button.parentNode.remove();
    validateForm();
}

function validateForm() {
    const isValid = document.getElementById('officeName').value.trim() &&
        document.getElementById('reportMonth').value &&
        Array.from(document.getElementsByTagName('input')).every(input => input.checkValidity());
    document.getElementById('submitButton').disabled = !isValid;
}

async function handleSubmit(event) {
    event.preventDefault();
    const formData = {
        officeName: document.getElementById('officeName').value.trim(),
        reportMonth: document.getElementById('reportMonth').value,
        otherComments: document.getElementById('otherComments').value.trim()
    };
    const endpoint = "https://script.google.com/macros/s/AKfycbxt-mCrAUaExDwSY_sHS1SPVBynGFHs6DjUNUVLv1qIg-38jh1zuv04WHO-DJ3Sedvy/exec";
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        const result = await response.json();
        alert(result.message);
    } catch (error) {
        alert(`エラーが発生しました: ${error.message}`);
    }
}
