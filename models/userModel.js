import mangoose from 'mongoose';

const userSchema = mangoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        dateOfBirth: {
            type: Date,
            required: false
        },
        emailAddress: {
            type: String,
            required: true
        },
        isBlocked: {
            type: Boolean,
            required: true
        },
    },
    {
        timestamps: true
    }
)

export const User = mangoose.model('User', userSchema);