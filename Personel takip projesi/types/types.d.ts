// types.d.ts
declare module '@/services/database' {
    export const loginUser: (username: string, password: string) => Promise<{
      success: boolean;
      error?: string;
    }>;
    
    export const fetchEmployees: () => Promise<any>;
  }
  
  declare module '@expo/vector-icons' {
    export const Ionicons: any;
  }