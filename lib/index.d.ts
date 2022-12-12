declare const get: (body: any, headers: any, subUrl: string) => Promise<any>;
declare const post: (body: object, headers: any | null, subUrl: string) => Promise<any>;
declare const put: (body: object, headers: object | null, subUrl: string) => Promise<any>;
declare const del: (body: object, headers: object | null, subUrl: string) => Promise<any>;
export { get, post, put, del };
