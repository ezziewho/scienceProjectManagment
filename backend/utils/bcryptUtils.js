import bcrypt from "bcrypt";

const salt = 10;

export const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password.toString(), salt, (err, hash) => {
            if (err) reject(err);
            resolve(hash);
        });
    });
};

export const comparePassword = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password.toString(), hash, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};
