export default defineEventHandler(async () => {
  const users = await Database.users.getAll();
  return users.map((u: any) => ({ id: String(u.id), name: u.name }));
});