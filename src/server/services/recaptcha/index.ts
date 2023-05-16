export const verifyRecaptcha = async (token: string): Promise<void> => {
    const res = await fetch(`https://recaptcha.net/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,{
        method: "POST"
    });
    const json = await res.json();
    if(!json.success){
        throw new Error("Recaptcha failed")
    };
}