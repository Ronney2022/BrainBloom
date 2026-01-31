
// Browser-safe mock for DB utilities
// In a real production environment, this would run on a Node.js server.
export const db = {
  user: {
    findUnique: async () => null,
    create: async (data: any) => data,
  },
  activity: {
    findMany: async () => [],
    create: async (data: any) => data,
  }
};

export default db;
