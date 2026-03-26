import { user, userState } from '@/types/auth'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const useUserStore = create<userState>()(
  persist(
    (set) => ({
  user: null,
  setUser: (user:user|undefined) => set({ user }),
  removeUser: () => {
    set({ user: null });
    localStorage.removeItem('user-storage');
  },
  }),
  {
    name: 'user-storage',
    storage: createJSONStorage(() => localStorage),
  } 
))