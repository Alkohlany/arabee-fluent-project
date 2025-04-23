
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://sxigocnatqgqgiedrgue.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4aWdvY25hdHFncWdpZWRyZ3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNTY1ODgsImV4cCI6MjA2MDgzMjU4OH0.JaRFyEuVOC9VXoPFc7ohO77F1qM_NwY_jOgNcSacfp4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// تخزين الرمز المميز (token) في Supabase
export const setAuthToken = (token: string | null) => {
  if (token) {
    // يضبط الجلسة باستخدام الرمز المميز
    supabase.auth.setSession({
      access_token: token,
      refresh_token: '',
    });
  }
};

// دالة لإنشاء صف مستخدم جديد في Supabase
export const createUserRecord = async (userId: string, userData: any) => {
  const { error } = await supabase
    .from('users')
    .insert([
      { 
        id: userId,
        name: userData.Name,
        email: userData.Email,
        password: userData.Password,
        phone: userData.Phone,
        country: userData.Country,
        activate: userData.Activate,
        block: userData.Block,
        credits: userData.Credits,
        user_type: userData.User_Type,
        email_type: userData.Email_Type,
        expiry_time: userData.Expiry_Time,
        start_date: userData.Start_Date,
        hwid: userData.Hwid || "Null",
        uid: userId
      }
    ]);
  
  return { error };
};

// دالة لتحديث بيانات المستخدم
export const updateUserData = async (userId: string, updateData: any) => {
  const { error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId);
  
  return { error };
};

// دالة لاسترداد بيانات المستخدم
export const getUserData = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
};
