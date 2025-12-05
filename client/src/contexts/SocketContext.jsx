import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import useAuthContext from '@/hooks/useAuthContext';
import { env } from '@/env/config';
import { toast } from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      const newSocket = io(env.SERVER_URL);
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
        
        // Join user-specific room
        // Note: user object structure depends on auth response. 
        // Assuming user has studentId/facultyId/instituteId or _id
        
        if (user.studentId) {
            newSocket.emit('joinRoom', `user_${user.studentId}`);
        } else if (user.facultyId) {
            newSocket.emit('joinRoom', `user_${user.facultyId}`);
        } else if (user.instituteId) {
             // Admin might want to join institute room
             newSocket.emit('joinRoom', `institute_${user.instituteId}`);
        } else if (user._id) {
             // Fallback to user ID if specific role IDs are not present
             newSocket.emit('joinRoom', `user_${user._id}`);
        }
      });

      newSocket.on('notification', (data) => {
        console.log('Notification received:', data);
        toast(data.message, {
            icon: data.type === 'ACTIVITY_APPROVED' ? '✅' : data.type === 'ACTIVITY_REJECTED' ? '❌' : '🔔',
            duration: 5000
        });
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
