const User = require('../models/User');
const bcrypt = require('bcryptjs');

class PasswordController {
    async changePassword(req, res) {
        try {
            const userId = req.params.id;
            const { currentPassword, newPassword } = req.body;
            const existingUser = await User.findById(userId);
            
            if (!existingUser) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }
            
            if (newPassword.length > 12 || newPassword.length < 3) {
                return res.status(400).json({ message: 'Пароль должен быть не меньше 3 и не больше 12 символов' })
            }

            const isMatch = await bcrypt.compare(currentPassword, existingUser.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Вы ввели неверный пароль' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 8);

            existingUser.password = hashedPassword;
            await existingUser.save();

            res.status(200).json({ message: 'Пароль успешно изменен' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new PasswordController();
