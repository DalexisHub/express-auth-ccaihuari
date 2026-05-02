import userRepository from '../repositories/UserRepository.js';

function calculateAge(birthdate) {
    const birth = new Date(birthdate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

function formatUser(user) {
    return {
        id: user._id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        birthdate: user.birthdate,
        age: calculateAge(user.birthdate),
        url_profile: user.url_profile,
        adress: user.adress,
        roles: user.roles.map(r => r.name),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}

class UserService {

    async getAll() {
        const users = await userRepository.getAll();
        return users.map(formatUser);
    }

    async getById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }

        return formatUser(user);
    }

    async updateMe(id, payload) {
        const allowedData = {
            name: payload.name,
            lastName: payload.lastName,
            phoneNumber: payload.phoneNumber,
            birthdate: payload.birthdate,
            url_profile: payload.url_profile,
            adress: payload.adress
        };

        Object.keys(allowedData).forEach(key => {
            if (allowedData[key] === undefined) {
                delete allowedData[key];
            }
        });

        const user = await userRepository.updateById(id, allowedData);

        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }

        return formatUser(user);
    }
}

export default new UserService();