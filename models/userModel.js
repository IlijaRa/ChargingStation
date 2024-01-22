const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        dateOfBirth: {
            type: Date,
            required: false
        },
        username: {
            type: String,
            required: true,
            min: 6
        },
        emailAddress: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['admin', 'driver'],
            required: true
        },
        isBlocked: {
            type: Boolean,
            required: true
        }
    },
    {
        timestamps: true
    }
);

UserSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    bcrypt.hash(this.password, 10, (err, passwordHash) => {
        if (err){
            return next(err);
        }

        this.password = passwordHash;
        next();
    });
});

UserSchema.methods.comparePassword = function(password) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, this.password, (err, isMatch) => {
            if (err) {
                reject(err);
            } else {
                resolve(isMatch);
            }
        });
    });
};

module.exports = mongoose.model('User', UserSchema);
// export const User = mongoose.model('User', UserSchema);