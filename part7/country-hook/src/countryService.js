import axios from "axios";

const baseurl = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAll = async () => {
    return await axios.get(`${baseurl}/all`)
}

const getCountry = async (name) => {
    return await axios.get(`${baseurl}/name/${name}`)
}


export default { getAll, getCountry }