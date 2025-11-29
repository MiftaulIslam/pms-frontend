export const emojiToImageFile = async (emoji: string, fileName = 'avatar.png'): Promise<File> => {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Could not get canvas context');
    }

    // Set canvas size (128x128 is a good size for avatars)
    canvas.width = 128;
    canvas.height = 128;

    // Set background (optional - you can make it transparent)
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set font and draw emoji
    ctx.font = '80px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, canvas.width / 2, canvas.height / 2);

    // Convert canvas to blob
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], fileName, { type: 'image/png' });
                resolve(file);
            } else {
                reject(new Error('Could not convert canvas to blob'));
            }
        }, 'image/png');
    });
};
