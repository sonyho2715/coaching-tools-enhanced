import React, { useState, useRef } from 'react';
import { Download, FileText, FileSpreadsheet, Upload, Save, AlertCircle } from 'lucide-react';
import { useCoaching } from '../contexts/CoachingContext';
import {
  exportToExcel,
  exportToPDF,
  exportToJSON,
  importFromJSON,
  validateExportData
} from '../utils/exportUtils';

const ExportControls = () => {
  const coaching = useCoaching();
  const [isExporting, setIsExporting] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [showErrors, setShowErrors] = useState(false);
  const fileInputRef = useRef(null);

  const getCurrentData = () => {
    const totalScore = Object.values(coaching.readinessScores).flat().reduce((a, b) => a + b, 0);
    const readiness = getReadinessLevel(totalScore);

    return {
      clientName: coaching.clientName,
      clientAge: coaching.clientAge,
      clientLocation: coaching.clientLocation,
      sessionDate: coaching.sessionDate,
      sessionNotes: coaching.sessionNotes,
      actionPlan: coaching.actionPlan,
      coachObservations: coaching.coachObservations,
      redFlags: coaching.redFlags,
      sessionGoal: coaching.sessionGoal,
      nextSessionDate: coaching.nextSessionDate,
      readinessScores: coaching.readinessScores,
      quickAssessment: coaching.quickAssessment,
      logicalAnswers: coaching.logicalAnswers,
      scoreAnswers: coaching.scoreAnswers,
      disneyAnswers: coaching.disneyAnswers,
      mapUpdateAnswers: coaching.mapUpdateAnswers,
      personalHistoryAnswers: coaching.personalHistoryAnswers,
      somAnswers: coaching.somAnswers,
      vakadAnswers: coaching.vakadAnswers,
      personalColorAnswers: coaching.personalColorAnswers,
      spiralDynamicsAnswers: coaching.spiralDynamicsAnswers,
      metaProgramAnswers: coaching.metaProgramAnswers,
      followUpReadinessScores: coaching.followUpReadinessScores,
      wheelOfLife: coaching.wheelOfLife,
      totalScore,
      readiness
    };
  };

  const getReadinessLevel = (score) => {
    if (score >= 140) return { level: 'Sẵn sàng cao', color: 'text-green-600', bg: 'bg-green-50', icon: '✅', tools: 'SOM, VAKAD, Timeline Therapy, Meta Programs' };
    if (score >= 100) return { level: 'Sẵn sàng trung bình', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '⚠️', tools: 'Well-Formed Outcome, Values Work, Map Update' };
    if (score >= 60) return { level: 'Sẵn sàng thấp', color: 'text-orange-600', bg: 'bg-orange-50', icon: '⚠️', tools: 'Belief Audit, Motivation Building, Rapport' };
    return { level: 'Chưa sẵn sàng', color: 'text-red-600', bg: 'bg-red-50', icon: '❌', tools: 'Tạm hoãn coaching, Tư vấn thêm' };
  };

  const handleExport = async (format) => {
    const data = getCurrentData();
    const validation = validateExportData(data);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setShowErrors(true);
      return;
    }

    setIsExporting(true);
    setValidationErrors([]);
    setShowErrors(false);

    try {
      const filename = `coaching-${data.clientName}-${data.sessionDate || 'no-date'}`;

      switch (format) {
        case 'excel':
          exportToExcel(data, `${filename}.xlsx`);
          break;
        case 'pdf':
          await exportToPDF('comprehensive-report', `${filename}.pdf`);
          break;
        case 'json':
          exportToJSON(data, `${filename}.json`);
          break;
        default:
          console.error('Unknown export format:', format);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Lỗi khi xuất file. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await importFromJSON(file);

      // Restore data
      if (data.clientName) coaching.setClientName(data.clientName);
      if (data.clientAge) coaching.setClientAge(data.clientAge);
      if (data.clientLocation) coaching.setClientLocation(data.clientLocation);
      if (data.sessionDate) coaching.setSessionDate(data.sessionDate);
      if (data.sessionNotes) coaching.setSessionNotes(data.sessionNotes);
      if (data.actionPlan) coaching.setActionPlan(data.actionPlan);
      if (data.coachObservations) coaching.setCoachObservations(data.coachObservations);
      if (data.redFlags) coaching.setRedFlags(data.redFlags);
      if (data.sessionGoal) coaching.setSessionGoal(data.sessionGoal);
      if (data.nextSessionDate) coaching.setNextSessionDate(data.nextSessionDate);
      if (data.readinessScores) coaching.setReadinessScores(data.readinessScores);
      if (data.quickAssessment) coaching.setQuickAssessment(data.quickAssessment);
      if (data.logicalAnswers) coaching.setLogicalAnswers(data.logicalAnswers);
      if (data.scoreAnswers) coaching.setScoreAnswers(data.scoreAnswers);
      if (data.disneyAnswers) coaching.setDisneyAnswers(data.disneyAnswers);
      if (data.mapUpdateAnswers) coaching.setMapUpdateAnswers(data.mapUpdateAnswers);
      if (data.personalHistoryAnswers) coaching.setPersonalHistoryAnswers(data.personalHistoryAnswers);
      if (data.somAnswers) coaching.setSomAnswers(data.somAnswers);
      if (data.vakadAnswers) coaching.setVakadAnswers(data.vakadAnswers);
      if (data.personalColorAnswers) coaching.setPersonalColorAnswers(data.personalColorAnswers);
      if (data.spiralDynamicsAnswers) coaching.setSpiralDynamicsAnswers(data.spiralDynamicsAnswers);
      if (data.metaProgramAnswers) coaching.setMetaProgramAnswers(data.metaProgramAnswers);
      if (data.followUpReadinessScores) coaching.setFollowUpReadinessScores(data.followUpReadinessScores);
      if (data.wheelOfLife) coaching.setWheelOfLife(data.wheelOfLife);

      alert('Đã khôi phục dữ liệu thành công!');
    } catch (error) {
      console.error('Import error:', error);
      alert('Lỗi khi import file. Vui lòng kiểm tra định dạng file.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Validation Errors */}
      {showErrors && validationErrors.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-800 mb-2">Không thể xuất file:</h4>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Export Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => handleExport('pdf')}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition font-semibold"
        >
          <FileText className="w-5 h-5" />
          {isExporting ? 'Đang xuất...' : 'Xuất PDF'}
        </button>

        <button
          onClick={() => handleExport('excel')}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition font-semibold"
        >
          <FileSpreadsheet className="w-5 h-5" />
          {isExporting ? 'Đang xuất...' : 'Xuất Excel'}
        </button>

        <button
          onClick={() => handleExport('json')}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-semibold"
        >
          <Download className="w-5 h-5" />
          {isExporting ? 'Đang xuất...' : 'Backup (JSON)'}
        </button>
      </div>

      {/* Import/Restore */}
      <div className="border-t-2 border-gray-200 pt-4">
        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Khôi phục dữ liệu
        </h4>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
          id="import-file"
        />
        <label
          htmlFor="import-file"
          className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg cursor-pointer transition border-2 border-gray-300 font-medium"
        >
          <Upload className="w-4 h-4" />
          Chọn file JSON để khôi phục
        </label>
        <p className="text-xs text-gray-500 mt-2">
          Chọn file backup (.json) để khôi phục dữ liệu đã lưu trước đó
        </p>
      </div>

      {/* Save Session Button */}
      {coaching.currentClientId && (
        <div className="border-t-2 border-gray-200 pt-4">
          <button
            onClick={() => {
              coaching.saveSession();
              alert('Session đã được lưu vào lịch sử!');
            }}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            <Save className="w-5 h-5" />
            Lưu Session hiện tại
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Lưu session này vào lịch sử của khách hàng để theo dõi tiến trình
          </p>
        </div>
      )}
    </div>
  );
};

export default ExportControls;
