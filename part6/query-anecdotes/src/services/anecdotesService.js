import axios from "axios";

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
    return (await axios.get(baseUrl)).data
}

export const createAnecdote = async (content) => {
    return (await axios.post(baseUrl, content)).data
}

export const voteAnecdote = async (anecdote) => {
    return (await axios.put(`${baseUrl}/${anecdote.id}`, anecdote)).data
}