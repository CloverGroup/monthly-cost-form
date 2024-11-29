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

function setDefaultMonth() {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth()
