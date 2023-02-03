// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getJson = (url: string): Promise<any> => fetch(url).then(response => response.json())
export const getText = (url: string): Promise<string> => fetch(url).then(response => response.text())