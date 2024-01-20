import mangoose from 'mongoose';

const adminSchema = mangoose.Schema(
    {
        isAdmin: {
            type: Boolean,
            required: true
        },
    },
    {
        timestamps: true
    }
)

export const Admin = mangoose.model('Admin', adminSchema);