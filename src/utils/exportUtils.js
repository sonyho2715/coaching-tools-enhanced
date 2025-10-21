import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';

export const exportToExcel = (data, filename = 'coaching-report.xlsx') => {
  const {
    clientName,
    clientAge,
    clientLocation,
    sessionDate,
    wheelOfLife,
    vakadAnswers,
    quickAssessment,
    totalScore,
    readiness,
    sessionNotes,
    actionPlan,
    coachObservations,
    metaProgramAnswers,
    spiralDynamicsAnswers,
    personalColorAnswers
  } = data;

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Sheet 1: Client Info
  const clientInfo = [
    ['Client Name', clientName || 'N/A'],
    ['Age', clientAge || 'N/A'],
    ['Location', clientLocation || 'N/A'],
    ['Session Date', sessionDate || 'N/A'],
    ['Quick Readiness', `${quickAssessment.readiness}/10`],
    ['Detailed Score', `${totalScore}/160`],
    ['Readiness Level', readiness.level],
    ['Stuck Level', quickAssessment.stuckLevel || 'N/A']
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(clientInfo);
  XLSX.utils.book_append_sheet(wb, ws1, 'Client Info');

  // Sheet 2: Wheel of Life
  const wheelData = [
    ['Area', 'Current', 'Target', 'Gap', 'Needs'],
    ['Spirituality', wheelOfLife.spirituality.current, wheelOfLife.spirituality.target,
     wheelOfLife.spirituality.target - wheelOfLife.spirituality.current, wheelOfLife.spirituality.needs],
    ['Career', wheelOfLife.career.current, wheelOfLife.career.target,
     wheelOfLife.career.target - wheelOfLife.career.current, wheelOfLife.career.needs],
    ['Family', wheelOfLife.family.current, wheelOfLife.family.target,
     wheelOfLife.family.target - wheelOfLife.family.current, wheelOfLife.family.needs],
    ['Relationships', wheelOfLife.relationships.current, wheelOfLife.relationships.target,
     wheelOfLife.relationships.target - wheelOfLife.relationships.current, wheelOfLife.relationships.needs],
    ['Health', wheelOfLife.health.current, wheelOfLife.health.target,
     wheelOfLife.health.target - wheelOfLife.health.current, wheelOfLife.health.needs],
    ['Personal', wheelOfLife.personal.current, wheelOfLife.personal.target,
     wheelOfLife.personal.target - wheelOfLife.personal.current, wheelOfLife.personal.needs],
    ['Leisure', wheelOfLife.leisure.current, wheelOfLife.leisure.target,
     wheelOfLife.leisure.target - wheelOfLife.leisure.current, wheelOfLife.leisure.needs],
    ['Contribution', wheelOfLife.contribution.current, wheelOfLife.contribution.target,
     wheelOfLife.contribution.target - wheelOfLife.contribution.current, wheelOfLife.contribution.needs]
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(wheelData);
  XLSX.utils.book_append_sheet(wb, ws2, 'Wheel of Life');

  // Sheet 3: VAKAD
  const vakadTotals = Object.values(vakadAnswers).reduce((acc, q) => {
    acc.V += q.V || 0;
    acc.A += q.A || 0;
    acc.K += q.K || 0;
    acc.Ad += q.Ad || 0;
    return acc;
  }, { V: 0, A: 0, K: 0, Ad: 0 });

  const vakadData = [
    ['Style', 'Score'],
    ['Visual', vakadTotals.V],
    ['Auditory', vakadTotals.A],
    ['Kinesthetic', vakadTotals.K],
    ['Auditory Digital', vakadTotals.Ad]
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(vakadData);
  XLSX.utils.book_append_sheet(wb, ws3, 'VAKAD');

  // Sheet 4: Notes & Action Plan
  const notesData = [
    ['Session Notes'],
    [sessionNotes || 'No notes'],
    [''],
    ['Coach Observations'],
    [coachObservations || 'No observations'],
    [''],
    ['Action Plan'],
    ...actionPlan.filter(a => a).map((action, i) => [`${i + 1}. ${action}`])
  ];
  const ws4 = XLSX.utils.aoa_to_sheet(notesData);
  XLSX.utils.book_append_sheet(wb, ws4, 'Notes & Actions');

  // Write file
  XLSX.writeFile(wb, filename);
};

export const exportToPDF = (elementId, filename = 'coaching-report.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found for PDF export');
    return Promise.reject('Element not found');
  }

  const opt = {
    margin: 10,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  return html2pdf().set(opt).from(element).save();
};

export const exportToJSON = (data, filename = 'coaching-backup.json') => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const validateExportData = (data) => {
  const errors = [];

  if (!data.clientName || data.clientName.trim() === '') {
    errors.push('Client name is required');
  }

  if (!data.sessionDate) {
    errors.push('Session date is required');
  }

  const wheelAvg = Object.values(data.wheelOfLife).reduce((sum, area) => sum + area.current, 0) / 8;
  if (wheelAvg === 0) {
    errors.push('Please complete at least one assessment (Wheel of Life)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
