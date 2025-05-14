

import API from './auth'; 

export interface UpdatePreferencesPayload {
  device_token: string | null;
  notifications_enabled: boolean;
}

export interface UserWithPrefs {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  role: string;
  active_plan: string;
  device_token: string | null;
  notifications_enabled: boolean;
}

export interface UpdatePreferencesResponse {
  message: string;
  user: UserWithPrefs;
}


export async function updatePreferences(
  payload: UpdatePreferencesPayload
): Promise<UserWithPrefs> {
  const res = await API.post<UpdatePreferencesResponse>(
    '/update_preferences',
    payload
  );
  return res.data.user;
}
