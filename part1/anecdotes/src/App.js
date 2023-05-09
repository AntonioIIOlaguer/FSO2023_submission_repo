import { useState, useEffect } from "react";

const randomSelect = (arr) => Math.floor(Math.random() * arr.length);

const AnecdoteDisplay = ({ anecdote, votes }) => {
    return (
        <div>
            <p>{anecdote}</p>
            <p>This annecdote has {votes} points</p>
        </div>
    );
};

const App = () => {
    const anecdotes = [
        "If it hurts, do it more often.",
        "Adding manpower to a late software project makes it later!",
        "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
        "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
        "Premature optimization is the root of all evil.",
        "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
        "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
        "The only way to go fast, is to go well.",
    ];
    const [selected, setSelected] = useState(0);
    const [points, setPoints] = useState(Array(anecdotes.length).fill(0));
    const [top, setTop] = useState(0);

    const vote = (idx) => {
        const copy = [...points];
        copy[idx] += 1;
        setPoints(copy);
    };

    useEffect(() => {
        const maxNum = Math.max(...points);
        setTop(points.indexOf(maxNum));
    }, [points]);

    return (
        <div>
            <div>
                <h1>Annecdote of the Day</h1>
                <AnecdoteDisplay
                    anecdote={anecdotes[selected]}
                    votes={points[selected]}
                />
                <button onClick={() => setSelected(randomSelect(anecdotes))}>
                    Next annecdote
                </button>
                <button onClick={() => vote(selected)}>Vote</button>
            </div>
            <div>
                <h1>Annecdote with Most vote</h1>
                <AnecdoteDisplay
                    anecdote={anecdotes[top]}
                    votes={points[top]}
                />
            </div>
        </div>
    );
};

export default App;
