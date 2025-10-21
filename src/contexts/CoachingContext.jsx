import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateClientId, generateSessionId } from '../utils/calculations';

const CoachingContext = createContext();

export const useCoaching = () => {
  const context = useContext(CoachingContext);
  if (!context) {
    throw new Error('useCoaching must be used within CoachingProvider');
  }
  return context;
};

export const CoachingProvider = ({ children }) => {
  // Clients management
  const [clients, setClients] = useLocalStorage('coaching_clients', []);
  const [currentClientId, setCurrentClientId] = useLocalStorage('current_client_id', null);

  // Current client's data
  const [clientName, setClientName] = useState('');
  const [clientAge, setClientAge] = useState('');
  const [clientLocation, setClientLocation] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [actionPlan, setActionPlan] = useState(['', '', '']);
  const [coachObservations, setCoachObservations] = useState('');
  const [redFlags, setRedFlags] = useState([]);
  const [sessionGoal, setSessionGoal] = useState('');
  const [nextSessionDate, setNextSessionDate] = useState('');

  const [readinessScores, setReadinessScores] = useState({
    commitment: [0, 0, 0, 0],
    change: [0, 0, 0, 0],
    awareness: [0, 0, 0, 0],
    resources: [0, 0, 0, 0]
  });

  const [quickAssessment, setQuickAssessment] = useState({
    readiness: 0,
    problemClear: null,
    stuckLevel: null
  });

  const [logicalAnswers, setLogicalAnswers] = useState({});
  const [scoreAnswers, setScoreAnswers] = useState({});
  const [disneyAnswers, setDisneyAnswers] = useState({});
  const [mapUpdateAnswers, setMapUpdateAnswers] = useState({});
  const [personalHistoryAnswers, setPersonalHistoryAnswers] = useState({});
  const [somAnswers, setSomAnswers] = useState({});

  const [vakadAnswers, setVakadAnswers] = useState({
    q1: { K: 0, A: 0, V: 0, Ad: 0 },
    q2: { A: 0, V: 0, Ad: 0, K: 0 },
    q3: { V: 0, K: 0, Ad: 0, A: 0 },
    q4: { A: 0, Ad: 0, K: 0, V: 0 },
    q5: { A: 0, Ad: 0, K: 0, V: 0 }
  });

  const [personalColorAnswers, setPersonalColorAnswers] = useState({});
  const [spiralDynamicsAnswers, setSpiralDynamicsAnswers] = useState({});
  const [metaProgramAnswers, setMetaProgramAnswers] = useState({});

  const [followUpReadinessScores, setFollowUpReadinessScores] = useState({
    commitment: [0, 0, 0, 0],
    change: [0, 0, 0, 0],
    awareness: [0, 0, 0, 0],
    resources: [0, 0, 0, 0]
  });

  const [wheelOfLife, setWheelOfLife] = useState({
    spirituality: { current: 0, target: 10, needs: '' },
    career: { current: 0, target: 10, needs: '' },
    family: { current: 0, target: 10, needs: '' },
    relationships: { current: 0, target: 10, needs: '' },
    health: { current: 0, target: 10, needs: '' },
    personal: { current: 0, target: 10, needs: '' },
    leisure: { current: 0, target: 10, needs: '' },
    contribution: { current: 0, target: 10, needs: '' }
  });

  // Session history for current client
  const [sessionHistory, setSessionHistory] = useState([]);

  // Get current session data
  const getCurrentSessionData = () => ({
    clientName,
    clientAge,
    clientLocation,
    sessionDate,
    sessionNotes,
    actionPlan,
    coachObservations,
    redFlags,
    sessionGoal,
    nextSessionDate,
    readinessScores,
    quickAssessment,
    logicalAnswers,
    scoreAnswers,
    disneyAnswers,
    mapUpdateAnswers,
    personalHistoryAnswers,
    somAnswers,
    vakadAnswers,
    personalColorAnswers,
    spiralDynamicsAnswers,
    metaProgramAnswers,
    followUpReadinessScores,
    wheelOfLife
  });

  // Load client data
  const loadClient = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setCurrentClientId(clientId);
      setClientName(client.name);
      setClientAge(client.age || '');
      setClientLocation(client.location || '');
      setSessionHistory(client.sessions || []);

      // Load latest session if exists
      if (client.sessions && client.sessions.length > 0) {
        const latestSession = client.sessions[client.sessions.length - 1];
        loadSessionData(latestSession);
      } else {
        resetSessionData();
      }
    }
  };

  // Load session data
  const loadSessionData = (session) => {
    setSessionDate(session.sessionDate || '');
    setSessionNotes(session.sessionNotes || '');
    setActionPlan(session.actionPlan || ['', '', '']);
    setCoachObservations(session.coachObservations || '');
    setRedFlags(session.redFlags || []);
    setSessionGoal(session.sessionGoal || '');
    setNextSessionDate(session.nextSessionDate || '');
    setReadinessScores(session.readinessScores || { commitment: [0, 0, 0, 0], change: [0, 0, 0, 0], awareness: [0, 0, 0, 0], resources: [0, 0, 0, 0] });
    setQuickAssessment(session.quickAssessment || { readiness: 0, problemClear: null, stuckLevel: null });
    setLogicalAnswers(session.logicalAnswers || {});
    setScoreAnswers(session.scoreAnswers || {});
    setDisneyAnswers(session.disneyAnswers || {});
    setMapUpdateAnswers(session.mapUpdateAnswers || {});
    setPersonalHistoryAnswers(session.personalHistoryAnswers || {});
    setSomAnswers(session.somAnswers || {});
    setVakadAnswers(session.vakadAnswers || { q1: { K: 0, A: 0, V: 0, Ad: 0 }, q2: { A: 0, V: 0, Ad: 0, K: 0 }, q3: { V: 0, K: 0, Ad: 0, A: 0 }, q4: { A: 0, Ad: 0, K: 0, V: 0 }, q5: { A: 0, Ad: 0, K: 0, V: 0 } });
    setPersonalColorAnswers(session.personalColorAnswers || {});
    setSpiralDynamicsAnswers(session.spiralDynamicsAnswers || {});
    setMetaProgramAnswers(session.metaProgramAnswers || {});
    setFollowUpReadinessScores(session.followUpReadinessScores || { commitment: [0, 0, 0, 0], change: [0, 0, 0, 0], awareness: [0, 0, 0, 0], resources: [0, 0, 0, 0] });
    setWheelOfLife(session.wheelOfLife || { spirituality: { current: 0, target: 10, needs: '' }, career: { current: 0, target: 10, needs: '' }, family: { current: 0, target: 10, needs: '' }, relationships: { current: 0, target: 10, needs: '' }, health: { current: 0, target: 10, needs: '' }, personal: { current: 0, target: 10, needs: '' }, leisure: { current: 0, target: 10, needs: '' }, contribution: { current: 0, target: 10, needs: '' } });
  };

  // Reset session data
  const resetSessionData = () => {
    setSessionDate('');
    setSessionNotes('');
    setActionPlan(['', '', '']);
    setCoachObservations('');
    setRedFlags([]);
    setSessionGoal('');
    setNextSessionDate('');
    setReadinessScores({ commitment: [0, 0, 0, 0], change: [0, 0, 0, 0], awareness: [0, 0, 0, 0], resources: [0, 0, 0, 0] });
    setQuickAssessment({ readiness: 0, problemClear: null, stuckLevel: null });
    setLogicalAnswers({});
    setScoreAnswers({});
    setDisneyAnswers({});
    setMapUpdateAnswers({});
    setPersonalHistoryAnswers({});
    setSomAnswers({});
    setVakadAnswers({ q1: { K: 0, A: 0, V: 0, Ad: 0 }, q2: { A: 0, V: 0, Ad: 0, K: 0 }, q3: { V: 0, K: 0, Ad: 0, A: 0 }, q4: { A: 0, Ad: 0, K: 0, V: 0 }, q5: { A: 0, Ad: 0, K: 0, V: 0 } });
    setPersonalColorAnswers({});
    setSpiralDynamicsAnswers({});
    setMetaProgramAnswers({});
    setFollowUpReadinessScores({ commitment: [0, 0, 0, 0], change: [0, 0, 0, 0], awareness: [0, 0, 0, 0], resources: [0, 0, 0, 0] });
    setWheelOfLife({ spirituality: { current: 0, target: 10, needs: '' }, career: { current: 0, target: 10, needs: '' }, family: { current: 0, target: 10, needs: '' }, relationships: { current: 0, target: 10, needs: '' }, health: { current: 0, target: 10, needs: '' }, personal: { current: 0, target: 10, needs: '' }, leisure: { current: 0, target: 10, needs: '' }, contribution: { current: 0, target: 10, needs: '' } });
  };

  // Create new client
  const createNewClient = (name, age = '', location = '') => {
    const newClient = {
      id: generateClientId(),
      name,
      age,
      location,
      createdAt: new Date().toISOString(),
      sessions: []
    };

    setClients([...clients, newClient]);
    setCurrentClientId(newClient.id);
    setClientName(name);
    setClientAge(age);
    setClientLocation(location);
    setSessionHistory([]);
    resetSessionData();

    return newClient.id;
  };

  // Save current session
  const saveSession = () => {
    if (!currentClientId) {
      console.error('No current client selected');
      return null;
    }

    const sessionData = {
      id: generateSessionId(),
      ...getCurrentSessionData(),
      savedAt: new Date().toISOString()
    };

    const updatedClients = clients.map(client => {
      if (client.id === currentClientId) {
        const updatedSessions = [...(client.sessions || []), sessionData];
        setSessionHistory(updatedSessions);
        return { ...client, sessions: updatedSessions };
      }
      return client;
    });

    setClients(updatedClients);
    return sessionData.id;
  };

  // Delete client
  const deleteClient = (clientId) => {
    setClients(clients.filter(c => c.id !== clientId));
    if (currentClientId === clientId) {
      setCurrentClientId(null);
      setClientName('');
      setClientAge('');
      setClientLocation('');
      setSessionHistory([]);
      resetSessionData();
    }
  };

  // Delete session
  const deleteSession = (sessionId) => {
    if (!currentClientId) return;

    const updatedClients = clients.map(client => {
      if (client.id === currentClientId) {
        const updatedSessions = (client.sessions || []).filter(s => s.id !== sessionId);
        setSessionHistory(updatedSessions);
        return { ...client, sessions: updatedSessions };
      }
      return client;
    });

    setClients(updatedClients);
  };

  const value = {
    // Client management
    clients,
    currentClientId,
    createNewClient,
    loadClient,
    deleteClient,

    // Session management
    sessionHistory,
    saveSession,
    deleteSession,
    loadSessionData,
    getCurrentSessionData,

    // State and setters
    clientName, setClientName,
    clientAge, setClientAge,
    clientLocation, setClientLocation,
    sessionDate, setSessionDate,
    sessionNotes, setSessionNotes,
    actionPlan, setActionPlan,
    coachObservations, setCoachObservations,
    redFlags, setRedFlags,
    sessionGoal, setSessionGoal,
    nextSessionDate, setNextSessionDate,
    readinessScores, setReadinessScores,
    quickAssessment, setQuickAssessment,
    logicalAnswers, setLogicalAnswers,
    scoreAnswers, setScoreAnswers,
    disneyAnswers, setDisneyAnswers,
    mapUpdateAnswers, setMapUpdateAnswers,
    personalHistoryAnswers, setPersonalHistoryAnswers,
    somAnswers, setSomAnswers,
    vakadAnswers, setVakadAnswers,
    personalColorAnswers, setPersonalColorAnswers,
    spiralDynamicsAnswers, setSpiralDynamicsAnswers,
    metaProgramAnswers, setMetaProgramAnswers,
    followUpReadinessScores, setFollowUpReadinessScores,
    wheelOfLife, setWheelOfLife
  };

  return (
    <CoachingContext.Provider value={value}>
      {children}
    </CoachingContext.Provider>
  );
};
