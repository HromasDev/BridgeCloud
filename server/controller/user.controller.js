const User = require('../models/User');

class UserController {
    async getUser(req, res) {
        try {
            const id = req.params.id;
            const findUser = await User.findById(id);

            const user = await User.findById(req.user.id);

            if (!user || user.role !== 'admin') {
                return res.status(403).json({ message: "Access denied" });
            }

            if (!findUser) {
                return res.status(404).json({ message: `Пользователь с ID ${id} не найден` });
            }

            res.status(200).json(findUser);
        } catch (error) {
            console.log(error);
            res.send({ message: 'Server error' });
        }
    }

    async getUsers(req, res) {
        try {
            const user = await User.findById(req.user.id);

            if (!user || user.role !== 'admin') {
                return res.status(403).json({ message: "Access denied" });
            }

            const users = await User.find().select('-password');
            res.status(200).json(users);
        } catch (error) {
            console.log(error);
            res.send({ message: 'Server error' });
        }
    }

    async setUsers(req, res) {
        try {
            const users = req.body;
            const user = await User.findById(req.user.id);

            if (!user || user.role !== 'admin') {
                return res.status(403).json({ message: "Access denied" });
            }

            for (const user of users) {
                const updatedUser = await User.findByIdAndUpdate(user._id, user, { new: true });
                console.log(updatedUser);
            }

            res.status(200).json(users);
        } catch (error) {
            console.log(error);
            res.send({ message: 'Server error' });
        }
    }

    async deleteUser(req, res) {
        try {
            await User.findByIdAndDelete(req.user.id);
            res.status(200).json({ message: `Пользователь с ID ${req.user.id} удален` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

}

module.exports = new UserController();
