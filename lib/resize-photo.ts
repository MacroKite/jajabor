// Shrinks a photo in the browser (JPEG, at most maxWidth wide) before upload, so it stays well under the size limit.
export function resizePhoto(file: File, maxWidth = 1600): Promise<string> {
  return new Promise((resolve, reject) => {
    const rd = new FileReader();
    rd.onerror = () => reject(new Error('read'));
    rd.onload = () => {
      const im = new Image();
      im.onerror = () => reject(new Error('decode'));
      im.onload = () => {
        const sc = Math.min(1, maxWidth / im.width), cv = document.createElement('canvas');
        cv.width = Math.round(im.width * sc);
        cv.height = Math.round(im.height * sc);
        cv.getContext('2d')!.drawImage(im, 0, 0, cv.width, cv.height);
        resolve(cv.toDataURL('image/jpeg', 0.8));
      };
      im.src = rd.result as string;
    };
    rd.readAsDataURL(file);
  });
}
