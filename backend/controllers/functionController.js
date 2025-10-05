const asyncHandler = require('express-async-handler'); // Helper for async/await in Express routes
const { evaluate } = require('mathjs'); // For evaluating mathematical expressions
const FunctionModel = require('../models/FunctionModel');

// @desc    Evaluate function points
// @route   POST /api/eval
// @access  Public
const evaluateFunction = asyncHandler(async (req, res) => {
    const { func, range, step } = req.body; // Using 'func' to avoid conflict with FunctionModel

    if (!func || !range || !Array.isArray(range) || range.length !== 2 || typeof step === 'undefined') {
        res.status(400);
        throw new Error('Please provide function, range (start, end), and step.');
    }

    const [start, end] = range;
    const points = [];

    // Basic validation for range and step
    if (start >= end || step <= 0 || (end - start) / step > 100000) { // Limit points to prevent performance issues
        res.status(400);
        throw new Error('Invalid range or step size. Ensure start < end, step > 0, and not too many points.');
    }

    try {
        const compiledFunc = evaluate(func, { x: 0 }); // Pre-compile to check for syntax errors
        // Note: mathjs evaluate function is safer than plain eval()
        // It compiles the expression and evaluates it in a sandboxed environment.

        for (let x = start; x <= end; x += step) {
            const y = evaluate(func, { x: x });
            // Check for valid numbers (no NaNs or infinities)
            if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
                points.push([x, y]);
            }
        }
        res.json({ points });
    } catch (error) {
        res.status(400);
        throw new Error(`Error evaluating function: ${error.message}`);
    }
});

// @desc    Save a function
// @route   POST /api/save
// @access  Public
const saveFunction = asyncHandler(async (req, res) => {
    const { expression, range_start, range_end, step } = req.body;

    if (!expression || typeof range_start === 'undefined' || typeof range_end === 'undefined' || typeof step === 'undefined') {
        res.status(400);
        throw new Error('Please include all function details (expression, range_start, range_end, step).');
    }

    const savedFunction = await FunctionModel.create({
        expression,
        range_start,
        range_end,
        step,
    });

    res.status(201).json(savedFunction);
});

// @desc    Get all saved functions
// @route   GET /api/list
// @access  Public
const listFunctions = asyncHandler(async (req, res) => {
    const functions = await FunctionModel.find({}).sort({ createdAt: -1 }); // Sort by creation date
    res.json(functions);
});

// @desc    Delete a saved function
// @route   DELETE /api/delete/:id
// @access  Public
const deleteFunction = asyncHandler(async (req, res) => {
    const functionToDelete = await FunctionModel.findById(req.params.id);

    if (!functionToDelete) {
        res.status(404);
        throw new Error('Function not found');
    }

    await functionToDelete.deleteOne(); // Use deleteOne() or remove()
    res.json({ message: 'Function removed', id: req.params.id });
});

module.exports = {
    evaluateFunction,
    saveFunction,
    listFunctions,
    deleteFunction,
};