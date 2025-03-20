const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minLength: [3, 'Username must be at least 3 characters'],
            maxLength: [30, 'Username must be at most 30 characters'],
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, 'Invalid email format'],
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minLength: [6, 'Password must be at least 6 characters'],
        },
        avatar: {
            type: String,
            default: 'avatar_default.jpg',
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        refreshToken: {
            type: String,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

// 👉 Hash password before saving
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        // ✅ Kiểm tra nếu mật khẩu thay đổi
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// 👉 Verify password before logging in
UserSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
