import { useState, useEffect } from "react";
import axios from "axios";

const Countries = ({ countries, setCountriesToShow }) => {
    const showCountry = (country) => setCountriesToShow([country]);
    if (countries.length === 1) {
        console.log("1 coutnry");
        const country = countries[0];
        return (
            <div>
                <h1>{country.name.common}</h1>
                <p>Capital: {country.capital}</p>
                <p>Area: {country.area}</p>
                <h2>Languages</h2>
                <ul>
                    {Object.values(country.languages).map((language, i) => (
                        <li key={i}>{language}</li>
                    ))}
                </ul>
                <img src={country.flags.png} alt={country.flags.alt} />

                <h1>Weather in {country.capital}</h1>
                <Weather city={country.capital} />
            </div>
        );
    }

    return (
        <ul>
            {countries.map((country, i) => {
                return (
                    <li key={i}>
                        {country.name.common}
                        <button onClick={() => showCountry(country)}>
                            Show
                        </button>
                    </li>
                );
            })}{" "}
        </ul>
    );
};

const Weather = ({ city }) => {
    const apiKey = process.env.REACT_APP_API_OPEN_WEATHER;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const [weatherData, setWeatherData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(url).then((res) => {
            console.log(res.data);
            setWeatherData(res.data);
            setIsLoading(false);
        });
    }, [url]);

    if (isLoading) {
        return <div>Loading ...</div>;
    }

    const weatherImgUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    return (
        <div>
            <p>Temprature is {weatherData.main.temp} Celcius</p>
            <img src={weatherImgUrl} alt={weatherData.weather.description} />
            <p>Wind {weatherData.wind.speed}</p>
        </div>
    );
};
const App = () => {
    const [filter, setFilter] = useState("");
    const [countries, setCountries] = useState([]);
    const [countriesToShow, setCountriesToShow] = useState([]);

    const handleFilterChange = (evt) => {
        setFilter(evt.target.value);
    };

    useEffect(() => {
        const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";
        axios.get(`${baseUrl}/all`).then((response) => {
            setCountries(response.data);
        });
    }, []);

    useEffect(() => {
        filter
            ? setCountriesToShow(
                  countries.filter((country) =>
                      country.name.common.toLowerCase().includes(filter)
                  )
              )
            : setCountriesToShow([]);
    }, [filter, countries]);

    return (
        <div>
            <h2>Find Countries</h2>
            <input value={filter} onChange={handleFilterChange}></input>
            <Countries
                countries={countriesToShow}
                setCountriesToShow={setCountriesToShow}
            />
        </div>
    );
};

export default App;
