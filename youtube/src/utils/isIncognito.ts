export const checkIncognitoMode = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const fs = (window as any).RequestFileSystem || (window as any).webkitRequestFileSystem;

    if (!fs) {
      resolve(false); // Not incognito
    } else {
      fs(
        (window as any).TEMPORARY,
        100,
        () => resolve(false),
        () => resolve(true)
      );
    }
  });
};
