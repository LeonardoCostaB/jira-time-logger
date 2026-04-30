export async function sendDiscordNotification(message: string) {
    const config = useRuntimeConfig();

    const payload = {
        content: message,
    };

    try {
        await fetch(`https://discord.com/api/v10/channels/${config.DISCORD_CHANNEL_ID}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bot ${config.DISCORD_BOT_TOKEN}`,
            },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        console.error('Failed to send Discord notification:', error);
    }
}
