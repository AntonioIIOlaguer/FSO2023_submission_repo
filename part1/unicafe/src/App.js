import { useState, useEffect } from "react";
import "./App.css";

const StatisticLine = ({ text, value }) => {
    return (
        <tr>
            <td>{text} </td>
            <td>{value}</td>
        </tr>
    );
};

const Button = ({ handleClick, text }) => {
    return (
        <>
            <button className="button" onClick={handleClick}>
                {text}
            </button>
        </>
    );
};
const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);
    const [average, setAverage] = useState(0);
    const [total, setTotal] = useState(0);
    const [positive, setPositive] = useState(0);

    useEffect(() => {
        if (total > 0) {
            const newAverage = (good - bad) / total;
            console.log(good, bad, total, newAverage);
            const newPositive = good / total;
            setAverage(newAverage);
            setPositive(
                newPositive.toLocaleString(undefined, {
                    style: "percent",
                    minimumFractionDigits: 2,
                })
            );
        }
    }, [good, bad, total]);

    const toDisplay = [
        { text: "Good", count: good, set: setGood },
        { text: "Neutral", count: neutral, set: setNeutral },
        { text: "Bad", count: bad, set: setBad },
        { text: "total", count: total, set: setTotal },
        { text: "Average", count: average, set: setAverage },
        { text: "Positive", count: positive, set: setPositive },
    ];

    const addFeedBack = (feedBack, feedBackFunc) => {
        const newFeedback = feedBack + 1;
        setTotal(total + 1);
        feedBackFunc(newFeedback);
    };

    return (
        <div>
            <h1>Give feedBack</h1>
            {toDisplay.slice(0, 3).map((feedBack, i) => (
                <Button
                    handleClick={() =>
                        addFeedBack(feedBack.count, feedBack.set)
                    }
                    text={feedBack.text}
                    key={i}
                />
            ))}
            <h1>Statistics</h1>
            {total > 0 ? (
                <table>
                    <tbody>
                        {toDisplay.map((feedBack, i) => (
                            <StatisticLine
                                value={feedBack.count}
                                text={feedBack.text}
                                key={i}
                            />
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No feedback given</p>
            )}
        </div>
    );
};

export default App;
