const Header = (props) => {
    return (
        <div>
            <h1>{props.course}</h1>
        </div>
    );
};

const Content = ({ parts }) => {
    return (
        <div>
            {parts.map((part, i) => {
                return (
                    <p key={i}>
                        {part.name} {part.exercises}
                    </p>
                );
            })}
        </div>
    );
};

const Total = ({ parts }) => {
    const total = parts.reduce((acc, part) => acc + part.exercises, 0);

    return (
        <div>
            <h4>Number of exercises {total}</h4>
        </div>
    );
};

const Course = ({ course }) => {
    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    );
};

const Courses = ({ courses }) => {
    return (
        <div>
            {courses.map((course, i) => {
                return <Course course={course} key={i} />;
            })}
        </div>
    );
};

export default Courses;
