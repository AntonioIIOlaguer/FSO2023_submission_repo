import { useState, useEffect } from "react";
import phonebookService from "./services/phonebookService";
import "./App.css";

const AddContactForm = ({ persons, setPersons, setNotificationMessage }) => {
    const [newInput, setNewInput] = useState({ name: "", number: "" });

    const handleInputChange = (event) => {
        const value = event.target.value;
        setNewInput({
            ...newInput,
            [event.target.name]: value,
        });
    };

    const addPerson = (event) => {
        event.preventDefault();
        const existingPerson = persons.find(
            (person) => person.name === newInput.name
        );

        if (existingPerson) {
            const confirm = window.confirm(
                `${newInput.name} is already added to the phonebook, replace the old number with a new one?`
            );
            if (confirm) {
                const updatedPerson = {
                    ...existingPerson,
                    number: newInput.number,
                };
                phonebookService
                    .update(existingPerson.id, updatedPerson)
                    .then((updatedData) => {
                        setPersons(
                            persons.map((person) =>
                                person.id === updatedData.id
                                    ? updatedData
                                    : person
                            )
                        );
                        setNotificationMessage({
                            type: "sucess",
                            text: `Successfuly update the number of ${updatedData.name}`,
                        });
                        setTimeout(() => setNotificationMessage(null), 5000);
                    });
            }
        } else {
            let newContact = {
                ...newInput,
                id: persons.length + 1,
            };
            // eslint-disable-next-line no-loop-func
            while (persons.find((person) => person.id === newContact.id)) {
                newContact = {
                    ...newContact,
                    id: newContact.id + 1,
                };
            }
            phonebookService.create(newContact).then((returnedPerson) => {
                setPersons(persons.concat(returnedPerson));
                setNotificationMessage({
                    type: "sucess",
                    text: `Successfuly added ${returnedPerson.name} to the Phonebook`,
                });
                setTimeout(() => setNotificationMessage(null), 5000);
            });
        }

        setNewInput({ name: "", number: "" });
    };

    return (
        <form onSubmit={addPerson}>
            <div>
                Name:{" "}
                <input
                    name="name"
                    value={newInput.name}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                Number:{" "}
                <input
                    name="number"
                    value={newInput.number}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    );
};

const Numbers = ({ persons, setPersons, setNotificationMessage }) => {
    const deletePerson = (id) => {
        const personToDelete = persons.find((person) => person.id === id);
        const confirm = window.confirm(
            `Do you really want to delete ${personToDelete.name}`
        );
        if (confirm) {
            phonebookService
                .remove(id)
                .then((res) => {
                    if (res) {
                        const newPersons = persons.filter(
                            (person) => person.id !== id
                        );
                        setPersons(newPersons);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setNotificationMessage({
                        type: "error",
                        text: `Information of ${personToDelete.name} has already been removed from server`,
                    });
                    setTimeout(() => setNotificationMessage(null), 5000);

                    setPersons(persons.filter((person) => person.id !== id));
                });
        }
    };
    return (
        <div>
            <h2>Numbers</h2>
            <ul>
                {persons.map((person) => (
                    <li key={person.id}>
                        {person.name}: {person.number}
                        <button onClick={() => deletePerson(person.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const Filter = ({ filter, setFilter }) => {
    const handleChange = (event) => {
        setFilter(event.target.value);
    };
    return (
        <div>
            <h2>Filter</h2>
            <input name="filter" onChange={handleChange} value={filter} />;
        </div>
    );
};

const Notification = ({ message }) => {
    if (message === null) {
        return null;
    }
    switch (message.type) {
        case "sucess":
            return <div className="notification sucess">{message.text}</div>;

        case "error":
            return <div className="notification error">{message.text}</div>;
        default:
            break;
    }
};

const App = () => {
    const [persons, setPersons] = useState([]);
    const [filter, setFilter] = useState("");
    const [notificationMessage, setNotificationMessage] = useState(null);

    const personsToShow = filter
        ? persons.filter((person) => person.name.toLowerCase().includes(filter))
        : persons;

    useEffect(() => {
        phonebookService
            .getAll()
            .then((personsData) => setPersons(personsData));
    }, []);

    return (
        <div>
            <Notification message={notificationMessage} />
            <h2>Phonebook</h2>

            <AddContactForm
                persons={persons}
                setPersons={setPersons}
                setNotificationMessage={setNotificationMessage}
            />
            <Filter filter={filter} setFilter={setFilter} />
            <Numbers
                persons={personsToShow}
                setPersons={setPersons}
                setNotificationMessage={setNotificationMessage}
            />
        </div>
    );
};

export default App;
