import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Get these from: https://supabase.com/dashboard/project/_/settings/api
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey;
};

// Helper functions for database operations

export const db = {
  // Users
  async getUser(userId) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) console.error('Error fetching user:', error);
    return data;
  },

  async updateUser(userId, updates) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) console.error('Error updating user:', error);
    return data;
  },

  // Clients
  async getClients(userId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching clients:', error);
    return data || [];
  },

  async createClient(userId, clientData) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('clients')
      .insert([{ user_id: userId, ...clientData }])
      .select()
      .single();

    if (error) console.error('Error creating client:', error);
    return data;
  },

  async updateClient(clientId, updates) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', clientId)
      .select()
      .single();

    if (error) console.error('Error updating client:', error);
    return data;
  },

  async deleteClient(clientId) {
    if (!supabase) return null;
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);

    if (error) console.error('Error deleting client:', error);
    return !error;
  },

  // Assessments
  async getAssessment(clientId) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('client_id', clientId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching assessment:', error);
    }
    return data;
  },

  async saveAssessment(clientId, userId, assessmentData) {
    if (!supabase) return null;

    // Check if assessment exists
    const { data: existing } = await supabase
      .from('assessments')
      .select('id')
      .eq('client_id', clientId)
      .single();

    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('assessments')
        .update(assessmentData)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) console.error('Error updating assessment:', error);
      return data;
    } else {
      // Create new
      const { data, error } = await supabase
        .from('assessments')
        .insert([{ client_id: clientId, user_id: userId, ...assessmentData }])
        .select()
        .single();

      if (error) console.error('Error creating assessment:', error);
      return data;
    }
  }
};

export default supabase;
