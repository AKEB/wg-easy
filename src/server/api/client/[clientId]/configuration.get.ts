import { ClientGetSchema } from '#db/repositories/client/types';

function transliterate(str: string): string {
  const map: Record<string, string> = {
    А: 'A',
    а: 'a',
    Б: 'B',
    б: 'b',
    В: 'V',
    в: 'v',
    Г: 'G',
    г: 'g',
    Д: 'D',
    д: 'd',
    Е: 'E',
    е: 'e',
    Ё: 'E',
    ё: 'e',
    Ж: 'Zh',
    ж: 'zh',
    З: 'Z',
    з: 'z',
    И: 'I',
    и: 'i',
    Й: 'Y',
    й: 'y',
    К: 'K',
    к: 'k',
    Л: 'L',
    л: 'l',
    М: 'M',
    м: 'm',
    Н: 'N',
    н: 'n',
    О: 'O',
    о: 'o',
    П: 'P',
    п: 'p',
    Р: 'R',
    р: 'r',
    С: 'S',
    с: 's',
    Т: 'T',
    т: 't',
    У: 'U',
    у: 'u',
    Ф: 'F',
    ф: 'f',
    Х: 'Kh',
    х: 'kh',
    Ц: 'Ts',
    ц: 'ts',
    Ч: 'Ch',
    ч: 'ch',
    Ш: 'Sh',
    ш: 'sh',
    Щ: 'Shch',
    щ: 'shch',
    Ы: 'Y',
    ы: 'y',
    Э: 'E',
    э: 'e',
    Ю: 'Yu',
    ю: 'yu',
    Я: 'Ya',
    я: 'ya',
    Ь: '',
    ь: '',
    Ъ: '',
    ъ: '',
  };
  return str.split('').map((char) => map[char] ?? char).join('');
}

export default definePermissionEventHandler(
  'clients',
  'view',
  async ({ event, checkPermissions }) => {
    const { clientId } = await getValidatedRouterParams(
      event,
      validateZod(ClientGetSchema, event)
    );
    const client = await Database.clients.get(clientId);
    checkPermissions(client);

    if (!client) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Client not found',
      });
    }

    const config = await WireGuard.getClientConfiguration({ clientId });

    // Транслитерируем имя
    const configName = transliterate(client.name)
      .replace(/[^a-zA-Z0-9_=+.-]/g, '-')
      .replace(/(-{2,}|-$)/g, '-')
      .replace(/-$/, '')
      .substring(0, 32);

    setHeader(
      event,
      'Content-Disposition',
      `attachment; filename="${configName || clientId}.conf"`
    );

    setHeader(event, 'Content-Type', 'text/plain');
    return config;
  }
);
