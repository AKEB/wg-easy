import { ClientCreateSchema } from '#db/repositories/client/types';

export default definePermissionEventHandler(
  'clients',
  'create',
  async ({ event, user }) => {
    const { name, expiresAt } = await readValidatedBody(
      event,
      validateZod(ClientCreateSchema, event)
    );

    await Database.clients.create({ name, expiresAt, userId: user.id });
    await WireGuard.saveConfig();
    return { success: true };
  }
);
