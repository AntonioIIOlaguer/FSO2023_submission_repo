const Header = (props) => {
    return (
        <div>
            <h1>{props.course}</h1>
        </div>
    );
};

const Content = (props) => {
    return (
        <div>
            {props.content.map((prop, i) => {
                return (
                    <p key={i}>
                        {prop.part} {prop.exercises}
                    </p>
                );
            })}
        </div>
    );
};

const Total = (props) => {
    let total = 0;
    props.contents.forEach((el) => (total += el.exercises));

    return (
        <div>
            <p>Number of exercises {total}</p>
        </div>
    );
};

const App = () => {
    const course = {
        name: "Half Stack application development",
        parts: [
            {
                part: "Fundamentals of React",
                exercises: 10,
            },
            {
                part: "Using props to pass data",
                exercises: 7,
            },
            {
                part: "State of a component",
                exercises: 14,
            },
        ],
    };

    return (
        <div>
            <Header course={course.name} />
            <Content content={course.parts} />
            <Total contents={course.parts} />
        </div>
    );
};

export default App;
