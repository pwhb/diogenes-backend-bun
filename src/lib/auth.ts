export const hash = async (password: string) => await Bun.password.hash(password, {
    algorithm: "argon2id",
});

export const isMatch = async (password: string, hash: string) => await Bun.password.verify(password, hash);