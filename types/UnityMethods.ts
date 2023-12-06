export interface UnityAuthor {
    id: string;
    firstName: string;
    lastName: string | undefined;
    fullName: string;
    username?: string;
}

export interface UnityMethods {
    replyWithText: (text: string)=>void;
    getAuthor: ()=>(UnityAuthor | undefined)
}