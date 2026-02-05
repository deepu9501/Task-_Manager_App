const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    category: {
        type: String,
        enum: ['Work', 'Personal', 'Urgent', 'Other'],
        default: 'Other'
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    dueDate: {
        type: Date
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for faster queries
taskSchema.index({ userId: 1, isCompleted: 1 });
taskSchema.index({ userId: 1, category: 1 });
taskSchema.index({ userId: 1, priority: 1 });

module.exports = mongoose.model('Task', taskSchema);
