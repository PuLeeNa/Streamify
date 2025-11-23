import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = process.env.EXPO_PUBLIC_MOVIE_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const AUTH_STORAGE_KEY = '@streamify_auth';
const SESSION_STORAGE_KEY = '@streamify_session';

interface User {
    id: number;
    username: string;
    name?: string;
    avatar?: {
        gravatar: {
            hash: string;
        };
    };
}

interface AuthResponse {
    success: boolean;
    user?: User;
    sessionId?: string;
    message?: string;
}

// Create a request token
const createRequestToken = async (): Promise<string | null> => {
    try {
        const response = await fetch(`${BASE_URL}/authentication/token/new`, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data.success ? data.request_token : null;
    } catch (error) {
        console.error('Error creating request token:', error);
        return null;
    }
};

// Validate token with login credentials
const validateToken = async (
    username: string,
    password: string,
    requestToken: string
): Promise<boolean> => {
    try {
        const response = await fetch(
            `${BASE_URL}/authentication/token/validate_with_login`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    request_token: requestToken,
                }),
            }
        );
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Error validating token:', error);
        return false;
    }
};

// Create session ID
const createSession = async (requestToken: string): Promise<string | null> => {
    try {
        const response = await fetch(`${BASE_URL}/authentication/session/new`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                request_token: requestToken,
            }),
        });
        const data = await response.json();
        return data.success ? data.session_id : null;
    } catch (error) {
        console.error('Error creating session:', error);
        return null;
    }
};

// Get account details
const getAccountDetails = async (sessionId: string): Promise<User | null> => {
    try {
        const response = await fetch(
            `${BASE_URL}/account?session_id=${sessionId}`,
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        const data = await response.json();
        return {
            id: data.id,
            username: data.username,
            name: data.name,
            avatar: data.avatar,
        };
    } catch (error) {
        console.error('Error getting account details:', error);
        return null;
    }
};

// Main login function
export const loginUser = async (
    username: string,
    password: string
): Promise<AuthResponse> => {
    try {
        // Step 1: Create request token
        const requestToken = await createRequestToken();
        if (!requestToken) {
            return { success: false, message: 'Failed to create request token' };
        }

        // Step 2: Validate token with credentials
        const isValid = await validateToken(username, password, requestToken);
        if (!isValid) {
            return { success: false, message: 'Invalid username or password' };
        }

        // Step 3: Create session
        const sessionId = await createSession(requestToken);
        if (!sessionId) {
            return { success: false, message: 'Failed to create session' };
        }

        // Step 4: Get account details
        const user = await getAccountDetails(sessionId);
        if (!user) {
            return { success: false, message: 'Failed to get account details' };
        }

        // Step 5: Store auth data securely
        await Promise.all([
            AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user)),
            AsyncStorage.setItem(SESSION_STORAGE_KEY, sessionId),
        ]);

        return {
            success: true,
            user,
            sessionId,
        };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'An unexpected error occurred' };
    }
};

// Logout function
export const logoutUser = async (sessionId: string): Promise<boolean> => {
    try {
        // Delete session from TMDB
        await fetch(`${BASE_URL}/authentication/session`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session_id: sessionId,
            }),
        });

        // Clear local storage
        await Promise.all([
            AsyncStorage.removeItem(AUTH_STORAGE_KEY),
            AsyncStorage.removeItem(SESSION_STORAGE_KEY),
        ]);

        return true;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
};

// Validate existing session
export const validateSession = async (sessionId: string): Promise<boolean> => {
    try {
        const response = await fetch(
            `${BASE_URL}/account?session_id=${sessionId}`,
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.ok;
    } catch (error) {
        console.error('Session validation error:', error);
        return false;
    }
};
