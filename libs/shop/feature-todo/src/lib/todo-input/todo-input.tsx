import React, { useState } from 'react';

const TodoInput = () => {
    const [inputValue, setInputValue] = useState('');

    return (
        <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue((e.target as HTMLInputElement).value)}
        />
    );
};

export default TodoInput;