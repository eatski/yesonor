export const CLIENT_KEY = "6LcvVxAmAAAAABH21d-xJ76J1djolWL3WMaMV8ne"

export const getRecaptchaToken = async (): Promise<string> => {
    return new Promise((resolve,reject) => {
        const timer = setTimeout(() => {
            reject("timeout")
        },1000)
        // @ts-ignore
        const grecaptcha = window.grecaptcha
        grecaptcha.ready(function() {
            grecaptcha.execute(CLIENT_KEY, {action: 'submit'}).then(function(token:string) {
                clearTimeout(timer)
                resolve(token);
            });
        });
    })
}