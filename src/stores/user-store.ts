import { user, userState } from '@/types/auth'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const useUserStore = create<userState>()(
  persist(
    (set) => ({
      user: null,
      clientToken: null,
      setClientToken: (clientToken: string | undefined) => set({ clientToken }),
      setUser: (user:user|undefined) => set({ user }),
      removeUser: () => {
        set({ user: null ,clientToken: null });
        localStorage.removeItem('user-storage');
      },
  }),
  {
    name: 'user-storage',
    storage: createJSONStorage(() => localStorage),
  } 
))