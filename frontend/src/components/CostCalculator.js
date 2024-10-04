import React, { useState, useEffect, useCallback } from 'react';

const CostCalculator = ({ quantity, onCostCalculated }) => {
    // State variables to hold individual cost inputs, initialized as empty strings
    const [materialCost, setMaterialCost] = useState('');
    const [laborCost, setLaborCost] = useState('');
    const [overheadCost, setOverheadCost] = useState('');
    const [extraCosts, setExtraCosts] = useState('');
    const [error, setError] = useState('');

    // Validate input to ensure it's a non-negative number
    const validateInput = (value) => {
        const numberValue = parseFloat(value);
        return !isNaN(numberValue) && numberValue >= 0;
    };

    // Handle cost changes with validation
    const handleMaterialCostChange = (e) => {
        const value = e.target.value;
        if (value === '' || validateInput(value)) {
            setMaterialCost(value);
            setError('');
        } else {
            setError('Material cost must be a non-negative number.');
        }
    };

    const handleLaborCostChange = (e) => {
        const value = e.target.value;
        if (value === '' || validateInput(value)) {
            setLaborCost(value);
            setError('');
        } else {
            setError('Labor cost must be a non-negative number.');
        }
    };

    const handleOverheadCostChange = (e) => {
        const value = e.target.value;
        if (value === '' || validateInput(value)) {
            setOverheadCost(value);
            setError('');
        } else {
            setError('Overhead cost must be a non-negative number.');
        }
    };

    const handleExtraCostsChange = (e) => {
        const value = e.target.value;
        if (value === '' || validateInput(value)) {
            setExtraCosts(value);
            setError('');
        } else {
            setError('Extra costs must be a non-negative number.');
        }
    };

    // Calculate the total cost based on inputs and quantity
    const calculateTotalCost = useCallback(() => {
        const totalCost = (
            (parseFloat(materialCost) || 0) +
            (parseFloat(laborCost) || 0) +
            (parseFloat(overheadCost) || 0) +
            (parseFloat(extraCosts) || 0)
        );
        return totalCost * quantity; // Multiply by the requested quantity
    }, [materialCost, laborCost, overheadCost, extraCosts, quantity]);

    // Effect to update the total cost in the parent component
    useEffect(() => {
        const totalCost = calculateTotalCost();
        onCostCalculated(totalCost); // Send the total cost to the parent component
    }, [calculateTotalCost, onCostCalculated]);

    return (
        <div>
            <h2>Production Cost Calculator</h2>
            <div>
                <label>
                    Material Cost (Rs):
                    <input
                        type="number"
                        value={materialCost}
                        onChange={handleMaterialCostChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    Labor Cost (Rs):
                    <input
                        type="number"
                        value={laborCost}
                        onChange={handleLaborCostChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    Overhead Cost (Rs):
                    <input
                        type="number"
                        value={overheadCost}
                        onChange={handleOverheadCostChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    Extra Costs (Rs):
                    <input
                        type="number"
                        value={extraCosts}
                        onChange={handleExtraCostsChange}
                    />
                </label>
            </div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div>
                <h3>Total Estimated Cost for {quantity} units:</h3>
                <ul>
                    <li>Material Cost: Rs {parseFloat(materialCost || 0).toFixed(2)}</li>
                    <li>Labor Cost: Rs {parseFloat(laborCost || 0).toFixed(2)}</li>
                    <li>Overhead Cost: Rs {parseFloat(overheadCost || 0).toFixed(2)}</li>
                    <li>Extra Costs: Rs {parseFloat(extraCosts || 0).toFixed(2)}</li>
                </ul>
                <h3>Overall Total Cost for {quantity} units: Rs {calculateTotalCost().toFixed(2)}</h3>
            </div>
        </div>
    );
};

export default CostCalculator;
