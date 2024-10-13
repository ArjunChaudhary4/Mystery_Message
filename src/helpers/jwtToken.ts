import { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`); 
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift();
    }
    return undefined;
};

interface JwtResponse {
    userData: Record<string, any> | null; // Adjust as needed for your user data structure
    message: string | null;
}

const useJwtDisplay = (): JwtResponse => {
    const [userData, setUserData] = useState<Record<string, any> | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const token = getCookie('loginToken'); // Replace with your actual cookie name
        if (!token) {
            setMessage('Not logged in');
            return;
        }

        try {
            const decoded = jwtDecode(token); // Ensure this line uses jwtDecode correctly
            setUserData(decoded);
        } catch (error) {
            setMessage('Token decoding failed');
            console.error('JWT Decoding Error:', error);
            console.log('Token:', token);
        }
    }, []);

    return { userData, message };
};

export default useJwtDisplay;
