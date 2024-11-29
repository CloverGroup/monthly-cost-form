function doPost(e) {
  // リクエストデータの取得
  const data = JSON.parse(e.postData.contents);
  
  // メール送信
  const emailBody = createEmailBody(data);
  MailApp.sendEmail({
    to: 'soumu.keiri@day-clover.com, fujiwara@day-clover.com',
    subject: `月次人件費確認フォーム - ${data.officeName} - ${data.reportMonth}`,
    body: emailBody
  });

  // レスポンス返却
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'メールを送信しました'
  })).setMimeType(ContentService.MimeType.JSON);
}

// メール本文の作成
function createEmailBody(data) {
  let body = `事業所名: ${data.officeName}\n`;
  body += `報告対象月: ${data.reportMonth}\n\n`;
  
  // 各セクションのデータを追加
  const sections = [
    {key: 'newEmployee', title: '新規配属者'},
    {key: 'retirement', title: '当月退職者'},
    {key: 'noWork', title: '在籍しているが勤務がない人'},
    {key: 'salaryChange', title: '給与・勤務形態の変更'},
    {key: 'addressChange', title: '住所・交通費の変更'},
    {key: 'lateEarly', title: '遅刻・早退等'},
    {key: 'leave', title: '有給・欠勤等'}
  ];
  
  sections.forEach(section => {
    if(data[section.key]) {
      body += `\n■${section.title}\n`;
      data[section.key].forEach(item => {
        body += formatSectionData(item, section.key);
      });
    }
  });
  
  if(data.otherComments) {
    body += `\n■その他コメント\n${data.otherComments}\n`;
  }
  
  return body;
}

// 各セクションのデータフォーマット
function formatSectionData(item, sectionKey) {
  let text = '';
  switch(sectionKey) {
    case 'newEmployee':
      text = `${item.name} (${item.type})`;
      if(item.docs) text += ' - 書類提出済み';
      break;
    case 'retirement':
      text = `${item.name}\n${item.comment}`;
      break;
    case 'lateEarly':
    case 'leave':
      text = `${item.name} - ${item.date} (${item.type})\n理由: ${item.reason}`;
      break;
    default:
      text = `${item.name}\n${item.comment}`;
  }
  return text + '\n';
}
