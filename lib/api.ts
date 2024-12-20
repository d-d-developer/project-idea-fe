const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

interface AuthResponse {
  accessToken: string;
}

export async function api(endpoint: string, options: ApiOptions = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: Record<string, string> = {
    ...options.headers,
  };

  // Only set Content-Type to application/json if body is not FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }

  console.log('API Request:', {
    url: `${BASE_URL}${endpoint}`,
    method: options.method || 'GET',
    headers,
    body: options.body,
  });

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    // Don't stringify if body is FormData
    body: options.body instanceof FormData ? options.body : (options.body ? JSON.stringify(options.body) : undefined),
  });

  if (!response.ok) {
    let errorMessage = 'API request failed';
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch (e) {
      // If we can't parse the error as JSON, use the status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // Only try to parse JSON if we expect a response
  if (response.status !== 204) {
    try {
      const data = await response.json();
      console.log('API Response:', {
        endpoint,
        status: response.status,
        data,
      });
      return { data };
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      return { data: null };
    }
  }

  return { data: null };
}

// API endpoints
export const categoriesApi = {
  getAll: async () => {
    try {
      const response = await api('/categories');
      console.log('Full API Response:', response);
      if (!response.data || !response.data._embedded || !response.data._embedded.categoryList) {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response structure');
      }
      return response.data._embedded.categoryList;
    } catch (error) {
      console.error('Error in categoriesApi.getAll:', error);
      throw error;
    }
  },
};

export const surveysApi = {
  create: (data: any) => api('/posts/surveys', { method: 'POST', body: data }),
};

export const threadsApi = {
  create: (data: any) => api('/threads', { method: 'POST', body: data }),
  addPost: (threadId: string, postId: string) => 
    api(`/threads/${threadId}/posts/${postId}`, { method: 'POST' }),
};

export const userApi = {
  updateInterests: (categoryIds: string[]) => 
    api('/users/me', { method: 'PATCH', body: { interests: categoryIds } }),
};

export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Authentication failed');
    }
    
    const result = await response.json();
    if (result.accessToken) {
      result.accessToken = result.accessToken.startsWith('Bearer ') ? 
        result.accessToken.slice(7) : result.accessToken;
    }
    return result;
  },
  
  register: async (userData: { email: string; password: string; firstName?: string; lastName?: string }): Promise<AuthResponse> => {
    // First, register the user
    const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    if (!registerResponse.ok) {
      const error = await registerResponse.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    // After successful registration, automatically log in using the correct endpoint
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
    });

    if (!loginResponse.ok) {
      const error = await loginResponse.json();
      throw new Error(error.message || 'Auto-login after registration failed');
    }

    const result = await loginResponse.json();
    return result;
  },
  
  validateToken: (token: string): boolean => {
    if (!token) return false;
    
    try {
      // Remove "Bearer " prefix for validation
      const tokenPart = token.startsWith('Bearer ') ? token.slice(7) : token;
      
      // Basic JWT structure validation
      const [header, payload, signature] = tokenPart.split('.');
      if (!header || !payload || !signature) return false;
      
      // Decode the payload
      const decodedPayload = JSON.parse(atob(payload));
      
      // Check token expiration
      const expirationTime = decodedPayload.exp * 1000; // Convert to milliseconds
      if (Date.now() >= expirationTime) {
        localStorage.removeItem('token');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  },
};
