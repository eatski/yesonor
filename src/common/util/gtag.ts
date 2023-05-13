export const gtag = (name: string,data?: unknown) => {
    if(process.env.NODE_ENV === "production"){
        // @ts-ignore
        window.gtag(name,data);
    } else {
        console.log("gtag",name,data);
    }
}