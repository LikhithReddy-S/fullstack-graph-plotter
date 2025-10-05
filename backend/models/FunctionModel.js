const mongoose = require('mongoose');

const functionSchema = mongoose.Schema(
    {
        expression: {
            type: String,
            required: [true, 'Please add a function expression'],
        },
        range_start: {
            type: Number,
            required: [true, 'Please add a start range'],
        },
        range_end: {
            type: Number,
            required: [true, 'Please add an end range'],
        },
        step: {
            type: Number,
            required: [true, 'Please add a step size'],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Function', functionSchema);