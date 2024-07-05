export const resolveFixturePath = (name: string) => {
    return require.resolve(`./${name}`);
}