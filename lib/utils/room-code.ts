// Generates a 6-character clean alphanumeric code without confusing characters (0/O, 1/I)
const CODE_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export function generateRoomCode(): string {
  let result = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * CODE_CHARS.length);
    result += CODE_CHARS[randomIndex];
  }
  return result;
}

export function generateGuestToken(): string {
  return 'gst_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
